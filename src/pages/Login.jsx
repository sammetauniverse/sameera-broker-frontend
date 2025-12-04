import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded URL for absolute certainty
  const LOGIN_URL = 'https://sameera-broker-backend.onrender.com/api/token/';

  const handleLogin = async () => {
    console.log("1. Button clicked. Starting login process...");
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      console.log("2. Preparing to fetch from:", LOGIN_URL);
      
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("3. Fetch complete. Status:", response.status);

      const data = await response.json();
      console.log("4. Response data:", data);

      if (response.ok) {
        console.log("5. Login successful. Saving tokens...");
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        
        console.log("6. Redirecting to dashboard...");
        window.location.href = '/dashboard';
      } else {
        console.error("Login failed with status:", response.status);
        setError(data.detail || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error("CRITICAL NETWORK ERROR:", err);
      setError('Network error: Could not connect to server. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* CRITICAL: Using div instead of form to prevent default submit behavior */}
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Broker Portal Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" 
            placeholder="Enter your username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password" 
            placeholder="Enter your password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          />
        </div>
        
        <button 
          onClick={handleLogin}
          disabled={loading}
          className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Connecting...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
