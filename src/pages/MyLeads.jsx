import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL, { headers: getAuthHeaders() });
      if (res.status === 401) return window.location.href = '/';
      if (res.ok) setLeads(await res.json());
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    const url = editingLead ? `${API_BASE_URL}${editingLead.id}/` : API_BASE_URL;
    const method = editingLead ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchLeads();
        setShowModal(false);
        setEditingLead(null);
      } else {
        alert("Save failed.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">My Leads</h1>
          <button onClick={() => { setEditingLead(null); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded">
            + Add Lead
          </button>
        </div>

        {loading ? <Loader className="animate-spin mx-auto"/> : (
          <div className="bg-white rounded border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b font-bold text-xs text-gray-500">
                <tr><th className="p-4">Name</th><th className="p-4">Address</th><th className="p-4">Price</th><th className="p-4">Edit</th></tr>
              </thead>
              <tbody className="divide-y">
                {leads.map(l => (
                  <tr key={l.id}>
                    <td className="p-4">{l.name}</td>
                    <td className="p-4 truncate max-w-xs">{l.address}</td>
                    <td className="p-4">₹ {l.price}</td>
                    <td className="p-4"><button onClick={() => { setEditingLead(l); setShowModal(true); }}><EditIcon size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <AddLeadModal 
          isOpen={showModal} 
          initialData={editingLead} 
          onClose={() => setShowModal(false)} 
          onSave={handleSave} 
        />
      </div>
    </Layout>
  );
}
