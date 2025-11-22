import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Filter, MapPin, Calendar, IndianRupee, Plus } from 'lucide-react';

export default function Leads() {
  // Load leads from LocalStorage or use default
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('myLeads');
    return saved ? JSON.parse(saved) : [
      { id: 171623, name: "Rahul Kumar", location: "Bangalore", price: "25000000", status: "New", date: "2025-11-20", siteVisit: false },
      { id: 171624, name: "Priya Sharma", location: "Chennai", price: "5000000", status: "Contacted", date: "2025-11-18", siteVisit: true },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    status: 'All'
  });

  // Save to LocalStorage whenever leads change
  useEffect(() => {
    localStorage.setItem('myLeads', JSON.stringify(leads));
  }, [leads]);

  const handleSaveLead = (newLead) => {
    const leadWithId = { ...newLead, id: Math.floor(100000 + Math.random() * 900000) };
    setLeads([leadWithId, ...leads]);
  };

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    const matchLoc = lead.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchStatus = filters.status === 'All' || lead.status === filters.status;
    const matchMinPrice = !filters.minPrice || Number(lead.price) >= Number(filters.minPrice);
    const matchMaxPrice = !filters.maxPrice || Number(lead.price) <= Number(filters.maxPrice);
    return matchLoc && matchStatus && matchMinPrice && matchMaxPrice;
  });

  const getStatusBadge = (status) => {
    const colors = { 'New': 'bg-blue-100 text-blue-700', 'Contacted': 'bg-yellow-100 text-yellow-700', 'Closed': 'bg-green-100 text-green-700' };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <Plus size={18} /> Add Lead
          </button>
        </div>

        {/* Simplified Filters */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-4 flex items-center gap-2 font-bold text-gray-700 text-sm border-b pb-2 mb-2">
            <Filter size={16} /> Filter Leads
          </div>
          <input 
            placeholder="Location (e.g. Bangalore)" 
            className="p-2 border rounded text-sm"
            value={filters.location}
            onChange={e => setFilters({...filters, location: e.target.value})}
          />
          <select 
            className="p-2 border rounded text-sm"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
          >
            <option value="All">All Status</option>
            <option>New</option><option>Contacted</option><option>Closed</option>
          </select>
          <input 
            type="number" placeholder="Min Price" 
            className="p-2 border rounded text-sm"
            value={filters.minPrice}
            onChange={e => setFilters({...filters, minPrice: e.target.value})}
          />
          <input 
            type="number" placeholder="Max Price" 
            className="p-2 border rounded text-sm"
            value={filters.maxPrice}
            onChange={e => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>

        {/* Clean Table Design */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Price</th>
                <th className="p-4">Date</th>
                <th className="p-4">Site Visit</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="p-4 text-gray-600 flex items-center gap-1"><MapPin size={14}/> {lead.location}</td>
                  <td className="p-4 font-medium"><IndianRupee size={14} className="inline"/> {Number(lead.price).toLocaleString()}</td>
                  <td className="p-4 text-gray-500 text-sm flex items-center gap-1"><Calendar size={14}/> {lead.date}</td>
                  <td className="p-4">
                    {lead.siteVisit ? <span className="text-green-600 font-bold text-xs">✔ Scheduled</span> : <span className="text-gray-400 text-xs">Not scheduled</span>}
                  </td>
                  <td className="p-4">{getStatusBadge(lead.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && <div className="p-8 text-center text-gray-500">No leads match your filters.</div>}
        </div>

        <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />
      </div>
    </Layout>
  );
}
