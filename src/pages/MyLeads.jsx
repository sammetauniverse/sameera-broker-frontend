import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Home, FileText, ExternalLink, Trash2 } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com";

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    if (!token) { 
      window.location.href = '/'; 
      return; 
    }

    try {
      const response = await fetch(`${API_URL}/api/leads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) { 
        localStorage.clear(); 
        window.location.href = '/'; 
        return; 
      }

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

  useEffect(() => { 
    fetchLeads(); 
  }, []);

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
        const msg = errorData.detail || errorData.file_url?.[0] || "Failed to save lead";
        throw new Error(msg);
      }

      alert("Lead Saved Successfully!"); 
      setIsModalOpen(false);
      
      // Refresh the leads list
      await fetchLeads();
      
      // Trigger dashboard refresh
      window.dispatchEvent(new Event('leadAdded'));

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

  const handleDeleteLead = async (leadId, leadName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${leadName}"?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/leads/${leadId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Lead deleted successfully!");
        await fetchLeads();
        window.dispatchEvent(new Event('leadAdded')); // Refresh dashboard
      } else {
        throw new Error("Failed to delete lead");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting lead");
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
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm border">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'No leads match your search.' : 'No leads found. Add your first lead!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-lg transition-shadow relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteLead(lead.id, lead.name)}
                className="absolute top-3 right-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Lead"
              >
                <Trash2 size={18} />
              </button>

              {/* Lead Header */}
              <div className="flex justify-between items-start mb-4 pr-8">
                <h3 className="font-bold text-gray-800 text-lg">{lead.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  lead.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                  lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                  lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {lead.status?.toUpperCase()}
                </span>
              </div>
              
              {/* Lead Details */}
              <div className="space-y-3 text-sm text-gray-600">
                {/* Phone */}
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-indigo-600 flex-shrink-0" /> 
                  <a href={`tel:${lead.phone_number}`} className="hover:text-indigo-600 font-medium">
                    {lead.phone_number}
                  </a>
                </div>

                {/* Preferred Location */}
                {lead.preferred_location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" /> 
                    <span className="line-clamp-2">{lead.preferred_location}</span>
                  </div>
                )}

                {/* Address */}
                {lead.address && (
                  <div className="flex items-start gap-2">
                    <Home size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" /> 
                    <span className="line-clamp-2">{lead.address}</span>
                  </div>
                )}
                
                {/* Budget */}
                {lead.budget && (
                  <div className="text-gray-800 font-bold bg-indigo-50 px-3 py-2 rounded-lg">
                    Budget: ₹{parseFloat(lead.budget).toLocaleString('en-IN')}
                  </div>
                )}
                
                {/* Document */}
                {lead.file_url && (
                  <a 
                    href={lead.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-indigo-600 hover:underline mt-3 pt-3 border-t font-medium"
                  >
                    <FileText size={14}/> View Document <ExternalLink size={12}/>
                  </a>
                )}
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
