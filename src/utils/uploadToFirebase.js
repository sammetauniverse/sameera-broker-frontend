import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function uploadFileToFirebase(file) {
  if (!file) return null;

  try {
    // Create a unique file path (e.g., uploads/1715623_image.jpg)
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `uploads/${fileName}`);

    console.log("Uploading to Firebase Storage...");
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("File available at", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading to Firebase:", error);
    throw error;
  }
}
