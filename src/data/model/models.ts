type ElectionId = string
type UserId = string
type CandidateId = string

interface Election {
  id: ElectionId;
  name: string;
  administrators: Set<UserId>;
  candidates: Set<ElectionCandidate>;
  voters: Set<UserId>;
}

interface ElectionCandidate {
  id: CandidateId;
  electionId: ElectionId;
  name: string;
}