import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyp7w6mxCpg6Gy-YsnUo8qYpl5X3s1EbA",
  authDomain: "oneroute-ai.firebaseapp.com",
  projectId: "oneroute-ai",
  storageBucket: "oneroute-ai.firebasestorage.app",
  messagingSenderId: "156843149904",
  appId: "1:156843149904:web:ce2d39465b51c4a7c81f55",
  measurementId: "G-8DF7WFGBPQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, 'oneroute-chat'); // Native mode database
