import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Calendar } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // FORCE REFRESH URL
  const BACKEND_URL = "https://sameera-broker-backend.onrender.com";

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/leads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // --- SIMPLIFIED SAVE FUNCTION ---
  const handleSaveLead = async (leadData) => {
    console.log("Attempting to save:", leadData);
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
        const err = await response.json();
        alert("Server Error: " + (err.detail || "Failed"));
        return;
      }

      // Success path
      alert("Saved Successfully!");
      setIsModalOpen(false);
      fetchLeads();

    } catch (e) {
      alert("Network Error: " + e.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Leads</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      {/* Leads List */}
      <div className="grid gap-4">
        {leads.map(lead => (
          <div key={lead.id} className="p-4 bg-white shadow rounded border">
            <h3 className="font-bold">{lead.name}</h3>
            <p className="text-gray-600">{lead.phone_number}</p>
          </div>
        ))}
      </div>

      {/* Modal Call */}
      {isModalOpen && (
        <AddLeadModal 
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLead}
        />
      )}
    </div>
  );
}
