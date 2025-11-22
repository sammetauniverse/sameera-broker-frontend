import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, LogOut, Menu, X } from 'lucide-react';
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
    { path: '/inventory', label: 'Inventory', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* --- DESKTOP SIDEBAR (Hidden on Mobile) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">S</div>
            Sameera
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 w-full text-left text-sm text-gray-500 hover:text-red-600 rounded-lg transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MOBILE HEADER (Visible ONLY on Mobile) --- */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-30 border-b border-gray-200 h-16 flex items-center justify-between px-4 shadow-sm">
        <h1 className="text-lg font-bold text-indigo-700">Sameera</h1>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* --- MOBILE MENU DRAWER --- */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-indigo-700">Sameera</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${
                location.pathname === item.path 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:text-red-600 mt-4">
            <LogOut size={20} /> Sign Out
          </button>
        </nav>
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* This margin-left (md:ml-64) pushes content right on desktop so it doesn't hide behind sidebar */}
      <main className="flex-1 md:ml-64 p-6 mt-16 md:mt-0 w-full transition-all">
        {children}
      </main>
    </div>
  );
}
