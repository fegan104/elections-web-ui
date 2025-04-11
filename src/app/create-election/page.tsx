"use client"
import { createNewElection } from "@/data/electionsClient"
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
    <div className="items-center justify-items-center">
      <main className="flex flex-col bg-white rounded-md p-2 ">

        <form action={submitForm}>

          <TextInput
            className=""
            type="text"
            value={getElectionName}
            onChange={it => setElectionName(it)}
            label="Election name"
          />

          <h6>Candidates</h6>
          <NameList names={getCandidates} onChanged={setCandidates} />

          <button type="submit" style={{margin: "16px"}}>Save</button>
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
    <div className="flex flex-col">
      <ul>
        {names.map((item, index) => (
          <li key={index}>-{item}</li>
        ))}
      </ul>

      <TextInput
        className="my-2"
        type="text"
        value={name}
        onChange={(e) => setName(e)}
        label="Candidate name"
      />
      <button className="px-3 py-1 bg-blue-500 rounded-md place-self-end" type="button" onClick={handleAddItem}>Add</button>
    </div>
  )
}

type TextInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm ${className}`}
      />
    </div>
  );
};