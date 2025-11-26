import { useState } from 'react';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';

export default function FileUploader({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Use the new Firebase function
      const downloadURL = await uploadFileToFirebase(file);
      
      // Pass the URL back to the parent component (e.g., MyLeads form)
      if (onUploadSuccess) {
        onUploadSuccess(downloadURL);
      }
      
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-blue-600 mt-2">Uploading to Firebase...</p>}
    </div>
  );
}
