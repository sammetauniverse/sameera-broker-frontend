import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Stop page refresh
    e.stopPropagation(); // Extra safety

    console.log("Form submitted:", username, password);

    // Clear any previous error
    setError('');
<<<<<<< HEAD

    // Check admin credentials FIRST
    if (username === 'admin' && password === 'admin') {
      console.log("✅ Admin login successful");
      localStorage.setItem('token', 'demo-token-12345');
      
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate('/leads');
      }, 100);
      
      return false; // Extra safety to prevent form submission
=======
    setLoading(true);
    
    // --- SPECIAL BYPASS CODE START ---
    if (username === 'admin' && password === 'admin') {
      console.log("Demo Mode Activated");
      localStorage.setItem('token', 'demo-token');
      navigate('/leads');
      return; // Stop here, don't call backend
    }
    // --- SPECIAL BYPASS CODE END ---

    try {
      const response = await api.post('login/', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/leads');
    } catch (err) {
      setError('Backend is down. Use username "admin" and password "admin" to enter.');
    } finally {
      setLoading(false);
>>>>>>> 63de7ea4b2c7df4fa70ea870024b08251b0156c6
    }

    // If not admin, show error
    setError('Invalid credentials. Try username: admin, password: admin');
    return false;
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
<<<<<<< HEAD
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email
            </label>
=======
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
>>>>>>> 63de7ea4b2c7df4fa70ea870024b08251b0156c6
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
<<<<<<< HEAD
              placeholder="Enter admin"
              autoComplete="username"
=======
              placeholder="Type 'admin'"
>>>>>>> 63de7ea4b2c7df4fa70ea870024b08251b0156c6
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
              placeholder="Enter admin"
              autoComplete="current-password"
=======
              placeholder="Type 'admin'"
>>>>>>> 63de7ea4b2c7df4fa70ea870024b08251b0156c6
            />
          </div>
          
          {error && (
<<<<<<< HEAD
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-bold border border-red-200">
=======
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm font-bold">
>>>>>>> 63de7ea4b2c7df4fa70ea870024b08251b0156c6
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          Demo: admin / admin
        </div>
      </div>
    </div>
  );
}
