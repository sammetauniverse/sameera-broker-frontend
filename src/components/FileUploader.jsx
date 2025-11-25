import React, { useState } from "react";
import {
  uploadFileToDrive,
  makeFilePublic,
  getDriveDownloadUrl,
  getDriveViewUrl
} from "../utils/googleDrive"; // adjust the path if needed

export default function FileUploader() {
  const [fileId, setFileId] = useState(null);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");

  // Handles file input and upload process
  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setStatus("Uploading...");
    try {
      // Upload file to Google Drive
      const id = await uploadFileToDrive(file);
      // Make the file public for download/sharing
      await makeFilePublic(id);
      setFileId(id);
      setStatus("Uploaded & Public!");
    } catch (err) {
      setStatus("Error uploading. Check Google Sign-In.");
      setFileId(null);
    }
  }

  return (
    <div style={{ border: "1px solid #eee", padding: "20px", maxWidth: "400px", margin: "24px auto", borderRadius: "8px" }}>
      <h3>Upload to Google Drive</h3>
      <input type="file" onChange={handleFileChange} />
      <div style={{ marginTop: "10px", color: "#666" }}>{status}</div>
      {fileId && (
        <div style={{ marginTop: "12px" }}>
          <strong>{fileName}</strong><br />
          <a href={getDriveDownloadUrl(fileId)} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
          {" | "}
          <a href={getDriveViewUrl(fileId)} target="_blank" rel="noopener noreferrer">
            View on Drive
          </a>
        </div>
      )}
    </div>
  );
}
