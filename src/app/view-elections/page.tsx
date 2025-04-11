'use client'
import { useGetCurrentUsersElections } from "@/data/electionsClient"
import { CircularProgress } from "@mui/material";
import { Election } from "@/data/model/models"
import { Suspense } from 'react'
import { TextButton } from "@/components/Buttons";

export default function ViewElections() {
  return (
    <Suspense>
      <ViewElectionsContent />
    </Suspense>
  )
}

const ViewElectionsContent = () => {
  const { data, loading, error } = useGetCurrentUsersElections()

  if (loading) {
    return (<CircularProgress />)
  } else if (error) {
    return (<h6>{error}</h6>)
  } else if (data) {
    return (
      <main>
        <h4>View Elections</h4>

        <ElectionList elections={data} />
      </main>
    )
  }
}

const ElectionList: React.FC<{ elections: Election[] }> = ({ elections }) => {
  return (
    <div>
      {elections.map((election) => (
        <div className="border-black p-2" key={election.id}>
          <h5>{election.name}</h5>
            <div className="text-base">Status: {election.isOpen ? "Open" : "Closed"}</div>
            <div className="text-sm font-medium">Candidates</div>
            <ul>
              {election.candidates.map((candidate) => (
                <li key={candidate.id}>
                  {"-" + candidate.name}
                </li>
              ))}
            </ul>
            <div className="text-sm font-medium">Voters: {election.voters.length} total vote(s)</div>
            <ul>
              {election.voters.map((voter) => (
                <li key={voter}>
                  {voter}
                </li>
              ))}
            </ul>
            <div className="flex space-x-4">

              <a href={`/view-results?electionId=${election.id}`}>
                <TextButton > {"View Results"} </TextButton>
              </a>
              {
                election.isOpen ?
                  (<a href={`/vote?electionId=${election.id}`}>
                    <TextButton > {"Vote"} </TextButton>
                  </a>) : <></>
              }

            </div>
        </div>
      ))}
    </div>
  );
};
