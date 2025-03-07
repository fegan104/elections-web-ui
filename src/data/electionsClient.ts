import { useSearchParams } from "next/navigation";
import { auth, createUserWithEmailAndPassword } from "./firebaseClient";
import useFirebaseUser from "./useFirebaseUser"
import { useEffect, useState } from "react"
import { useQueryElectionId } from "@/app/vote/useHashRoute";
const BASE_URL = "http://0.0.0.0:8080/"

export function useGetCurrentUsersElections(): { data: Election[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<Election[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useFirebaseUser()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToken = await user?.getIdToken()

        if (idToken === undefined) {
          setError("No idToken");
        } else {
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
            console.log(`Response: ${response.status} ${jsonData}`)
            setData(jsonData);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading, error };
}

export function useGetElection(): { election: Election | null; loading: boolean; error: string | null } {
  // const { electionId, isLoading, failure } = useHashRouteElectionId()
  const { electionId, isLoading, failure } = useQueryElectionId()
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useFirebaseUser()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const idToken = await user?.getIdToken()

        if (idToken === undefined) {
          setError("No idToken");
        } else if (electionId === null || electionId === undefined) {
          setError("No electionId");
        } else {
          const headers = {
            Authorization: `Bearer ${idToken}`,
          };
          console.log(`Loading election id: ${electionId}`)
          const response = await fetch(`${BASE_URL}elections/${electionId}`, { headers })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const jsonData = await response.json();
            console.log(`Response: ${response.status} ${JSON.stringify(jsonData)}`)
            setError(null)
            setElection(jsonData);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err?.message);
        }
      } finally {
        setLoading(false);
      }
    };

    console.log(`useGetElection ${electionId}`)
    fetchData();
  }, [electionId, user]);

  return { election, loading, error };
}

interface CreateElectionRequest {
  name: string
  candidates: string[]
  administrators: string[]
}

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

interface CreateUserRequest {
  email: string,
  password: string,
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