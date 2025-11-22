import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Plus, Phone, MapPin, Search, Filter, MoreVertical } from 'lucide-react';

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

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm) ||
    lead.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* NO max-w constraint - full width */}
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage your potential clients</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
          >
            <Plus size={18} /> Add New Lead
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-sm">
            <Filter size={16} className="text-indigo-600" /> Filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Name, Phone..." 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block">Status</label>
              <select className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm">
                <option>All Status</option>
              </select>
            </div>
            <div></div>
            <div className="flex items-end">
              <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase">Client</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-400">ID: #L-{lead.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)} capitalize`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 font-mono flex items-center gap-2">
                          <Phone size={12} className="text-gray-400" /> {lead.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          {lead.location}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Search size={24} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 font-medium mb-1">No leads found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search.</p>
            </div>
          )}
        </div>

        <AddLeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onLeadAdded={fetchLeads} 
        />
      </div>
    </Layout>
  );
}
