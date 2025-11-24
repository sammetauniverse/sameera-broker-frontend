import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Filter, MapPin, Calendar, IndianRupee, Plus, User, Lock, Edit3, Trash2, LogOut, ChevronDown } from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  
  // --- 1. SHARED STORAGE KEY (Everyone sees same data) ---
  const SHARED_KEY = 'SHARED_LEADS_DB'; 
  const profileKey = `userProfile_${currentUser}`;

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  // --- 2. LOAD SHARED LEADS ---
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [profile, setProfile] = useState({ name: currentUser || 'User', avatar: null });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '', status: 'All' });

  // Save to SHARED storage
  useEffect(() => {
    localStorage.setItem(SHARED_KEY, JSON.stringify(leads));
  }, [leads]);

  // Load Profile Photo
  useEffect(() => {
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, [profileKey]);

  // --- 3. ADD LEAD (Tag with Current User) ---
  const handleSaveLead = (newLeadData) => {
    const newLead = {
      ...newLeadData,
      id: `SB-${Math.floor(10000 + Math.random() * 90000)}`,
      createdBy: currentUser // Tag the owner
    };
    setLeads([newLead, ...leads]);
  };

  // --- 4. DELETE (Permission Check) ---
  const handleDelete = (leadId, owner) => {
    if (currentUser === 'admin' || currentUser === owner) {
      if (confirm('Are you sure you want to delete this lead?')) {
        setLeads(leads.filter(l => l.id !== leadId));
      }
    } else {
      alert("You cannot delete a lead you didn't create.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    const matchLoc = lead.address?.toLowerCase().includes(filters.location.toLowerCase()) || 
                     lead.lat?.includes(filters.location) || 
                     lead.lng?.includes(filters.location);
    const matchStatus = filters.status === 'All' || lead.status === filters.status;
    const matchMinPrice = !filters.minPrice || Number(lead.price) >= Number(filters.minPrice);
    const matchMaxPrice = !filters.maxPrice || Number(lead.price) <= Number(filters.maxPrice);
    return matchStatus && matchMinPrice && matchMaxPrice;
  });

  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-blue-50 text-blue-700 border-blue-100',
      'Contacted': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'Visit Scheduled': 'bg-purple-50 text-purple-700 border-purple-100',
      'Closed': 'bg-green-50 text-green-700 border-green-100'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  // Permission Helper
  const canEdit = (owner) => currentUser === 'admin' || currentUser === owner;

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
            <p className="text-gray-500 text-sm">Viewing shared database</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-medium shadow-sm"
            >
              <Plus size={18} /> Add New Lead
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-xs overflow-hidden">
                  {profile.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" /> : profile.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  <button onClick={() => navigate('/profile')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex gap-2"><User size={14}/> Profile</button>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex gap-2"><LogOut size={14}/> Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-4 flex items-center gap-2 font-bold text-gray-700 text-sm border-b pb-2 mb-2">
            <Filter size={16} /> Filter Database
          </div>
          <input placeholder="Location (Address, Lat, Lng)" className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
          <select className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
            <option value="All">All Status</option><option>New</option><option>Contacted</option><option>Visit Scheduled</option><option>Closed</option>
          </select>
          <input type="number" placeholder="Min Price" className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
          <input type="number" placeholder="Max Price" className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="p-4">Lead ID</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Date</th>
                <th className="p-4">Address</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Files</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{lead.id}</td>
                  
                  {/* OWNER COLUMN */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${lead.createdBy === currentUser ? 'bg-indigo-500' : 'bg-gray-400'}`}>
                        {lead.createdBy ? lead.createdBy.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className={`text-xs ${lead.createdBy === currentUser ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>
                        {lead.createdBy === currentUser ? 'You' : lead.createdBy}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-500 text-sm flex items-center gap-2"><Calendar size={14}/> {lead.date}</td>
                  
                  {/* Address (Primary) + Lat/Lng (Secondary) */}
                  <td className="p-4 text-gray-600 text-sm max-w-xs">
                    <div className="flex items-start gap-1">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0 text-indigo-500" />
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{lead.address}</p>
                        {(lead.lat || lead.lng) && (
                          <p className="text-xs text-gray-400 mt-0.5">{lead.lat}, {lead.lng}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-medium">₹ {Number(lead.price).toLocaleString()}</td>
                  <td className="p-4">{getStatusBadge(lead.status)}</td>
                  
                  {/* Files Indicator */}
                  <td className="p-4 text-center">
                    {lead.hasFiles ? (
                      <div className="group relative inline-block">
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-200 cursor-help">
                          {lead.files?.length || 1} File(s)
                        </span>
                        {/* Tooltip */}
                        {lead.files && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg">
                            {lead.files.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="p-4 flex justify-center gap-2">
                    {canEdit(lead.createdBy) ? (
                      <>
                        <button className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id, lead.createdBy)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-400 italic bg-gray-50 px-2 py-1 rounded">
                        <Lock size={12} /> Read Only
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-gray-500">
                    No leads found in the shared database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />
      </div>
    </Layout>
  );
}
