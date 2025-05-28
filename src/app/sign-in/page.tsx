'use client';
import { Suspense, useEffect, useState } from "react";
import { auth, signInWithEmailAndPassword, analyticsEvents, sendPasswordResetEmail } from "../../data/firebaseClient";
import useFirebaseUser from "@/data/useFirebaseUser";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/TextInput";
import { PasswordInput } from "@/components/PasswordInput";
import { TextButton, TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useQueryElectionId } from "@/data/useQueryParams";

export default function SignIn() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}

function SignInContent() {
  const { user } = useFirebaseUser()
  const router = useRouter()
  const electionIdQueryParam = useQueryElectionId()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user != null) {
      const electionId = electionIdQueryParam.data
      if (electionId != null) {
        router.replace(`/vote?electionId=${electionId}`)
      } else {
        router.replace("/")
      }
    }
  }, [user, router, electionIdQueryParam])

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential != null) {
        analyticsEvents.trackSignIn()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  const resetPassword = async () => {
    await sendPasswordResetEmail(auth, email)
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="space-y-4 md:w-[512px] sm:w-full">
        <h2>Enter you account details</h2>
        <form action={handleSignIn} className="space-y-4">
          <TextInput value={email} onChange={(e) => setEmail(e)} label="Email" />
          <PasswordInput value={password} onChange={(e) => setPassword(e)} label="Password" />
          <div className="flex w-full justify-end space-x-4">
            <TextButton className="ring-1" disabled={email.length == 0} onClick={resetPassword}>Reset Password</TextButton>
            <TonalButton type="submit">Sign In</TonalButton>
          </div>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </div>
  );
}