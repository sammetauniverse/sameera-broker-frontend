import { useEffect } from "react";

const CLIENT_ID = "514071868422-4jso82vdli88f1069drf606uc4tfkckd.apps.googleusercontent.com";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/drive.file";

function useGoogleDrive() {
  useEffect(() => {
    function start() {
      window.gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: DISCOVERY_DOCS,
      });
    }

    function loadGapi() {
      window.gapi.load("client:auth2", start);
    }

    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = loadGapi;
      document.body.appendChild(script);
    } else {
      loadGapi();
    }
  }, []);
}

export default useGoogleDrive;
