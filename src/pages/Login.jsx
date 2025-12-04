import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // Hardcoded URL to ensure it hits the correct endpoint
    const LOGIN_URL = 'https://sameera-broker-backend.onrender.com/api/token/'; 

    try {
      console.log("Attempting login to:", LOGIN_URL);
      console.log("Payload:", { username, password });

      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      console.log("Response Status:", response.status);
      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        // Store tokens
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        console.log("Tokens stored, redirecting...");
        
        // Force redirect to dashboard to clear any stale state
        window.location.href = '/dashboard';
      } else {
        // Handle specific error messages from Django
        const errorMessage = data.detail || 'Invalid username or password';
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Network/Fetch Error:", err);
      setError('Network error. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">Broker Portal Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input 
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text" 
            placeholder="Enter your username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input 
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password" 
            placeholder="******************" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
        </div>
        
        <button 
          disabled={loading}
          className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          type="submit"
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
