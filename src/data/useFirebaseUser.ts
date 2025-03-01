import { useEffect, useState } from "react";
import { auth } from "./firebaseClient";
import { User } from "firebase/auth";

const useFirebaseUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update state when user logs in or out
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return user;
};

export default useFirebaseUser;