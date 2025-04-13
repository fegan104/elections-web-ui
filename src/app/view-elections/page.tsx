'use client'
import { useGetCurrentUsersElections } from "@/data/electionsClient"
import { CircularProgress } from "@mui/material";
import { Election } from "@/data/model/models"
import { Suspense } from 'react'
import { TextButton } from "@/components/Buttons";
import { ErrorMessage } from "@/components/ErrorMessage";

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
    return (
      <ErrorMessage>
        {error}
      </ErrorMessage>
    )
  } else if (data) {
    return (
      <main>
        <h4>Elections</h4>

        <ElectionList elections={data} />
      </main>
    )
  }
}

const ElectionList: React.FC<{ elections: Election[] }> = ({ elections }) => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4">
      {elections.map((election) => <div key={election.id} className="bg-secondary-container ring-1 rounded-lg p-4">
        <div className="space-y-3 flex flex-col h-full">

          <ElectionStatus election={election} />

          <div className="flex flex-1 flex-col place-content-end">

            <div className="flex flex-wrap justify-end items-center gap-2">

              <a href={`/vote?electionId=${election.id}`} className={`${!election.isOpen ? "hidden" : ""}`}>
                <TextButton className="ring-primary ring-1"> {"Vote"} </TextButton>
              </a>

              <a href={`/view-results?electionId=${election.id}`}>
                <TextButton className="ring-primary ring-1"> {"View Results"} </TextButton>
              </a>
            </div>

          </div>
        </div>
      </div>)}
    </div>
  )
};

const ElectionStatus: React.FC<{ election: Election }> = ({ election }) => {
  return (
    <div>
      <h2 className="text-lg font-bold">{election.name}</h2>
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
        <h4 className="font-bold">Voters: {election.voters.length} total vote(s)</h4>
        <ul className="gap-4">
          {election.voters.map((voterName) => (
            <li key={voterName} className="text-sm">
              -{voterName === "" ? `Anonymous` : voterName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}