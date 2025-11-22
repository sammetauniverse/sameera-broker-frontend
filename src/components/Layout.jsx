import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Home, LogOut, Menu, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { path: '/leads', label: 'Dashboard', icon: LayoutDashboard },
    // You can add more here later
    // { path: '/inventory', label: 'Inventory', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">Sameera</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Snippet at Bottom */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <UserCircle size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">Sameera Bangalore</p>
              <p className="text-xs text-gray-500 truncate">Broker</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header (Hamburger Menu) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-30 border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-indigo-700">Sameera</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">Sameera</h1>
          <button onClick={() => setIsSidebarOpen(false)}><Menu size={24} /></button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                location.pathname === item.path 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg mt-8"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
