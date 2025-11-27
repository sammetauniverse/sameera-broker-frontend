import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 1. Load Config from Vercel Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 2. Initialize Firebase safely
let storage;
try {
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL: Firebase API Key is missing. Check Vercel Env Vars.");
  } else {
    const app = initializeApp(firebaseConfig);
    storage = getStorage(app);
  }
} catch (e) {
  console.error("Firebase Init Error:", e);
}

// 3. Core Upload Function
export const uploadFileToFirebase = async (file) => {
  if (!file) return null;
  
  if (!storage) {
    alert("System Error: Firebase Storage is not configured. Please contact admin.");
    return null;
  }
  
  try {
    // Sanitize filename to prevent errors
    const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `leads/${Date.now()}_${cleanName}`;
    const storageRef = ref(storage, fileName);
    
    console.log("Starting upload for:", fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("Upload successful. URL:", downloadURL);
    return downloadURL;

  } catch (error) {
    console.error("Upload failed:", error);
    
    if (error.code === 'storage/unauthorized') {
      alert("Permission Denied: Check Firebase Storage Rules.");
    } else {
      alert("Upload Failed: " + error.message);
    }
    throw error;
  }
};

// 4. Export alias for compatibility (Fixes the build error you saw earlier)
export const uploadFile = uploadFileToFirebase;
