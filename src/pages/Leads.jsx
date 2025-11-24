import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Filter, MapPin, Calendar, IndianRupee, Plus, ChevronDown, User, LogOut } from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser'); // Get logged-in user
  const storageKey = `leads_${currentUser}`; // Unique key
  const profileKey = `userProfile_${currentUser}`; // Profile key

  // Load Profile for Header
  const [profile, setProfile] = useState({ name: currentUser || 'User', avatar: null });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load leads specifically for THIS user
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    
    // Only show demo data if it's the ADMIN account
    if (currentUser === 'admin') {
      return [
        { id: 171623, name: "Rahul Kumar", location: "Bangalore", price: "25000000", status: "New", date: "2025-11-20", siteVisit: false },
        { id: 171624, name: "Priya Sharma", location: "Chennai", price: "5000000", status: "Contacted", date: "2025-11-18", siteVisit: true },
      ];
    }
    return []; // New users start empty
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '', status: 'All' });

  // Save to User-Specific Storage
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(leads));
  }, [leads, storageKey]);

  // Load Profile Photo
  useEffect(() => {
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, [profileKey]);

  const handleSaveLead = (newLead) => {
    const leadWithId = { ...newLead, id: Math.floor(100000 + Math.random() * 900000) };
    setLeads([leadWithId, ...leads]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    const matchLoc = lead.location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchStatus = filters.status === 'All' || lead.status === filters.status;
    const matchMinPrice = !filters.minPrice || Number(lead.price) >= Number(filters.minPrice);
    const matchMaxPrice = !filters.maxPrice || Number(lead.price) <= Number(filters.maxPrice);
    return matchLoc && matchStatus && matchMinPrice && matchMaxPrice;
  });

  const getStatusBadge = (status) => {
    const colors = { 
      'New': 'bg-blue-100 text-blue-700', 
      'Contacted': 'bg-yellow-100 text-yellow-700', 
      'Closed': 'bg-green-100 text-green-700' 
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your client leads</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-medium shadow-sm"
            >
              <Plus size={18} /> Add Lead
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-xs overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  <button onClick={() => navigate('/profile')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex gap-2">
                    <User size={14}/> Profile
                  </button>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex gap-2">
                    <LogOut size={14}/> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-4 flex items-center gap-2 font-bold text-gray-700 text-sm border-b pb-2 mb-2">
            <Filter size={16} /> Filter Leads
          </div>
          <input 
            placeholder="Location (e.g. Bangalore)" 
            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            value={filters.location} 
            onChange={e => setFilters({...filters, location: e.target.value})} 
          />
          <select 
            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white" 
            value={filters.status} 
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="All">All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Closed</option>
          </select>
          <input 
            type="number" 
            placeholder="Min Price" 
            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            value={filters.minPrice} 
            onChange={e => setFilters({...filters, minPrice: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Max Price" 
            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            value={filters.maxPrice} 
            onChange={e => setFilters({...filters, maxPrice: e.target.value})} 
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="p-4 text-gray-600 flex items-center gap-1">
                      <MapPin size={14}/> {lead.location}
                    </td>
                    <td className="p-4 font-medium">
                      <IndianRupee size={14} className="inline"/> {Number(lead.price).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-500 text-sm flex items-center gap-1">
                      <Calendar size={14}/> {lead.date}
                    </td>
                    <td className="p-4">{getStatusBadge(lead.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="text-gray-400 mb-3 flex justify-center">
                      <Plus size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No leads yet</h3>
                    <p className="text-gray-500 mb-4">Add your first client lead to get started.</p>
                    <button 
                      onClick={() => setIsModalOpen(true)} 
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Add Lead Now
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <AddLeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveLead} 
        />
      </div>
    </Layout>
  );
}
