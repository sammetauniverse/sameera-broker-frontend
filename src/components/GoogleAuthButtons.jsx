import React, { useState, useEffect } from "react";

export default function GoogleAuthButtons() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function updateSigninStatus() {
      const auth2 = window.gapi && window.gapi.auth2 ? window.gapi.auth2.getAuthInstance() : null;
      setIsSignedIn(auth2 ? auth2.isSignedIn.get() : false);
    }
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus();
    }
  }, []);

  function signInWithGoogle() {
    window.gapi.auth2.getAuthInstance().signIn();
  }
  function signOutGoogle() {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  return (
    <div style={{margin: '10px 0'}}>
      {!isSignedIn ? (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      ) : (
        <button onClick={signOutGoogle}>Sign Out of Google</button>
      )}
    </div>
  );
}
