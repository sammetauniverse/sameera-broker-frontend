import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, User, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clears token
    navigate('/'); // Redirect to Login
  };

  // Define menu items once to avoid build errors
  const menuItems = [
    { name: 'My Leads', icon: <List size={20} />, path: '/my-leads' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
    // Add Dashboard back if you have a Dashboard page ready
    // { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' }, 
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full hidden md:block z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Sameera</h1>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg mt-8 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
