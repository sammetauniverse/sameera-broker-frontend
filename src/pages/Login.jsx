import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Loader } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // HARDCODED URL to be 100% sure.
  // Note: No trailing slash here. We add it in the fetch call.
  const API_URL = "https://sameera-broker-backend.onrender.com"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // We explicitly add /api/token/ with the trailing slash
      const fullUrl = `${API_URL}/api/token/`;
      console.log("Fetching:", fullUrl);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Debug: Log what we got back before parsing
      console.log("Response Status:", response.status);

      if (!response.ok) {
        // If it's 404 or 500, this text() will be the HTML error page
        const errorText = await response.text(); 
        console.error("Server Error Text:", errorText);
        throw new Error(`Server Error ${response.status}. Check console for details.`);
      }

      const data = await response.json();

      if (data.access) {
        localStorage.setItem('token', data.access);
        navigate('/my-leads');
      } else {
        throw new Error("No access token received");
      }

    } catch (err) {
      console.error("Login Exception:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign In</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
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
