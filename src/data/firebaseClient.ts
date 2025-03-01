// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };