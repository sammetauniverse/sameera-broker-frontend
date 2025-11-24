import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { 
  Filter, MapPin, Calendar, IndianRupee, Plus, 
  CheckCircle, XCircle, FileText, Image as ImageIcon, 
  TrendingUp, Users, CheckSquare 
} from 'lucide-react';

export default function Leads() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  const SHARED_KEY = 'SHARED_LEADS_DB'; 

  useEffect(() => { if (!currentUser) navigate('/'); }, [currentUser, navigate]);

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- ENHANCED FILTERS ---
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    siteVisit: 'All', // New
    converted: 'All', // New
    dateFrom: '',     // New
    dateTo: ''        // New
  });

  // Listen for Sidebar Add Lead
  useEffect(() => {
    const openModal = () => setIsModalOpen(true);
    window.addEventListener('OPEN_ADD_LEAD', openModal);
    return () => window.removeEventListener('OPEN_ADD_LEAD', openModal);
  }, []);

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

  // --- ADVANCED FILTER LOGIC ---
  const filteredLeads = leads.filter(lead => {
    const search = filters.search.toLowerCase();
    
    // 1. Search Text
    const matchSearch = !search || 
      lead.name.toLowerCase().includes(search) || 
      lead.googlePin.toLowerCase().includes(search) || 
      lead.acres.toLowerCase().includes(search);

    // 2. Dropdowns
    const matchStatus = filters.status === 'All' || lead.status === filters.status;
    const matchSiteVisit = filters.siteVisit === 'All' || 
      (filters.siteVisit === 'Yes' ? lead.siteVisitDone : !lead.siteVisitDone);
    const matchConverted = filters.converted === 'All' || 
      (filters.converted === 'Yes' ? lead.isConverted : !lead.isConverted);

    // 3. Date Range
    const matchDate = (!filters.dateFrom || lead.date >= filters.dateFrom) &&
                      (!filters.dateTo || lead.date <= filters.dateTo);

    return matchSearch && matchStatus && matchSiteVisit && matchConverted && matchDate;
  });

  // --- STATS SUMMARY ---
  const stats = {
    total: leads.length,
    converted: leads.filter(l => l.isConverted).length,
    siteVisits: leads.filter(l => l.siteVisitDone).length
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Field Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome, {currentUser}</p>
          </div>
          
          {/* Quick Stats Cards */}
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={16}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Total</p><p className="font-bold text-lg leading-none">{stats.total}</p></div>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckSquare size={16}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Converted</p><p className="font-bold text-lg leading-none">{stats.converted}</p></div>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MapPin size={16}/></div>
              <div><p className="text-xs text-gray-500 font-bold uppercase">Visits</p><p className="font-bold text-lg leading-none">{stats.siteVisits}</p></div>
            </div>
          </div>
        </div>

        {/* --- ADVANCED FILTERS BAR --- */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-gray-700 text-sm border-b pb-2">
            <Filter size={16} /> Advanced Filters
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 mb-1">Search</label>
              <input 
                placeholder="Name, Location Pin, Acres..." 
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500" 
                value={filters.search} 
                onChange={e => setFilters({...filters, search: e.target.value})} 
              />
            </div>

            {/* Site Visit Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Site Visit Done?</label>
              <select 
                className="w-full p-2 border rounded-lg text-sm bg-white"
                value={filters.siteVisit}
                onChange={e => setFilters({...filters, siteVisit: e.target.value})}
              >
                <option value="All">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Converted Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Lead Converted?</label>
              <select 
                className="w-full p-2 border rounded-lg text-sm bg-white"
                value={filters.converted}
                onChange={e => setFilters({...filters, converted: e.target.value})}
              >
                <option value="All">All</option>
                <option value="Yes">Converted</option>
                <option value="No">Not Yet</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Date From</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg text-sm"
                value={filters.dateFrom}
                onChange={e => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                <tr>
                  <th className="p-4 whitespace-nowrap">Date</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Google Pin</th>
                  <th className="p-4">Acres</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Visit?</th>
                  <th className="p-4 text-center">Converted?</th>
                  <th className="p-4 text-center">Media</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 text-sm whitespace-nowrap font-mono">{lead.date}</td>
                    <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                    
                    {/* Clickable Google Pin */}
                    <td className="p-4 text-sm">
                      <a href={lead.googlePin.startsWith('http') ? lead.googlePin : `https://maps.google.com/?q=${lead.googlePin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline bg-indigo-50 px-2 py-1 rounded w-fit">
                        <MapPin size={12} /> View Map
                      </a>
                    </td>

                    <td className="p-4 font-bold text-gray-700">{lead.acres}</td>
                    <td className="p-4 text-sm font-medium">₹ {Number(lead.price).toLocaleString()}</td>
                    
                    {/* Site Visit Status */}
                    <td className="p-4 text-center">
                      {lead.siteVisitDone ? 
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                          <CheckCircle size={12}/> Yes
                        </span> : 
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                          <XCircle size={12}/> No
                        </span>
                      }
                    </td>

                    {/* Converted Status */}
                    <td className="p-4 text-center">
                      {lead.isConverted ? 
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                          <TrendingUp size={12}/> Won
                        </span> : 
                        <span className="text-gray-400 text-xs">-</span>
                      }
                    </td>

                    {/* Media Files */}
                    <td className="p-4 text-center">
                      {lead.hasFiles ? (
                        <div className="group relative inline-block">
                          <span className="flex items-center justify-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded border text-gray-600 cursor-help">
                            <ImageIcon size={12}/> {lead.files.length}
                          </span>
                          {/* Tooltip listing files */}
                          <div className="absolute right-full top-0 mr-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-20 whitespace-nowrap shadow-xl">
                            <p className="font-bold border-b border-gray-600 pb-1 mb-1">Attached Files:</p>
                            {lead.files.map((f, i) => <div key={i}>{f}</div>)}
                          </div>
                        </div>
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" className="p-12 text-center text-gray-500">No records match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />
      </div>
    </Layout>
  );
}
