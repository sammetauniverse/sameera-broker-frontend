import { useEffect, useState } from 'react';
import api from '../api';
import AddLeadModal from '../components/AddLeadModal';
import { Plus, Phone, User } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = () => {
    api.get('leads/')
      .then(res => setLeads(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Leads</h1>
          <p className="text-gray-500">Track and manage your potential clients</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all shadow-md"
        >
          <Plus size={20} /> Add Lead
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Phone</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User size={16} />
                    </div>
                    <span className="font-medium text-gray-900">{lead.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600 font-mono">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400"/> {lead.phone}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                    ${lead.status === 'closed' ? 'bg-green-100 text-green-800' : ''}
                    ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                  `}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{lead.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No leads found. Add one to get started!
          </div>
        )}
      </div>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLeadAdded={fetchLeads} 
      />
    </div>
  );
}
