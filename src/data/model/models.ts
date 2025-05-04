export type ElectionId = string
export type UserId = string
export type CandidateId = string

export interface Election {
  id: ElectionId;
  name: string;
  isOpen: boolean;
  candidates: ElectionCandidate[];
  voters: UserId[];
}

export interface ElectionCandidate {
  id: CandidateId;
  electionId: ElectionId;
  name: string;
}

export interface ElectionUser {
  id: UserId;
  name: string;
}

export interface CandidateResult {
  candidate: ElectionCandidate;
  votes: number;
}

export interface VoteCountingRound {
  roundNumber: number;
  quota: number;
  winners: CandidateResult[];
  candidates: CandidateResult[];
}

export interface VoteCountingResponse {
  winners: CandidateResult[];
  exhausted: number;
}

export interface ElectionWinnersResponse {
  election: Election
  voters: ElectionUser[],
  voteCountingResponse: VoteCountingResponse | null
}