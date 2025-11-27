import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MyLeads from './pages/MyLeads';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

// This wrapper ensures only logged-in users can see the page
// AND adds the Sidebar (Layout) around it.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (With Sidebar) */}
        <Route path="/my-leads" element={
          <ProtectedRoute>
            <MyLeads />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
