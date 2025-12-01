import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log("Login initiated...");

    // Create a timeout controller to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch('https://sameera-broker-backend.onrender.com/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log("Response status:", response.status);

      const data = await response.json();

      if (response.ok) {
        console.log("Success! Saving tokens...");
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Force redirect
        window.location.href = '/dashboard';
      } else {
        console.error("Login Failed:", data);
        setError(data.detail || 'Login failed. Please check username/password.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Server is waking up, please try again in 30s.');
      } else {
        console.error("Network Error:", err);
        setError('Cannot connect to server. Check your internet or try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter username"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter password"
              required 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Connecting...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-purple-600">
          <Link to="/register" className="hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
