import { useEffect } from "react";

const CLIENT_ID = "514071868422-4jso82vdli88f1069drf606uc4tfkckd.apps.googleusercontent.com"; // Your actual client ID
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file";

export async function uploadFileToDrive(file) {
  console.log("Uploading to Google Drive:", file.name);
  const metadata = { name: file.name, mimeType: file.type };
  const accessToken = gapi.auth.getToken().access_token;

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  let res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
      body: form,
    }
  );
  
  if (!res.ok) {
    const errorMessage = await res.text();
    console.error("Drive upload failed:", errorMessage); // <--- You'll see this in the browser console
    alert("Drive upload failed: " + errorMessage);        // <--- This will show the actual error popup
    throw new Error("Drive upload failed: " + errorMessage);
  }

  const value = await res.json();
  console.log("Drive File ID:", value.id);
  return value.id;
}
