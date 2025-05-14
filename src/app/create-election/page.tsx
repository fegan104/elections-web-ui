"use client"
import { TextButton, TonalButton } from "@/components/Buttons"
import CandidateNameListItem from "@/components/CandidateNameListItem"
import { Card } from "@/components/Card"
import { TextInput } from "@/components/TextInput"
import { createNewElection } from "@/data/electionsClient"
import { analyticsEvents } from "@/data/firebaseClient"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

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
      analyticsEvents.trackCreateElection()
      router.replace("/")
    }
  }

  return (
    <div className="items-center justify-items-center">
      <Card>
        <form action={submitForm} className="space-y-4">

          <TextInput
            type="text"
            label="Election Details"
            placeholder="Election Name"
            value={getElectionName}
            onChange={it => setElectionName(it)}
          />

          <NameList names={getCandidates} onChanged={setCandidates} />

          <TonalButton type="submit" className="w-full" disabled={(getElectionName == "") || (getCandidates.length < 1)}>
            Save
          </TonalButton>
        </form>
      </Card>
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
      onChanged([...new Set([...names, name])])
      setName("") // Clear input after adding
    }
  };

  const handleEnterKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddItem()
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h6 className="text-sm font-medium text-gray-700">Candidates</h6>
      <ul className="list-disc list-inside">
        {names.map((item, index) => (
          <CandidateNameListItem key={index} candidateName={item} onClick={() => { onChanged(names.filter(n => (n != item))) }} />
        ))}
      </ul>

      <div className="flex items-center gap-x-1 flex-1 pt-1">
        <TextInput
          type="text"
          value={name}
          onChange={(e) => setName(e)}
          placeholder="Candidate name"
          className="flex-1"
          onKeyDown={handleEnterKeyDown}
        />
        <TextButton className="ring-0.5" type="button" onClick={handleAddItem}>Add</TextButton>
      </div>
    </div>
  )
}
