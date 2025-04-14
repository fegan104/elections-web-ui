"use client"
import { TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import { useGetElectionWinners } from "@/data/electionsClient";
import { ElectionWinnersResponse } from "@/data/model/models";
import { CircularProgress } from "@mui/material";
import { Suspense } from "react";

export default function ViewResults() {

  return (
    <Suspense>
      <ViewResultsScreen />
    </Suspense>
  )
}

function ViewResultsScreen() {
  const { response, closeElection, loading, error } = useGetElectionWinners()

  const handleCloseElection = async () => {
    closeElection(1)
  }

  return (
    <div>
      {loading ? <CircularProgress /> : <></>}
      {response != null ? <ElectionResults data={response} onCloseElection={handleCloseElection} /> : <></>}
      {error ? (<h3> {error} </h3>) : <></>}
    </div>
  )
}

interface ElectionResultsProps {
  data: ElectionWinnersResponse;
  onCloseElection: () => void;
}

const ElectionResults: React.FC<ElectionResultsProps> = ({ data, onCloseElection }) => {
  const { election, voters, winners } = data
  return (
    <Card className="w-fit">
      <div className="p-3 space-y-2 w-fit">
        <h2 className="text-lg font-bold">Results for {election.name}</h2>

        <div>
          <span className="text-base font-bold">Status: </span>
          <span className="text-base">{election.isOpen ? "Open" : "Closed"}</span>
        </div>

        <div>
          <h4 className="font-bold">Candidates</h4>
          <ul className="my-1">
            {election.candidates.map((candidate) => (
              <li key={candidate.id} className="text-sm">
                -{candidate.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold">Voters: {voters.length} total vote(s)</h4>
          <ul className="gap-4">
            {voters.map((voter) => (
              <li key={voter.id} className="text-sm">
                -{voter.name === "" ? `Anonymous (${voter.id})` : voter.name}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${winners == null ? "hidden" : ""}`}>
          <h4 className="font-bold">Winners</h4>
          <ul>
            <div className="text-sm">Ballots Exhausted {winners?.exhausted}</div>
            {winners?.winners.map((winner) => (
              <li key={winner.candidate.id} className="text-sm">
                -{`${winner.candidate.name}  ${winner.votes} votes`}
              </li>
            ))}
          </ul>
        </div>

        <div className={`${winners != null ? "hidden" : ""} space-y-2 flex flex-col`}>
          <div className="text-sm">This eleciton is still open you must close it to view the results.</div>
          <TonalButton onClick={onCloseElection}>
            Close election
          </TonalButton>
        </div>
      </div>
    </Card>
  );
};

