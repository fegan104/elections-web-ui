import { ElectionId, ElectionCandidate, Election } from "@/data/model/models";
import { auth, createUserWithEmailAndPassword } from "./firebaseClient";
import { useEffect, useState } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

///////TYPES

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

export function useShareableVotingUrl(election: Election) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  return `${domain}/vote?electionId=${election.id}`
}