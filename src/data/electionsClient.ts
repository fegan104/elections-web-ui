import { Election } from "@/data/model/models";
import { auth, createUserWithEmailAndPassword } from "./firebaseClient";
import { useEffect, useState } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

///////TYPES

interface CreateUserRequest {
  email: string,
  password: string,
}

/////FUNCTIONS

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