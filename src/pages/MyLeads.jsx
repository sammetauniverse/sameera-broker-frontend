import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Calendar } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

export default function MyLeads() {
  console.log("🚀 DEBUG: RUNNING NEW VERSION 5.0 - NO TOASTS"); // <--- ADD THIS
  // ... rest of code ...
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure this matches your actual backend URL
  const BACKEND_URL = "https://sameera-broker-backend.onrender.com";

  // Fetch Leads safely
  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/leads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        // Token expired or User deleted from DB reset -> Auto Logout
        localStorage.clear();
        window.location.href = '/';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setLeads(data);
        } else {
          setLeads([]);
        }
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeads();
  }, []);

  // Save Lead safely (No crash on success)
  const handleSaveLead = async (leadData) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_URL}/api/leads/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to save lead");
      }

      // --- Success Handling ---
      alert("Lead Saved Successfully!"); 
      setIsModalOpen(false);
      fetchLeads(); // Refresh list immediately

    } catch (error) {
      console.error("Save failed:", error);
      alert("Error: " + error.message);
    }
  };

  // Filter leads based on search
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone_number?.includes(searchTerm) ||
    lead.preferred_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Leads</h1>
          <p className="text-gray-500 text-sm">Manage and track your client leads</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add New Lead
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or location..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No leads found. Click "Add New Lead" to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{lead.name}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                    lead.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                </div>
                {lead.budget && (
                  <span className="text-indigo-600 font-semibold">₹{Number(lead.budget).toLocaleString()}</span>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400"/>
                  {lead.phone_number}
                </div>
                {lead.preferred_location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400"/>
                    {lead.preferred_location}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400"/>
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveLead} 
      />
    </div>
  );
}
