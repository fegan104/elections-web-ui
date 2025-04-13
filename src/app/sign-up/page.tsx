'use client';
import { createUser } from "@/data/electionsClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFirebaseUser from "@/data/useFirebaseUser";
import { TextInput } from "@/components/TextInput";
import { TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";

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
    <div className="w-full flex justify-center">
      <Card className="space-y-4 md:w-fit sm:w-full">
        <h2>Register a new account</h2>
        <form action={handleSignUp} className="space-y-4">
          <TextInput value={email} onChange={(e) => setEmail(e)} placeholder="Email" />
          <TextInput type="password" value={password} onChange={(e) => setPassword(e)} placeholder="Password" />
          <div className="flex w-full justify-end">
            <TonalButton type="submit">Create Account</TonalButton>
          </div>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Card>
    </div>
  )
}