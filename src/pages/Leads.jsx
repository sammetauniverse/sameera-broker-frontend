import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { 
  Plus, Phone, MapPin, Search, Filter, User, LogOut, ChevronDown 
} from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [leads, setLeads] = useState([
    { id: 1, name: "Rahul Kumar", phone: "9876543210", location: "Bangalore", status: "new", email: "rahul@example.com" },
    { id: 2, name: "Priya Sharma", phone: "9988776655", location: "Chennai", status: "contacted", email: "priya@test.com" },
    { id: 3, name: "Amit Singh", phone: "8877665544", location: "Mumbai", status: "closed", email: "amit@demo.com" },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // --- HANDLERS ---
  const handleSaveLead = (newLead) => {
    setLeads([newLead, ...leads]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // --- FILTER LOGIC ---
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'All Status' || lead.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesLocation = locationFilter === 'All Locations' || lead.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'contacted': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'closed': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <Layout>
      {/* --- HEADER WITH PROFILE --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your potential clients</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Add Lead Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
          >
            <Plus size={18} /> Add Lead
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-100">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">Administrator</p>
                  <p className="text-xs text-gray-500">admin@sameera.com</p>
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User size={14} /> Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FILTERS SECTION --- */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-sm">
          <Filter size={16} className="text-indigo-600" /> Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Name or Phone..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>

          <select 
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option>All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                          <p className="text-xs text-gray-500">ID: #{lead.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)} capitalize`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-900 font-mono flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" /> {lead.phone}
                        </span>
                        <span className="text-xs text-gray-500">{lead.email || 'No email'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        {lead.location}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No leads found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD LEAD MODAL --- */}
      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveLead} 
      />
    </Layout>
  );
}
