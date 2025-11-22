import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Leads from './pages/Leads';
import Inventory from './pages/Inventory';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/leads" 
          element={isAuthenticated ? <Leads /> : <Navigate to="/" />} 
        />
        <Route 
          path="/inventory" 
          element={isAuthenticated ? <Inventory /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
