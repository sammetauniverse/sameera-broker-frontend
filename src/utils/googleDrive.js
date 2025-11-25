// Upload file to Google Drive using GAPI auth
export async function uploadFileToDrive(file) {
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
  const value = await res.json();
  return value.id; // Google Drive File ID
}

// Make the file public (so anyone with link can access)
export async function makeFilePublic(fileId) {
  const accessToken = gapi.auth.getToken().access_token;
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role: "reader", type: "anyone" })
    }
  );
}

// Helper to get a sharable download/view link
export function getDriveDownloadUrl(fileId) {
  return `https://drive.google.com/uc?id=${fileId}&export=download`;
}
export function getDriveViewUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/view`;
}
