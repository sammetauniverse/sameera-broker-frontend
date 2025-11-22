import { useState } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Filter, MapPin, Calendar, FileText, CheckCircle, Edit2 } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState([
    { 
      id: "SB-12345", 
      date: "2024-07-20", 
      lat: "12.9716", 
      lng: "77.5946", 
      price: "25000000", 
      acres: "5.2", 
      status: "Visit Scheduled", 
      visitDone: true 
    },
    { 
      id: "SB-12344", 
      date: "2024-07-18", 
      lat: "12.9345", 
      lng: "77.6244", 
      price: "50000000", 
      acres: "10", 
      status: "Contacted", 
      visitDone: false 
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveLead = (newLead) => {
    setLeads([{ ...newLead, id: `SB-${Math.floor(10000 + Math.random() * 90000)}` }, ...leads]);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'New': 'bg-blue-50 text-blue-700',
      'Contacted': 'bg-yellow-50 text-yellow-700',
      'Visit Scheduled': 'bg-purple-50 text-purple-700',
      'Closed': 'bg-green-50 text-green-700'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads Dashboard</h1>

        {/* Filters Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold">
            <Filter size={18} /> Filters
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Date From</label>
              <input type="date" className="w-full p-2 border border-gray-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Date To</label>
              <input type="date" className="w-full p-2 border border-gray-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Min Price</label>
              <input type="number" placeholder="e.g. 1000000" className="w-full p-2 border border-gray-200 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Max Price</label>
              <input type="number" placeholder="e.g. 5000000" className="w-full p-2 border border-gray-200 rounded text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Status</label>
              <div className="flex gap-4 text-sm text-gray-600">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> New</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Contacted</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Visit Scheduled</label>
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Closed</label>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-900">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Lead Cards List */}
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Lead ID</span>
                  <h3 className="text-lg font-bold text-gray-900">{lead.id}</h3>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(lead.status)}
                  <button className="text-gray-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-t border-b border-gray-50 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} className="text-indigo-500" />
                  {lead.date}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-indigo-500" />
                  {lead.lat}, {lead.lng}
                </div>
                <div className="text-gray-900 font-medium">
                  ₹ {Number(lead.price).toLocaleString()}
                </div>
                <div className="text-gray-900 font-medium">
                  Acres: {lead.acres}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-gray-700">Site Visit:</span>
                {lead.visitDone ? <CheckCircle size={18} className="text-green-500" /> : <span className="text-xs text-gray-400">Not done</span>}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg w-48 border border-gray-100 flex flex-col items-center text-center">
                <FileText size={24} className="text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 truncate w-full">property_plan.pdf</span>
              </div>
            </div>
          ))}
        </div>

        <AddLeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveLead} 
        />
      </div>
    </Layout>
  );
}
