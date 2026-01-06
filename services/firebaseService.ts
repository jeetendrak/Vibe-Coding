
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoLKOsJYDGQK1nXY19XBhQeXyQyhNLo4E",
  authDomain: "smartfin-47caa.firebaseapp.com",
  projectId: "smartfin-47caa",
  storageBucket: "smartfin-47caa.firebasestorage.app",
  messagingSenderId: "285005967030",
  appId: "1:285005967030:web:31ca88a6a43c89fd9c4017",
  measurementId: "G-DSNGVQK1GF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
