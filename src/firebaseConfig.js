import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Replace these with your actual keys from the Firebase Console
// (Project Settings > General > Your Apps > SDK Setup and Configuration)
const firebaseConfig = {
  apiKey: "AIzaSyAFpKB7B3l-z0pggillF6DHoTlsYbGATq8",
  authDomain: "sameera-broker.firebaseapp.com",
  projectId: "sameera-broker",
  storageBucket: "sameera-broker.firebasestorage.app",
  messagingSenderId: "864188251038",
  appId: "1:864188251038:web:7d640c4d3c63dac3ebb48f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
