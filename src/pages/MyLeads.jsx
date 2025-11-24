import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { MapPin, FileText, Image as ImageIcon, Edit as EditIcon } from 'lucide-react';

export default function MyLeads() {
  const currentUser = localStorage.getItem('currentUser');
  const SHARED_KEY = 'SHARED_LEADS_DB';
  const [leads, setLeads] = useState([]);
  const [viewingFiles, setViewingFiles] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    if (saved) {
      setLeads(JSON.parse(saved).filter(lead => lead.createdBy === currentUser));
    }
  }, [currentUser]);

  // Update the single edited lead (and localStorage)
  const handleEditSave = (updatedData) => {
    setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...updatedData } : l));
    // Also patch in localStorage for global/all-leads
    const allLeads = JSON.parse(localStorage.getItem(SHARED_KEY)) || [];
    const idx = allLeads.findIndex(l => l.id === editingLead.id);
    if (idx !== -1) {
      allLeads[idx] = { ...allLeads[idx], ...updatedData };
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
                  <td className="p-4">{lead.address}</td>
                  <td className="p-4">
                    <a href={lead.googlePin && lead.googlePin.startsWith('http') ? lead.googlePin : `https://maps.google.com/?q=${lead.googlePin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
                      <MapPin size={12}/> Map
                    </a>
                  </td>
                  <td className="p-4">₹ {Number(lead.price).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    {lead.hasFiles && lead.files && lead.files.length > 0 ? (
                      <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded border text-gray-600 cursor-pointer"
                        onClick={() => setViewingFiles(lead.files)}>
                        <ImageIcon size={12}/> {lead.files.length}
                      </span>
                    ) : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="p-2 text-yellow-600 hover:text-yellow-800"
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
        {/* FILE MODAL */}
        {viewingFiles && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
              <h3 className="font-bold mb-3 text-lg">Uploaded Files</h3>
              <ul className="space-y-2">
                {viewingFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {file.url ? (
                      <img src={file.url} alt={file.name || file} className="w-12 h-12 rounded shadow-md object-cover"/>
                    ) : (
                      <FileText size={16} />
                    )}
                    <span>{file.name || file}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={() => setViewingFiles(null)}>Close</button>
            </div>
          </div>
        )}
        {/* EDIT MODAL */}
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
