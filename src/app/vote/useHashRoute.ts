import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";


function useHashRoute() {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      console.log("handleHashChange " + window.location.hash)
      setHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    setHash(window.location.hash)

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return hash;
}

interface RouteElectionIdState { electionId: ElectionId | null, isLoading: boolean, failure: Error | null }

export function useHashRouteElectionId(): RouteElectionIdState {
  const hashRoute = useHashRoute()
  const [state, setState] = useState<RouteElectionIdState>({
    electionId: null,
    isLoading: true,
    failure: null,
  })

  useEffect(() => {
    console.log(hashRoute)
    const parsedId = hashRoute?.slice(2);//remove leading "#/"
    if (parsedId !== undefined && parsedId.length > 1) {
      setState({ electionId: parsedId, isLoading: false, failure: null });
    } else {
      setState({ electionId: null, isLoading: false, failure: Error(`Invalid electionid: ${parsedId}`) });
    }
  }, [hashRoute]);

  return state
}

export function useQueryElectionId(): RouteElectionIdState {
  const queryParams = useSearchParams()
  const [state, setState] = useState<RouteElectionIdState>({
    electionId: null,
    isLoading: true,
    failure: null,
  })

  useEffect(() => {
    const parsedId = queryParams.get("electionId")
    if (parsedId !== undefined && parsedId != null && parsedId.length > 1) {
      setState({ electionId: parsedId, isLoading: false, failure: null });
    } else {
      setState({ electionId: null, isLoading: false, failure: Error(`Invalid electionid: ${parsedId}`) });
    }
  }, [queryParams]);

  return state
}