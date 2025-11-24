import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Filter, MapPin, Calendar, IndianRupee, Plus, CheckCircle, FileVideo, FileText } from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  const SHARED_KEY = 'SHARED_LEADS_DB'; 

  // Redirect
  useEffect(() => { if (!currentUser) navigate('/'); }, [currentUser, navigate]);

  // Load Data
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', minPrice: '', maxPrice: '', status: 'All' });

  // Listen for Sidebar "Add Lead" click
  useEffect(() => {
    const openModal = () => setIsModalOpen(true);
    window.addEventListener('OPEN_ADD_LEAD', openModal);
    return () => window.removeEventListener('OPEN_ADD_LEAD', openModal);
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem(SHARED_KEY, JSON.stringify(leads));
  }, [leads]);

  const handleSaveLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
      createdBy: currentUser
    };
    setLeads([newLead, ...leads]);
  };

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    const search = filters.search.toLowerCase();
    const matchSearch = lead.name.toLowerCase().includes(search) || lead.googlePin.toLowerCase().includes(search) || lead.acres.toLowerCase().includes(search);
    const matchStatus = filters.status === 'All' || lead.status === filters.status;
    return matchSearch && matchStatus;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Profile & Welcome Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Field Work Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage collected leads and land details</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900">{currentUser}</p>
            <p className="text-xs text-gray-500">Sales Person</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-4 flex items-center gap-2 font-bold text-gray-700 text-sm border-b pb-2 mb-2">
            <Filter size={16} /> Filter Records
          </div>
          <input placeholder="Search Name, Location, Acres..." className="p-2.5 border rounded-lg text-sm" value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
          <select className="p-2.5 border rounded-lg text-sm bg-white" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
            <option value="All">All Status</option><option>New</option><option>Contacted</option><option>Converted</option>
          </select>
          <input type="number" placeholder="Min Price" className="p-2.5 border rounded-lg text-sm" />
          <input type="number" placeholder="Max Price" className="p-2.5 border rounded-lg text-sm" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Lead / Land</th>
                <th className="p-4">Location (Pin)</th>
                <th className="p-4">Acres</th>
                <th className="p-4">Price</th>
                <th className="p-4">Site Visit</th>
                <th className="p-4">Status</th>
                <th className="p-4">Media</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500 text-sm whitespace-nowrap"><Calendar size={14} className="inline mr-1"/> {lead.date}</td>
                  <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="p-4 text-indigo-600 text-sm truncate max-w-[150px]">
                    <MapPin size={14} className="inline mr-1"/> {lead.googlePin}
                  </td>
                  <td className="p-4 font-bold text-gray-700">{lead.acres}</td>
                  <td className="p-4 text-sm">₹ {Number(lead.price).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {lead.siteVisitDone ? <CheckCircle size={18} className="text-green-500 mx-auto"/> : <span className="text-gray-300 text-xs">-</span>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'Converted' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {lead.hasFiles ? 
                      <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded border text-gray-600"><FileVideo size={12}/> {lead.files.length}</span> 
                      : <span className="text-gray-300">-</span>
                    }
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8" className="p-12 text-center text-gray-500">No records found. Upload a new lead.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />
      </div>
    </Layout>
  );
}
