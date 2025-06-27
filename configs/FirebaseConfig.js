// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBquABGI5SJjQ6quTQPL7i6UbdBU4Celps",
  authDomain: "aitravel-67bc8.firebaseapp.com",
  projectId: "aitravel-67bc8",
  storageBucket: "aitravel-67bc8.appspot.com",
  messagingSenderId: "859516226759",
  appId: "1:859516226759:web:7dd0a67bd7e684840ac2e2",
  measurementId: "G-JYNQ4RF790"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);