import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { MapPin, Edit as EditIcon, Loader, PlusCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com/api/leads/";

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return null; // Handle missing token safely
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      if (!headers) { setLoading(false); return; } // Don't fetch if no token

      const res = await fetch(API_BASE_URL, { headers });
      
      if (res.status === 401) {
        console.warn("Token expired during fetch");
        localStorage.clear();
        window.location.href = '/';
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSave = async (formData) => {
    console.log("Attempting to save...");
    
    const headers = getAuthHeaders();
    if (!headers) {
      alert("You are logged out. Please login again.");
      window.location.href = '/';
      return;
    }

    const url = editingLead ? `${API_BASE_URL}${editingLead.id}/` : API_BASE_URL;
    const method = editingLead ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });

      // --- SPECIFIC ERROR HANDLING ---
      if (res.status === 401) {
        alert("Session Expired. Logging you out...");
        localStorage.clear();
        window.location.href = '/';
        return;
      }
      
      if (res.status === 403) {
        alert("Permission Denied (CSRF Error). The backend update is required. Please wait for the backend deployment.");
        return;
      }

      if (res.ok) {
        await fetchLeads();
        setShowModal(false);
        setEditingLead(null);
        alert("Success! Lead saved.");
      } else {
        const data = await res.json();
        console.error("Server Validation Error:", data);
        alert(`Validation Error: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error("Network/Crash Error:", err);
      alert("Network Error. Please check your connection.");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-6 space-y-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">My Leads Management</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage your property submissions</p>
          </div>
          <button 
            onClick={() => { setEditingLead(null); setShowModal(true); }} 
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md font-semibold"
          >
            <PlusCircle size={20} /> Add New Lead
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-100">
            <Loader className="animate-spin text-indigo-600 w-8 h-8"/>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-500">
                <tr><th className="p-5">Name</th><th className="p-5">Address</th><th className="p-5">Price</th><th className="p-5 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.length === 0 ? (
                  <tr><td colSpan="4" className="p-12 text-center text-gray-500">No leads found.</td></tr>
                ) : leads.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="p-5 font-medium">{l.name}</td>
                    <td className="p-5 text-gray-600 truncate max-w-xs">{l.address}</td>
                    <td className="p-5 font-medium text-green-600">₹ {l.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => { setEditingLead(l); setShowModal(true); }} className="text-indigo-600"><EditIcon size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && <AddLeadModal isOpen={true} initialData={editingLead} onClose={() => setShowModal(false)} onSave={handleSave} />}
      </div>
    </Layout>
  );
}
