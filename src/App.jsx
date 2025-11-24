import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Leads from './pages/Leads';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import MyLeads from './pages/MyLeads'; // <-- Already imported

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-leads" element={<ProtectedRoute><MyLeads /></ProtectedRoute>} /> {/* MyLeads now active */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
