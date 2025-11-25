import useGoogleDrive from './hooks/useGoogleDrive';
import GoogleAuthButtons from './components/GoogleAuthButtons';
import FileUploader from './components/FileUploader';

function App() {
  useGoogleDrive(); // Initialize Google Drive on mount

  return (
    <div>
      <h1>Google Drive File Uploader Demo</h1>
      <GoogleAuthButtons />
      <FileUploader />
    </div>
  );
}

export default App;
