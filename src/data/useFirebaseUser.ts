import { useEffect, useState } from "react";
import { analyticsEvents, auth } from "./firebaseClient";
import { User } from "firebase/auth";

type AuthState =
  | { status: 'loading'; user: null }
  | { status: 'unauthenticated'; user: null }
  | { status: 'authenticated'; user: User };


const useFirebaseUser = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    status: 'loading',
    user: null,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        analyticsEvents.setUserId(user)
        setAuthState({ status: 'authenticated', user });
      } else {
        setAuthState({ status: 'unauthenticated', user: null });
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
};

export default useFirebaseUser;