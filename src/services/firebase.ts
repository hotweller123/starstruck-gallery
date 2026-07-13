// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-0b_JxDjYaXrHLpNX4-iobP88zF2f77Q",
  authDomain: "athetest.firebaseapp.com",
  projectId: "athetest",
  storageBucket: "athetest.firebasestorage.app",
  messagingSenderId: "540769027773",
  appId: "1:540769027773:web:4d509552c757487fcad9d4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
