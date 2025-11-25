export default function GoogleAuthButtons() {
  function signInWithGoogle() {
    gapi.auth2.getAuthInstance().signIn();
  }
  function signOutGoogle() {
    gapi.auth2.getAuthInstance().signOut();
  }
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign In to Google</button>
      <button onClick={signOutGoogle}>Sign Out</button>
    </div>
  );
}
