import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ElectionId } from "./model/models";

interface QueryParamState<T> {
  data: T,
  isLoading: boolean,
  failure: Error | null
}

export function useQueryElectionId(): QueryParamState<ElectionId | null> {
  const queryParams = useSearchParams()
  const [state, setState] = useState<QueryParamState<ElectionId | null>>({
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
    data: 1,
    isLoading: true,
    failure: null,
  })

  useEffect(() => {
    const parsedNumWinners = queryParams.get("numWinners")
    if (parsedNumWinners !== undefined && parsedNumWinners != null && !isNaN(parseInt(parsedNumWinners))) {
      setState({ data: parseInt(parsedNumWinners), isLoading: false, failure: null });
    } else {
      console.log("numWinenrs query param could not be parsed falling back to 1")
      setState({ data: 1, isLoading: false, failure: null });
    }
  }, [queryParams]);

  return state
}