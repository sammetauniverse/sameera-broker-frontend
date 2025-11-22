import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout'; // Import the new Layout
import AddLeadModal from '../components/AddLeadModal';
import { Plus, Phone, MapPin, User, Search, Filter, FileText } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = () => {
    api.get('leads/')
      .then(res => setLeads(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Basic Search Filter
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm) ||
    lead.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status Badge Styler
  const getStatusStyle = (status) => {
    switch(status?.toLowerCase()) {
      case 'new': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'contacted': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'visit scheduled': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'closed': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Leads Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your potential clients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      {/* Filters Card (Matches Screenshot) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
          <Filter size={18} /> Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Name, Phone, Location..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* Placeholder Filters to match screenshot UI */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date From</label>
            <input type="date" className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-500" disabled />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Min Price</label>
            <input type="text" placeholder="₹ 0" className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm" disabled />
          </div>
          <div className="flex items-end">
            <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads List (Cards for Mobile, Table for Desktop) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Client Details</th>
                  <th className="p-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="p-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Location</th>
                  <th className="p-5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Contact</th>
                  <th className="p-5 text-right font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ID: LE-{lead.id.toString().padStart(4, '0')}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(lead.status)} uppercase tracking-wide`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center text-gray-600 text-sm font-medium">
                        <MapPin size={16} className="mr-2 text-indigo-400" />
                        {lead.location}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700 text-sm font-medium flex items-center">
                          <Phone size={14} className="mr-2 text-gray-400" /> {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="text-gray-500 text-xs flex items-center">
                            <span className="w-3.5 h-3.5 mr-2 flex items-center justify-center text-gray-400">@</span> {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search size={32} />
            </div>
            <h3 className="text-gray-900 font-medium">No leads found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLeadAdded={fetchLeads} 
      />
    </Layout>
  );
}
