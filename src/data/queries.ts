import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Election, ElectionWinnersResponse, ElectionId, ElectionCandidate } from '@/data/model/models';
import { auth } from './firebaseClient';
import useFirebaseUser from './useFirebaseUser';
import { useQueryElectionId, useQueryNumWinners } from './useQueryParams';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ============ Types ============

interface CreateElectionRequest {
  name: string;
  candidates: string[];
}

// ============ Fetch Functions ============

async function fetchCurrentUsersElections(idToken: string | undefined): Promise<Election[]> {
  if (!idToken) {
    throw new Error('You must be signed in to complete that action.');
  }

  const response = await fetch(`${BASE_URL}elections`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return [];
  }

  return response.json();
}

async function fetchElection(electionId: ElectionId): Promise<Election> {
  const response = await fetch(`${BASE_URL}elections/${electionId}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function fetchElectionResults(
  electionId: ElectionId,
  numWinners: number
): Promise<ElectionWinnersResponse> {
  const response = await fetch(
    `${BASE_URL}elections/results?electionId=${electionId}&numWinners=${numWinners}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function postCreateElection(request: CreateElectionRequest): Promise<Election> {
  await auth.authStateReady();
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken) {
    throw new Error('You must be signed in to complete that action.');
  }

  const response = await fetch(`${BASE_URL}elections/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function postVote(
  electionId: ElectionId,
  rankings: ElectionCandidate[]
): Promise<Response> {
  await auth.authStateReady();
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken) {
    throw new Error('You must be signed in to complete that action.');
  }

  const request = rankings.map((candidate, index) => ({
    candidateId: candidate.id,
    rank: index + 1,
  }));

  const response = await fetch(`${BASE_URL}elections/vote?electionId=${electionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

async function closeElection(
  electionId: ElectionId,
  numWinners: number
): Promise<ElectionWinnersResponse> {
  await auth.authStateReady();
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken) {
    throw new Error('You must be signed in to complete that action.');
  }

  const response = await fetch(
    `${BASE_URL}elections/close?electionId=${electionId}&numWinners=${numWinners}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============ Query Hooks ============

export function useCurrentUsersElections() {
  const { status, user } = useFirebaseUser();

  return useQuery({
    queryKey: ['elections', user?.uid],
    queryFn: async () => {
      const idToken = await user?.getIdToken();
      return fetchCurrentUsersElections(idToken);
    },
    enabled: status !== 'loading',
  });
}

export function useElection() {
  const queryParam = useQueryElectionId();

  return useQuery({
    queryKey: ['election', queryParam.data],
    queryFn: () => {
      if (!queryParam.data) {
        throw new Error('No electionId provided');
      }
      return fetchElection(queryParam.data);
    },
    enabled: !queryParam.isLoading && queryParam.data !== null,
  });
}

export function useElectionResults() {
  const electionIdQueryParam = useQueryElectionId();
  const numWinnersQueryParam = useQueryNumWinners();

  return useQuery({
    queryKey: [
      'election-results',
      electionIdQueryParam.data,
      numWinnersQueryParam.data,
    ],
    queryFn: () => {
      if (!electionIdQueryParam.data) {
        throw new Error("Hmm we can't find results for that election 🔎");
      }
      return fetchElectionResults(
        electionIdQueryParam.data,
        numWinnersQueryParam.data
      );
    },
    enabled:
      !electionIdQueryParam.isLoading &&
      !numWinnersQueryParam.isLoading &&
      electionIdQueryParam.data !== null &&
      numWinnersQueryParam.data !== null,
  });
}

// ============ Mutation Hooks ============

export function useCreateElection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateElectionRequest) => postCreateElection(request),
    onSuccess: () => {
      // Invalidate the elections list so it refetches
      queryClient.invalidateQueries({ queryKey: ['elections'] });
    },
  });
}

export function useSendVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ electionId, rankings }: { electionId: ElectionId; rankings: ElectionCandidate[] }) =>
      postVote(electionId, rankings),
    onSuccess: (_, variables) => {
      // Invalidate election results since vote count changed
      queryClient.invalidateQueries({ queryKey: ['election-results', variables.electionId] });
      // Also invalidate the election itself (voter count may have changed)
      queryClient.invalidateQueries({ queryKey: ['election', variables.electionId] });
    },
  });
}

export function useCloseElection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ electionId, numWinners }: { electionId: ElectionId; numWinners: number }) =>
      closeElection(electionId, numWinners),
    onSuccess: (data, variables) => {
      // Update the cached results with the new data
      queryClient.setQueryData(
        ['election-results', variables.electionId, variables.numWinners],
        data
      );
      // Invalidate to ensure freshness
      queryClient.invalidateQueries({
        queryKey: ['election-results', variables.electionId],
      });
      // Also invalidate elections list (election status changed to closed)
      queryClient.invalidateQueries({ queryKey: ['elections'] });
    },
  });
}

