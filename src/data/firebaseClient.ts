// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjc6i6pxqMWTESadK-_Vx987eqsWvxFhA",
  authDomain: "scottish-stv.firebaseapp.com",
  projectId: "scottish-stv",
  storageBucket: "scottish-stv.firebasestorage.app",
  messagingSenderId: "747477139031",
  appId: "1:747477139031:web:7d1352f5fd395412c5ed12",
  measurementId: "G-FYE3K9VHBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = await isSupported().then(yes => yes ? getAnalytics(app) : null)

type AnalyticsEvents = {
  trackSignIn: () => void;
  trackSignUp: () => void;
  trackVote: () => void;
  trackShare: () => void;
  trackCreateElection: () => void;
}

const safeLogEvent = (eventName: string) => {
  if (analytics != null) {
      logEvent(analytics, eventName)
  }
}

const analyticsEvents: AnalyticsEvents = {
  trackSignIn: () => safeLogEvent("sign_in"),
  trackSignUp: () => safeLogEvent("sign_up"),
  trackVote: () => safeLogEvent("vote"),
  trackShare: () => safeLogEvent("share"),
  trackCreateElection: () => safeLogEvent("create_election")
}

export { 
  app, 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  analyticsEvents,
};