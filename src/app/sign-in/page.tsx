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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser != null) {
      router.push("/view-elections")
    }
  }, [currentUser, router])

  const handleSignup = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}