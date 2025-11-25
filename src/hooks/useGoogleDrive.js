import { useEffect } from "react";

const CLIENT_ID = "514071868422-4jso82vdli88f1069drf606uc4tfkckd.apps.googleusercontent.com"; // Replace with actual

export default function useGoogleDrive() {
  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
      });
    };
    gapi.load("client:auth2", start);
  }, []);
}
