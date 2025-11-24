import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, User, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = localStorage.getItem('currentUser') || 'User';

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/leads' },
    { name: 'Add New Lead', icon: <PlusCircle size={20} />, action: 'openModal' }, // Special action
    { name: 'My Profile', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-indigo-700">Sameera</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => item.path ? navigate(item.path) : window.dispatchEvent(new Event('OPEN_ADD_LEAD'))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
              {currentUser.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser}</p>
              <p className="text-xs text-gray-500">Broker</p>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('currentUser'); navigate('/'); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {children}
      </div>
    </div>
  );
}
