import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 1. Get registered user from storage
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    // 2. Check credentials (Admin OR Registered User)
    const isAdmin = username === 'admin' && password === 'admin';
    const isUser = storedUser && username === storedUser.username && password === storedUser.password;

    if (isAdmin || isUser) {
      console.log("Login successful");
      localStorage.setItem('token', 'demo-token-secure');
      
      // If it's admin, ensure a default profile exists if not already
      if (isAdmin && !localStorage.getItem('userProfile')) {
        localStorage.setItem('userProfile', JSON.stringify({ name: 'Administrator', avatar: null }));
      }

      setTimeout(() => navigate('/leads'), 100);
    } else {
      setError('Invalid credentials. Try "admin" / "admin" or your registered account.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sameera Broker Portal</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}
          
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/register" className="text-indigo-600 font-bold hover:underline ml-1">Register here</Link>
        </div>
      </div>
    </div>
  );
}
