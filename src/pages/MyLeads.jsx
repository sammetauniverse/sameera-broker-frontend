import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { MapPin, Image as ImageIcon, Edit as EditIcon, Loader, PlusCircle } from 'lucide-react';

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

  const handleSave = async (formData) => {
    console.log("Attempting to save:", formData); 
    
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
      <div className="max-w-6xl mx-auto mt-6 space-y-8 px-4 sm:px-6">
        
        {/* New Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">My Leads Management</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage your property submissions</p>
          </div>
          <button 
            onClick={() => { setEditingLead(null); setShowModal(true); }} 
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all shadow-md font-semibold"
          >
            <PlusCircle size={20} /> 
            Add New Lead
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl border border-gray-100">
            <Loader className="animate-spin text-indigo-600 w-8 h-8"/>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-500">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5">Address</th>
                  <th className="p-5">Price</th>
                  <th className="p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <span className="bg-gray-100 p-3 rounded-full"><MapPin className="text-gray-400"/></span>
                        <p>No leads found yet.</p>
                        <button onClick={() => setShowModal(true)} className="text-indigo-600 font-medium hover:underline">Create your first lead</button>
                      </div>
                    </td>
                  </tr>
                ) : leads.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-medium text-gray-900">{l.name}</td>
                    <td className="p-5 text-gray-600 truncate max-w-xs">{l.address}</td>
                    <td className="p-5 font-medium text-green-600">₹ {Number(l.price).toLocaleString()}</td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => { setEditingLead(l); setShowModal(true); }} 
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Lead"
                      >
                        <EditIcon size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
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
