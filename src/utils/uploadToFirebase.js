import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

// We rename this export to match what your FileUploader.jsx is looking for
export const uploadFileToFirebase = async (file) => {
  if (!file) return null;
  
  // Create a unique file path
  const storageRef = ref(storage, `leads/${Date.now()}_${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Also export as 'uploadFile' just in case other new components use the shorter name
export const uploadFile = uploadFileToFirebase;
