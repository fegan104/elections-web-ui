"use client"
import { useState } from "react"

export default function SignIn() {
  const [getCandidates, setCandidates] = useState<string[]>([])
  const [getAdmins, setAdmins] = useState<string[]>([])
  const [getElectionName, setElectionName] = useState<string>("")


  return (
    <div className="grid items-center justify-items-center">
      <main className="flex flex-col items-left">
        <input placeholder="Election Name" value={getElectionName} onChange={it => setElectionName(it.target.value)} />

        <h6>Candidates</h6>
        <NameList names={getCandidates} onChanged={setCandidates} />


        <h6>Election Administrators</h6>
        <NameList names={getAdmins} onChanged={setAdmins} />

        <button onClick={() => console.log(
          {
            name: getElectionName,
            candidates: getCandidates,
            administrators: getAdmins,
          }
        )}>
          Save
        </button>
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
      <button onClick={handleAddItem}>Add</button>
    </div>
  )
}