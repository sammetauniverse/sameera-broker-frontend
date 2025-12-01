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

    // Use the standard simple JWT token endpoint
    // If your backend uses 'api/token/', change it here.
    // Based on your admin url working, the domain is correct.
    const LOGIN_URL = 'https://sameera-broker-backend.onrender.com/api/token/'; 

    try {
      console.log("Sending request to:", LOGIN_URL);
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log("Response status:", response.status);
      const data = await response.json();

      if (response.ok) {
        console.log("Login Success", data);
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        // Redirect manually to avoid router loops
        window.location.href = '/dashboard';
      } else {
        console.error("Login Failed:", data);
        setError('Login failed. Check username/password.');
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError('Network error. Backend may be down or blocking connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        
        <input 
          className="w-full border p-2 mb-3 rounded"
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
        />
        <input 
          className="w-full border p-2 mb-3 rounded"
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        
        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
