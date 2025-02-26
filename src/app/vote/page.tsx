"use client"; // Ensures this runs only on the client side
import { useEffect, useState } from "react";


export default function Vote() {
  const [electionId, setElectionId] = useState<string | null>(null);

  useEffect(() => {
    const parsedId = window.location.hash.slice(2);//remove leading "#/"
    if (parsedId.length > 1) {
      setElectionId(parsedId);
    }
  }, []);

  return (
    <div className="grid items-center justify-items-center">
      <main className="flex flex-col items-left">

        <button onClick={() => console.log("Voting! in " + electionId)}>
          Save
        </button>
      </main>
    </div>
  )
}