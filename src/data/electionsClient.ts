import { auth } from "@/data/firebaseClient"
import useFirebaseUser from "./useFirebaseUser"
import { useEffect, useState } from "react"
const BASE_URL = "http://0.0.0.0:8080/"

export async function fetchElections() {
  console.log("Starting fetch elections")
  await auth.authStateReady()
  const idToken = await auth.currentUser?.getIdToken()

  if (idToken === undefined) {
    console.error("No idToken")
    //return
  }

  const headers = {
    Authorization: `Bearer ${idToken}`,
  };

  const requestOptions: RequestInit = { headers, cache: "no-cache" };

  const response = await fetch(`${BASE_URL}elections`, requestOptions)

  return await response?.json()
}

export function useGetCurrentUsersElections(): { data: Election | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<Election | null>(null);
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
          }
          const jsonData: Election = await response.json();
          setData(jsonData);
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