'use client';
import { useEffect, useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../data/firebaseClient";
import useFirebaseUser from "@/data/useFirebaseUser";
import { useRouter } from "next/navigation";

export default function SignIn() {
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
    <div>
      <h2>Enter you account details</h2>
      <form action={handleSignIn}>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}