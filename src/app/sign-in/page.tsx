'use client';
import { useEffect, useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../data/firebaseClient";
import useFirebaseUser from "@/data/useFirebaseUser";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/TextInput";
import { TonalButton } from "@/components/Buttons";
import { Card } from "@/components/Card";
import { ErrorMessage } from "@/components/ErrorMessage";

export default function SignIn() {
  const { user } = useFirebaseUser()
  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user != null) {
      router.replace("/")
    }
  }, [user, router])

  const handleSignIn = async () => {
    try {
      console.log("Attempting sign in");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="space-y-4 md:w-[512px] sm:w-full">
        <h2>Enter you account details</h2>
        <form action={handleSignIn} className="space-y-4">
          <TextInput value={email} onChange={(e) => setEmail(e)} label="Email" />
          <TextInput type="password" value={password} onChange={(e) => setPassword(e)} label="Password" />
          <div className="flex w-full justify-end">
            <TonalButton type="submit">Sign In</TonalButton>
          </div>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Card>
    </div>
  );
}