// Forced Update v4 - Fixed Syntax
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { MapPin, FileText, Image as ImageIcon, Edit as EditIcon, Loader } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com/api/leads/";

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingFiles, setViewingFiles] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
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
      } else {
        console.error("Failed to fetch leads");
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async (leadData) => {
    const isEdit = !!editingLead;
    const url = isEdit ? `${API_BASE_URL}${editingLead.id}/` : API_BASE_URL;
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      name: leadData.name,
      phone_number: leadData.phone,
      address: leadData.address,
      google_pin: leadData.googlePin,
      acres: leadData.acres,
      price: leadData.price,
      site_visit_done: leadData.siteVisitDone,
      is_converted: leadData.isConverted,
      comments: leadData.comments,
      file_urls: leadData.files
    };

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchLeads();
        setShowEditModal(false);
        setEditingLead(null);
      } else {
        const errData = await res.json();
        alert("Error saving lead: " + JSON.stringify(errData));
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Failed to connect to server.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Uploaded Leads</h1>
          <button 
            onClick={() => { setEditingLead(null); setShowEditModal(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Upload New Lead
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader className="animate-spin text-indigo-600"/></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Media</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead.id}>
                    <td className="p-4 text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 truncate max-w-xs">{lead.address}</td>
                    <td className="p-4">₹ {Number(lead.price).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      {lead.file_urls?.length > 0 ? (
                        <button onClick={() => setViewingFiles(lead.file_urls)} className="text-xs bg-gray-100 px-2 py-1 rounded border">
                          <ImageIcon size={12}/> {lead.file_urls.length}
                        </button>
                      ) : "-"}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => { setEditingLead(lead); setShowEditModal(true); }}>
                        <EditIcon size={16} className="text-indigo-600"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewingFiles && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full">
              <h3 className="font-bold mb-4">Attached Files</h3>
              <ul className="space-y-2">
                {viewingFiles.map((f, i) => (
                  <li key={i}><a href={f.url} target="_blank" className="text-blue-600 hover:underline">{f.name}</a></li>
                ))}
              </ul>
              <button onClick={() => setViewingFiles(null)} className="mt-4 w-full bg-gray-800 text-white py-2 rounded">Close</button>
            </div>
          </div>
        )}

        <AddLeadModal
          isOpen={showEditModal}
          initialData={editingLead}
          onClose={() => setShowEditModal(false)}
          onLeadSave={handleSaveLead}
        />
      </div>
    </Layout>
  );
}
