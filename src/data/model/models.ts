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

export interface Winner {
  candidate: ElectionCandidate;
  votes: number;
}

export interface ElectionWinnersResponse {
  election: Election
  voters: ElectionUser[],
  winners: {
    winners: Winner[];
    exhausted: number;
  }| null
}