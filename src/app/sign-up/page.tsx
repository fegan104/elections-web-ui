'use client';
import { createUser } from "@/data/electionsClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useFirebaseUser from "@/data/useFirebaseUser";
import { TextInput } from "@/components/TextInput";
import { TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";

export default function CreateAccount() {
  const { user } = useFirebaseUser()
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifiedPassword, setVerifiedPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  //If a user is already signed in just send them home
  useEffect(() => {
    if (user != null) {
      router.replace("/")
    }
  }, [user, router])

  const handleSignUp = async () => {
    try {
      if (password != verifiedPassword) {
        setError("Oops! The passwords don't match");
        return
      }
      const response = await createUser({ email, password })
      if (!response.ok) {
        throw Error(`Network error HTTP code=${response.status}}`)
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
      <Card className="space-y-4 md:w-[512px] sm:w-full">
        <h2>Register a new account</h2>
        <form action={handleSignUp} className="space-y-4">
          <TextInput value={email} onChange={(e) => setEmail(e)} label="Email" />
          <TextInput type="password" value={password} onChange={(e) => setPassword(e)} label="Password" />
          <TextInput type="password" value={verifiedPassword} onChange={(e) => setVerifiedPassword(e)} label="Confirm Password" />
          <div className="flex w-full justify-end">
            <TonalButton type="submit">Create Account</TonalButton>
          </div>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </div>
  )
}