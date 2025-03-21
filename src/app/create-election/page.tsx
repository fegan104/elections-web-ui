"use client"
import { createNewElection } from "@/data/electionsClient"
import { Button, List, ListItem, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignIn() {
  const [getCandidates, setCandidates] = useState<string[]>([])
  const [getElectionName, setElectionName] = useState<string>("")
  const router = useRouter()

  const submitForm = async () => {
    const request = {
      name: getElectionName,
      candidates: getCandidates,
    }
    const response = await createNewElection(request)
    if (response.ok) {
      router.replace("/view-elections")
    }
  }

  return (
    <div className="grid items-center justify-items-center">
      <main className="flex flex-col items-left">

        <form action={submitForm}>

          <TextField
            variant="outlined"
            type="text"
            name="election_name"
            value={getElectionName}
            onChange={it => setElectionName(it.target.value)}
            label="Election name"
          />

          <Typography variant="h6">Candidates</Typography>
          <NameList names={getCandidates} onChanged={setCandidates} />

          <Button variant="contained" type="submit" style={{margin: "16px"}}>Save</Button>
        </form>
      </main>
    </div>
  )
}

const NameList: React.FC<{
  names: string[],
  onChanged: (value: string[]) => void
}> = ({ names, onChanged }) => {
  const [name, setName] = useState("")

  const handleAddItem = () => {
    if (name.trim() !== "") {
      onChanged([...names, name])
      setName("") // Clear input after adding
    }
  };

  return (
    <div>
      <List>
        {names.map((item, index) => (
          <ListItem key={index}>-{item}</ListItem>
        ))}
      </List>

      <TextField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        label="Candidate name"
      />
      <Button variant="text" type="button" onClick={handleAddItem}>Add</Button>
    </div>
  )
}