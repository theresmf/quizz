// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAX0v1O4Pa6z0iNH5IhknI8iCMDgJiYgQ",

  authDomain: "jeopardy-2b875.firebaseapp.com",

  projectId: "jeopardy-2b875",

  storageBucket: "jeopardy-2b875.firebasestorage.app",

  messagingSenderId: "459064321488",

  appId: "1:459064321488:web:145dfed43bc1f8886e85d5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
