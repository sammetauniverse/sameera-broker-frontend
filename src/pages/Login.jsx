import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Invalid credentials");

      if (data.access) {
        localStorage.setItem('token', data.access);
        navigate('/my-leads');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Username" required className="w-full p-3 border rounded-xl"
            onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-3 border rounded-xl"
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">
            {loading ? <Loader className="animate-spin mx-auto" /> : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
}
