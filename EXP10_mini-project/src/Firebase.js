// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- Added import for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSlNl8R2zmNh6AAoDAFJ7PBbmiQj1r4NE",
  authDomain: "lab-report-a7b56.firebaseapp.com",
  projectId: "lab-report-a7b56",
  storageBucket: "lab-report-a7b56.firebasestorage.app",
  messagingSenderId: "967122069479",
  appId: "1:967122069479:web:bc3484d5f7f2098fcdbf42"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them for use in other files
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app); 
