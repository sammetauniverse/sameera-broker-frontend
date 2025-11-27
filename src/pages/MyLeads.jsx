import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Calendar, FileText, ExternalLink } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com";

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/'; return; }

    try {
      const response = await fetch(`${API_URL}/api/leads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) { localStorage.clear(); window.location.href = '/'; return; }

      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data) ? data : (data.results || []);
        setLeads(results);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleSaveLead = async (leadData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Show the exact error from backend (e.g. "Invalid token" or "Missing field")
        const msg = errorData.detail || errorData.file_url?.[0] || "Failed to save lead";
        throw new Error(msg);
      }

      alert("Lead Saved Successfully!"); 
      setIsModalOpen(false);
      fetchLeads();

    } catch (error) {
      console.error("Save failed:", error);
      if (error.message.includes("Given token not valid")) {
         alert("Session expired. Please login again.");
         localStorage.clear();
         window.location.href = '/';
      } else {
         alert("Error: " + error.message);
      }
    }
  };

  // Filter Logic
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone_number?.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Leads</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-indigo-700">
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search leads..." className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading ? <div className="text-center py-10">Loading...</div> : 
       filteredLeads.length === 0 ? <div className="text-center py-10 bg-white rounded-xl">No leads found.</div> : 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-gray-800">{lead.name}</h3>
                <span className="text-indigo-600 font-bold">{lead.status?.toUpperCase()}</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Phone size={16}/> {lead.phone_number}</div>
                {lead.preferred_location && <div className="flex items-center gap-2"><MapPin size={16}/> {lead.preferred_location}</div>}
                {lead.file_url && (
                   <a href={lead.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-600 hover:underline mt-2 pt-2 border-t">
                     <FileText size={14}/> View Document <ExternalLink size={12}/>
                   </a>
                )}
              </div>
            </div>
          ))}
       </div>
      }

      <AddLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveLead} />
    </div>
  );
}
