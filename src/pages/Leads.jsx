import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Filter, MapPin, Calendar, IndianRupee, Plus, User, Lock, Edit3, Trash2, FileText } from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  
  // --- 1. SHARED STORAGE KEY (All users see the same data) ---
  const SHARED_KEY = 'SHARED_LEADS_DB'; 

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  // --- 2. LOAD SHARED LEADS ---
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    if (saved) return JSON.parse(saved);
    
    // Default Mock Data (Tagged with 'admin' as creator)
    return [
      { id: "SB-1001", name: "Rahul Kumar", location: "Bangalore", price: "25000000", status: "New", date: "2025-11-20", lat: "12.97", lng: "77.59", createdBy: "admin" },
      { id: "SB-1002", name: "Priya Sharma", location: "Chennai", price: "5000000", status: "Contacted", date: "2025-11-18", lat: "13.08", lng: "80.27", createdBy: "admin" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ location: '', minPrice: '', maxPrice: '', status: 'All' });

  // Save to SHARED storage whenever leads change
  useEffect(() => {
    localStorage.setItem(SHARED_KEY, JSON.stringify(leads));
  }, [leads]);

  // --- 3. ADD LEAD (Tag with Current User) ---
  const handleSaveLead = (newLeadData) => {
    const newLead = {
      ...newLeadData,
      id: `SB-${Math.floor(10000 + Math.random() * 90000)}`,
      createdBy: currentUser // <--- CRITICAL: Tag the owner
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

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    const matchLoc = lead.lat?.toLowerCase().includes(filters.location.toLowerCase()) || 
                     lead.lng?.toLowerCase().includes(filters.location.toLowerCase()) ||
                     lead.location?.toLowerCase().includes(filters.location.toLowerCase()); // Added text location check
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

  // Helper to check permissions
  const canEdit = (owner) => currentUser === 'admin' || currentUser === owner;

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
            <p className="text-gray-500 text-sm">Viewing global shared leads</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-medium shadow-sm"
          >
            <Plus size={18} /> Add New Lead
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-4 flex items-center gap-2 font-bold text-gray-700 text-sm border-b pb-2 mb-2">
            <Filter size={16} /> Filter Database
          </div>
          <input placeholder="Location (Lat/Lng or Name)" className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
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
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
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
                  <td className="p-4 text-gray-600 text-sm"><MapPin size={14} className="inline mr-1"/> {lead.lat || lead.location}</td>
                  <td className="p-4 font-medium">₹ {Number(lead.price).toLocaleString()}</td>
                  <td className="p-4">{getStatusBadge(lead.status)}</td>
                  
                  {/* ACTIONS COLUMN (RESTRICTED) */}
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
                  <td colSpan="7" className="p-12 text-center text-gray-500">
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
