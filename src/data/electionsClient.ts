import { useSearchParams } from "next/navigation";
import { ElectionWinnersResponse, ElectionId, ElectionCandidate, Election } from "@/data/model/models";
import { auth, createUserWithEmailAndPassword } from "./firebaseClient";
import useFirebaseUser from "./useFirebaseUser"
import { useEffect, useState } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

///////TYPES

interface QueryParamState<T> {
  data: T | null,
  isLoading: boolean,
  failure: Error | null
}

interface CreateUserRequest {
  email: string,
  password: string,
}

interface CreateElectionRequest {
  name: string
  candidates: string[]
}

/////FUNCTIONS

export async function createNewElection(request: CreateElectionRequest) {
  await auth.authStateReady()
  const idToken = await auth.currentUser?.getIdToken()
  console.log(request)
  const response = await fetch(`${BASE_URL}elections/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(request),
  })

  console.log(response)
  return response
}

export async function createUser(request: CreateUserRequest) {
  const credentials = await createUserWithEmailAndPassword(auth, request.email, request.password)
  const idToken = await credentials.user.getIdToken()
  return await fetch(`${BASE_URL}users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
}

export async function sendVote(electionId: ElectionId, rankings: ElectionCandidate[]) {
  await auth.authStateReady()
  const idToken = await auth.currentUser?.getIdToken()
  const request = rankings.map((candidate, index) => {
    return {
      candidateId: candidate.id,
      rank: (index + 1)
    }
  })
  return await fetch(`${BASE_URL}elections/vote?electionId=${electionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(request)
  })
}

//////HOOKS

export function useQueryElectionId(): QueryParamState<ElectionId> {
  const queryParams = useSearchParams()
  const [state, setState] = useState<QueryParamState<ElectionId>>({
    data: null,
    isLoading: true,
    failure: null,
  })

  useEffect(() => {
    const parsedId = queryParams.get("electionId")
    if (parsedId !== undefined && parsedId != null && parsedId.length > 1) {
      setState({ data: parsedId, isLoading: false, failure: null });
    } else {
      setState({ data: null, isLoading: false, failure: Error(`Invalid electionid: ${parsedId}`) });
    }
  }, [queryParams]);

  return state
}

export function useQueryNumWinners(): QueryParamState<number> {
  const queryParams = useSearchParams()
  const [state, setState] = useState<QueryParamState<number>>({
    data: null,
    isLoading: true,
    failure: null,
  })

  useEffect(() => {
    const parsedNumWinners = queryParams.get("numWinners")
    if (parsedNumWinners !== undefined && parsedNumWinners != null && !isNaN(parseInt(parsedNumWinners))) {
      setState({ data: parseInt(parsedNumWinners), isLoading: false, failure: null });
    } else {
      setState({ data: null, isLoading: false, failure: Error(`Invalid electionid: ${parsedNumWinners}`) });
    }
  }, [queryParams]);

  return state
}


export function useGetCurrentUsersElections(): { data: Election[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<Election[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { status, user } = useFirebaseUser()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToken = await user?.getIdToken()

        if (status !== "loading" && idToken === undefined) {
          console.error("You must be signed in to complete that action.")
          setError("You must be signed in to complete that action.");
        } else if (status !== "loading") {
          const headers = {
            Authorization: `Bearer ${idToken}`,
          };

          const response = await fetch(`${BASE_URL}elections`, { headers })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else if (response.status == 204) {
            setData([]);
          } else {
            const jsonData = await response.json();
            setData(jsonData);
          }
        }
      } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
          setError(err?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, user]);

  return { data, loading, error };
}

type ElectionLoadingState = {
  state: 'loading'
}

type ElectionSuccessState = {
  state: 'success',
  election: Election
}

type ElectionFailureState = {
  state: 'error',
  error: string
}

type ElectionResultState = ElectionLoadingState | ElectionSuccessState | ElectionFailureState

export function useGetElection(): ElectionResultState {
  const queryParam = useQueryElectionId()
  const [state, setState] = useState<ElectionResultState>({ state: 'loading' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!queryParam.isLoading && queryParam.data === null) {
          setState({ state: 'error', error: "No electionId" });
        } else if (queryParam.data !== null) {
          const response = await fetch(`${BASE_URL}elections/${queryParam.data}`)

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const jsonData: Election = await response.json();
            setState({ state: 'success', election: jsonData });
          }
        }
      } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
          setState({ state: "error", error: err.message })
        }
      }
    };

    fetchData();
  }, [queryParam]);

  return state;
}

export function useGetElectionWinners(numWinners: number): {
  response: ElectionWinnersResponse | null;
  closeElection: (numWinners: number) => void;
  loading: boolean;
  error: string | null;
} {
  const { data } = useQueryElectionId()
  const [response, setResponse] = useState<ElectionWinnersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const closeElection = async (numWinners: number) => {
    try {
      const electionId = response?.election?.id
      if (electionId == undefined) return
      setLoading(true)
      const closedResponse = await sendCloseElection(electionId, numWinners)
      if (closedResponse instanceof Error) {
        return
      }
      setResponse(closedResponse)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (data === null) {
          setError("No electionId");
        } else {
          console.log(`finding reults for ${numWinners}`)
          const response = await fetch(`${BASE_URL}elections/results?electionId=${data}&numWinners=${numWinners}`)

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const jsonData: ElectionWinnersResponse = await response.json();
            console.log(`Response: ${response.status} ${JSON.stringify(jsonData)}`)
            setError(null)
            setResponse(jsonData);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, numWinners]);

  return { response, closeElection, loading, error };
}

async function sendCloseElection(electionId: ElectionId, numWinners: number): Promise<ElectionWinnersResponse | Error> {
  await auth.authStateReady()
  const idToken = await auth.currentUser?.getIdToken()
  const response = await fetch(`${BASE_URL}elections/close?electionId=${electionId}&numWinners=${numWinners}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })

  console.log(response)

  if (!response.ok) {
    return Error(`Http error code=${response.status}`)
  }

  const winners = await response.json()
  return winners
}

export function useShareableVotingUrl(election: Election) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  return `${domain}/vote?electionId=${election.id}`
}