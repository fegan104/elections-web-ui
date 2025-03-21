'use client'
import { useGetCurrentUsersElections } from "@/data/electionsClient"
import { Card, CardContent, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import Link from "next/link";
import { Election } from "@/data/model/models"
import { Suspense } from 'react'

export default function ViewElections() {
  <Suspense>
    <ViewElectionsContent />
  </Suspense>
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
        <Typography variant="h4">View Elections</Typography>

        <ElectionList elections={data} />
      </main>
    )
  }
}

const ElectionList: React.FC<{ elections: Election[] }> = ({ elections }) => {
  return (
    <div>
      {elections.map((election) => (
        <Card key={election.id} style={{ margin: "20px", padding: "10px" }}>
          <CardContent>
            <Typography variant="h5">{election.name}</Typography>
            <Typography variant="subtitle1">Status: {election.isOpen ? "Open" : "Closed"}</Typography>
            <Typography variant="subtitle2">Candidates</Typography>
            <List>
              {election.candidates.map((candidate) => (
                <ListItem key={candidate.id}>
                  <ListItemText primary={"-" + candidate.name} />
                </ListItem>
              ))}
            </List>
            <Typography variant="subtitle2">Voters: {election.voters.length} total vote(s)</Typography>
            <List>
              {election.voters.map((voter) => (
                <ListItem key={voter}>
                  <ListItemText primary={voter} />
                </ListItem>
              ))}
            </List>
            <Link href={`/view-results?electionId=${election.id}`} passHref>
              <Typography variant="body1" color="primary" style={{ cursor: "pointer" }}>View Results</Typography>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
