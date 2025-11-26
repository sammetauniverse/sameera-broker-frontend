import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { MapPin, FileText, Image as ImageIcon, Edit as EditIcon } from 'lucide-react';

export default function MyLeads() {
  const currentUser = localStorage.getItem('currentUser');
  const SHARED_KEY = 'SHARED_LEADS_DB';
  const [leads, setLeads] = useState([]);
  const [viewingFiles, setViewingFiles] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    if (saved) {
      try {
        const allLeads = JSON.parse(saved);
        // Filter leads created by the current user
        setLeads(allLeads.filter(lead => lead.createdBy === currentUser));
      } catch (err) {
        console.error("Error parsing leads:", err);
        setLeads([]);
      }
    }
  }, [currentUser]);

  const handleEditSave = (updatedData) => {
    if (!editingLead) return;

    // Update local state
    const cleanedLeads = leads.map(l =>
      l.id === editingLead.id ? { ...l, ...updatedData } : l
    );
    setLeads(cleanedLeads);

    // Update localStorage
    const saved = localStorage.getItem(SHARED_KEY);
    const allLeads = saved ? JSON.parse(saved) : [];
    
    const idx = allLeads.findIndex(l => l.id === editingLead.id);
    if (idx !== -1) {
      allLeads[idx] = {
        ...allLeads[idx],
        ...updatedData,
        // Ensure files structure is preserved correctly
        files: Array.isArray(updatedData.files)
          ? updatedData.files.map(f => ({
              url: f.url,
              name: f.name
            }))
          : []
      };
      localStorage.setItem(SHARED_KEY, JSON.stringify(allLeads));
    }

    setEditingLead(null);
    setShowEditModal(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Uploaded Leads</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-bold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Lead Name</th>
                <th className="p-4">Street Address</th>
                <th className="p-4">Google Pin</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-center">Media</th>
                <th className="p-4 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.length > 0 ? leads.map(lead => (
                <tr key={lead.id}>
                  <td className="p-4 text-gray-500">{lead.date}</td>
                  <td className="p-4">{lead.name}</td>
                  <td className="p-4 max-w-xs truncate" title={lead.address}>{lead.address}</td>
                  <td className="p-4">
                    <a 
                      href={lead.googlePin && lead.googlePin.startsWith('http') ? lead.googlePin : `https://maps.google.com/?q=${lead.googlePin}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1 text-indigo-600 hover:underline"
                    >
                      <MapPin size={14}/> Map
                    </a>
                  </td>
                  <td className="p-4">₹ {Number(lead.price || 0).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {lead.files && lead.files.length > 0 ? (
                      <button 
                        className="flex items-center justify-center gap-1 mx-auto text-xs bg-gray-100 px-2 py-1 rounded border text-gray-600 hover:bg-gray-200 transition-colors"
                        onClick={() => setViewingFiles(lead.files)}
                      >
                        <ImageIcon size={14}/> {lead.files.length}
                      </button>
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-full transition-colors"
                      title="Edit"
                      onClick={() => { setEditingLead(lead); setShowEditModal(true); }}
                    >
                      <EditIcon size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">No leads uploaded by you yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FILE VIEWING MODAL */}
        {viewingFiles && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-lg">
              <h3 className="font-bold mb-4 text-lg text-gray-800 border-b pb-2">Attached Files</h3>
              <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {viewingFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                    {/* Show thumbnail if it's an image, icon if not */}
                    {file.url && (file.name?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || file.url.includes('firebase')) ? (
                      <a href={file.url} target="_blank" rel="noreferrer" className="shrink-0">
                        <img src={file.url} alt="thumbnail" className="w-12 h-12 rounded object-cover border"/>
                      </a>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0 text-gray-400">
                        <FileText size={20} />
                      </div>
                    )}
                    
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate flex-1">
                      {file.name || "View File"}
                    </a>
                  </li>
                ))}
              </ul>
              <button 
                className="mt-6 w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
                onClick={() => setViewingFiles(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* EDIT LEAD MODAL */}
        {/* Crucial fix: Added onSave prop to fix "t is not a function" error */}
        <AddLeadModal
          isOpen={showEditModal}
          initialData={editingLead}
          onClose={() => { setEditingLead(null); setShowEditModal(false); }}
          onSave={handleEditSave}
        />
      </div>
    </Layout>
  );
}
