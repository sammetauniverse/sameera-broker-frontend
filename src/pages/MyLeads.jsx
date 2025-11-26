import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { MapPin, Image as ImageIcon, Edit as EditIcon, Loader } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com/api/leads/";

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL, { headers: getAuthHeaders() });
      if (res.status === 401) {
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

  // CRASH FIX: Define this function clearly and pass it down
  const handleSave = async (formData) => {
    console.log("Attempting to save:", formData); // Debug log
    
    const url = editingLead ? `${API_BASE_URL}${editingLead.id}/` : API_BASE_URL;
    const method = editingLead ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        console.log("Save successful");
        await fetchLeads();
        setShowModal(false);
        setEditingLead(null);
      } else {
        const err = await res.json();
        console.error("Server Error:", err);
        alert("Server Error: " + JSON.stringify(err));
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Network Error. Check console.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Leads</h1>
          <button 
            onClick={() => { setEditingLead(null); setShowModal(true); }} 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Add Lead
          </button>
        </div>

        {loading ? <div className="p-10 text-center"><Loader className="animate-spin mx-auto"/></div> : (
          <div className="bg-white rounded border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase font-bold text-gray-500">
                <tr><th className="p-4">Name</th><th className="p-4">Address</th><th className="p-4">Price</th><th className="p-4 text-center">Edit</th></tr>
              </thead>
              <tbody className="divide-y">
                {leads.length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">No leads found.</td></tr>
                ) : leads.map(l => (
                  <tr key={l.id}>
                    <td className="p-4">{l.name}</td>
                    <td className="p-4 truncate max-w-xs">{l.address}</td>
                    <td className="p-4">₹ {Number(l.price).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => { setEditingLead(l); setShowModal(true); }} className="text-blue-600 hover:text-blue-800">
                        <EditIcon size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* IMPORTANT: Verify props are passed correctly */}
        {showModal && (
          <AddLeadModal 
            isOpen={true}
            initialData={editingLead} 
            onClose={() => setShowModal(false)} 
            onSave={handleSave} 
          />
        )}
      </div>
    </Layout>
  );
}
