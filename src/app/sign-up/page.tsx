'use client';
import { createUser } from "@/data/electionsClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFirebaseUser from "@/data/useFirebaseUser";


export default function CreateAccount() {
  const currentUser = useFirebaseUser()
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (currentUser != null) {
        router.replace("/view-elections")
      }
    }, [currentUser, router])

  const handleSignUp = async () => {
    try {
      console.log("Attempting sign in");
      const response = await createUser({ email, password })
      if (!response.ok) {
        throw Error(`HTTP failue code=${response.status}}`)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  }
  return (
    <div>
      <h2>Register a new account</h2>
      <form action={handleSignUp}>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Create Account</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}