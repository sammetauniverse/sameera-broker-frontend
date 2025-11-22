import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Send 'username' because your backend likely uses the default User model
      // If your backend uses 'email' field for auth, you might need to adjust the backend.
      // For now, we send whatever the user typed as the 'username' field.
      const res = await api.post('token/', { username, password });
      
      localStorage.setItem('token', res.data.access);
      // Optional: Store user details if returned
      if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      navigate('/leads');
    } catch (err) {
      console.error("Login error:", err);
      setError('Invalid credentials. Please check your username/email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Sameera Broker Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Username or Email</label>
            <input
              type="text" // Changed to text to allow usernames
              required
              placeholder="Enter your username or email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 placeholder-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-800 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
