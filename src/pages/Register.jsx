import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPass: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    // Simulate registration
    alert("Registration Successful! Please Login.");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join Sameera Broker Portal</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input required placeholder="Username" className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, username: e.target.value})} />
          <input required type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input required type="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, password: e.target.value})} />
          <input required type="password" placeholder="Confirm Password" className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, confirmPass: e.target.value})} />
          
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? 
          <Link to="/" className="text-indigo-600 font-bold hover:underline ml-1">Login here</Link>
        </div>
      </div>
    </div>
  );
}
