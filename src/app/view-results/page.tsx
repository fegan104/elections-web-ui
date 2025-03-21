"use client"
import { useGetElectionWinners } from "@/data/electionsClient";
import { ElectionWinnersResponse } from "@/data/model/models";
import { Button, Card, CardContent, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
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
      <Typography variant="h4">Winners:</Typography>
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
    <Card style={{ margin: "16px", padding: "12px" }}>
      <CardContent>
        <Typography variant="h5">{election.name} - Results</Typography>
        <Typography variant="subtitle1">Status: {election.isOpen ? "Open" : "Closed"}</Typography>

        <Typography variant="subtitle2">Candidates</Typography>
        <List>
          {election.candidates.map((candidate) => (
            <ListItem key={candidate.id}>
              <ListItemText primary={candidate.name} />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle2">Voters: {voters.length} total vote(s)</Typography>
        <List>
          {voters.map((voter) => (
            <ListItem key={voter.id}>
              <ListItemText primary={voter.name === "" ? `Anonymous (${voter.id})` : voter.name} />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle2">Winners</Typography>
        <List>
          {winners?.winners.map((winner) => (
            <ListItem key={winner.candidate.id}>
              <ListItemText primary={`${winner.candidate.name} - ${winner.votes} votes`} />
            </ListItem>
          ))}
        </List>

        <Typography variant="subtitle2">Exhausted Ballots</Typography>
        <Typography>{winners?.exhausted}</Typography>

        {
          winners == null ? (
            <Button onClick={onCloseElection}>
              Close election to view full results.
            </Button>
          ) : <></>
        }

      </CardContent>
    </Card>
  );
};

