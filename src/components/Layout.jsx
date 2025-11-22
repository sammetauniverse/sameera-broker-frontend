import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6">
          <div className="flex h-16 shrink-0 items-center border-b border-gray-100">
            <h1 className="text-xl font-bold text-indigo-700">Sameera</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-1">
              <li>
                <Link 
                  to="/leads" 
                  className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium ${
                    location.pathname === '/leads' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/inventory" 
                  className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium ${
                    location.pathname === '/inventory' 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Inventory
                </Link>
              </li>
            </ul>
            <div className="border-t border-gray-100 pt-4 pb-4">
              <button 
                onClick={() => { 
                  localStorage.removeItem('token'); 
                  navigate('/'); 
                }} 
                className="group flex w-full gap-x-3 rounded-md p-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <button 
          type="button" 
          onClick={() => setMobileMenuOpen(true)} 
          className="-m-2.5 p-2.5 text-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex-1 text-sm font-semibold text-gray-900">Sameera</div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-900/80" 
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button 
                  type="button" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="-m-2.5 p-2.5"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <h1 className="text-xl font-bold text-indigo-700">Sameera</h1>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul className="flex flex-1 flex-col gap-y-1">
                    <li>
                      <Link 
                        onClick={() => setMobileMenuOpen(false)} 
                        to="/leads" 
                        className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium ${
                          location.pathname === '/leads' 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-gray-600'
                        }`}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        onClick={() => setMobileMenuOpen(false)} 
                        to="/inventory" 
                        className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium ${
                          location.pathname === '/inventory' 
                            ? 'bg-indigo-50 text-indigo-700' 
                            : 'text-gray-600'
                        }`}
                      >
                        <Home className="h-5 w-5" />
                        Inventory
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
