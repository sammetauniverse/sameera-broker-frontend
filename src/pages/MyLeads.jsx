import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Home, FileText, ExternalLink, Trash2, Calendar, Check, MapPinIcon, MessageSquare } from 'lucide-react';
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
        console.log("Fetched leads:", results); // Debug
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
      
      await fetchLeads();
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
        window.dispatchEvent(new Event('leadAdded'));
      } else {
        throw new Error("Failed to delete lead");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting lead");
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone_number?.includes(searchTerm) ||
    lead.lead_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

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
            placeholder="Search by name, phone, or lead ID..." 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all relative overflow-hidden"
            >
              {/* Header Section with Lead ID and Delete */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Lead ID</p>
                    <p className="font-bold text-indigo-700 text-lg">{lead.lead_id || 'N/A'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteLead(lead.id, lead.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Lead"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Client Name */}
                <h3 className="font-bold text-gray-900 text-xl mt-3 mb-2">
                  {lead.name || 'No Name Provided'}
                </h3>

                {/* Date and Budget Row */}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar size={14} />
                    <span>{formatDate(lead.created_at)}</span>
                  </div>
                  {lead.budget && (
                    <div className="flex items-center gap-1 text-indigo-700 font-semibold">
                      <span>₹ {parseFloat(lead.budget).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {lead.acres && (
                    <div className="text-gray-700">
                      <span>Acres: {lead.acres}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Body Section */}
              <div className="p-4 space-y-3">
                {/* Phone */}
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-indigo-600 flex-shrink-0" /> 
                  <a href={`tel:${lead.phone_number}`} className="hover:text-indigo-600 font-medium">
                    {lead.phone_number}
                  </a>
                </div>

                {/* Preferred Location */}
                {lead.preferred_location && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" /> 
                    <span>{lead.preferred_location}</span>
                  </div>
                )}

                {/* Address */}
                {lead.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <Home size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" /> 
                    <span className="line-clamp-2 text-gray-600">{lead.address}</span>
                  </div>
                )}

                {/* Site Visit Status */}
                {lead.site_visit_completed && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded">
                    <Check size={16} />
                    <span className="font-medium">Site Visit Completed</span>
                  </div>
                )}

                {/* Comments */}
                {lead.comments && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-start gap-2 text-sm">
                      <MessageSquare size={16} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Comments</p>
                        <p className="text-gray-600 text-xs line-clamp-3">{lead.comments}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {lead.file_url && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-600 mb-2">Attachments</p>
                    <a 
                      href={lead.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">property_plan.pdf</span>
                      </div>
                      <ExternalLink size={14} className="text-gray-400" />
                    </a>
                  </div>
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
