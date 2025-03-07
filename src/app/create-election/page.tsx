"use client"
import { createNewElection } from "@/data/electionsClient"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignIn() {
  const [getCandidates, setCandidates] = useState<string[]>([])
  const [getAdmins, setAdmins] = useState<string[]>([])
  const [getElectionName, setElectionName] = useState<string>("")
  const router = useRouter()

  const submitForm = async () => {
    const request = {
      name: getElectionName,
      candidates: getCandidates,
      administrators: getAdmins,
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

          <label htmlFor="election_name">Election name:</label>
          <input type="text" name="election_name" value={getElectionName} onChange={it => setElectionName(it.target.value)} />

          <h6>Candidates</h6>
          <NameList names={getCandidates} onChanged={setCandidates} />


          <h6>Election Administrators</h6>
          <NameList names={getAdmins} onChanged={setAdmins} />

          <button type="submit">Save</button>
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
      <ul>
        {names.map((item, index) => (
          <li key={index}>-{item}</li>
        ))}
      </ul>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a new item"
      />
      <button type="button" onClick={handleAddItem}>Add</button>
    </div>
  )
}