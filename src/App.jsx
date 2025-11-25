import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Leads from './pages/Leads';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import MyLeads from './pages/MyLeads';

import useGoogleDrive from './hooks/useGoogleDrive';
import GoogleAuthButtons from './components/GoogleAuthButtons';

// Optional: Place, customize, or theme this as your global layout/header
function AppHeader() {
  return (
    <header>
      <h1>Google Drive File Uploader Demo</h1>
      <GoogleAuthButtons />
    </header>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  useGoogleDrive(); // Load Google Drive API once, globally.

  return (
    <BrowserRouter>
      <AppHeader /> {/* Show header and GoogleAuth globally (or move to NavBar/Sidebar) */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-leads" element={<ProtectedRoute><MyLeads /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
