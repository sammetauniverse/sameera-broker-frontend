import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Plus, Phone, MapPin, Search, Filter, FileText, MoreVertical } from 'lucide-react';

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
      <div className="w-full">
        
        {/* --- PAGE HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leads Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage your potential clients</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={18} /> 
            Add New Lead
          </button>
        </div>

        {/* --- FILTERS SECTION --- */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold text-sm">
            <Filter size={16} className="text-indigo-600" /> 
            Filters
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Search</label>
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Name, Phone..." 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Status</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-sm text-gray-600 outline-none appearance-none">
                <option>All Status</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Closed</option>
              </select>
            </div>
            <div></div> {/* Spacer */}
            <div className="flex items-end">
              <button className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client Details</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                            {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">ID: #L-{lead.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(lead.status)} capitalize`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-700 text-sm font-mono flex items-center gap-2">
                            <Phone size={12} className="text-gray-400" /> {lead.phone}
                          </span>
                          {lead.email && (
                            <span className="text-gray-500 text-xs flex items-center gap-2">
                              <span className="w-3 h-3 flex items-center justify-center text-gray-400">@</span> {lead.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-1.5 text-gray-400" />
                          {lead.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">No leads found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
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
