"use client"
import { closeElection, useGetElectionWinners } from "@/data/electionsClient";
import { CircularProgress } from "@mui/material";

export default function ViewResults() {
  const { response, setResponse, loading, error } = useGetElectionWinners()

  const handleCloseElection = async () => {
    const electionId = response?.election?.id
    if (electionId == undefined) return
    const closedResponse = await closeElection(electionId, 1)
    if (closedResponse instanceof Error) {
      return
    }
    setResponse(closedResponse)
  }

  return (
    <div>
      <h3>Winners: </h3>
      {loading ? <CircularProgress /> : <></>}
      {response != null ? <SuccessResponse data={response} onCloseElection={handleCloseElection} /> : <></>}
      {error ? (<h3> {error} </h3>) : <></>}
    </div>
  )
}

const SuccessResponse: React.FC<{
  data: ElectionWinnersResponse,
  onCloseElection: () => void
}> = ({ data, onCloseElection }) => {

  return (
    <div>
      <h3>{JSON.stringify(data)}</h3>
      {
        data.winners == null ? (
          <button onClick={onCloseElection}>
            Close election to view full results.
          </button>
        ) : <></>
      }
    </div>
  )
}