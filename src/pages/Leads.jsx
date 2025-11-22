import { useState } from 'react';
import Layout from '../components/Layout';
import AddLeadModal from '../components/AddLeadModal';
import { Plus, Phone, MapPin, Search, Filter, X, FileText, MessageSquare, Upload } from 'lucide-react';

export default function Leads() {
  // --- STATE ---
  const [leads, setLeads] = useState([
    { id: 1, name: "Rahul Kumar", phone: "9876543210", location: "Bangalore", status: "new", email: "rahul@example.com", comments: ["Called yesterday, interested in 2BHK"], docs: [] },
    { id: 2, name: "Priya Sharma", phone: "9988776655", location: "Chennai", status: "contacted", email: "priya@test.com", comments: [], docs: [] },
  ]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null); // For Details Modal
  const [newComment, setNewComment] = useState("");

  const handleSaveLead = (newLead) => setLeads([{...newLead, comments: [], docs: []}, ...leads]);

  const addComment = () => {
    if (!newComment.trim()) return;
    const updatedLead = { ...selectedLead, comments: [...selectedLead.comments, newComment] };
    updateLeadInList(updatedLead);
    setNewComment("");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedLead = { ...selectedLead, docs: [...selectedLead.docs, file.name] };
      updateLeadInList(updatedLead);
    }
  };

  const updateLeadInList = (updatedLead) => {
    setSelectedLead(updatedLead);
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Leads Dashboard</h1>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex gap-2 items-center">
            <Plus size={18} /> Add Lead
          </button>
        </div>

        {/* LEADS TABLE */}
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr><th className="p-4">Name</th><th className="p-4">Status</th><th className="p-4">Contact</th><th className="p-4">Action</th></tr>
            </thead>
            <tbody className="divide-y">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase">{lead.status}</span></td>
                  <td className="p-4 text-sm text-gray-500">{lead.phone}</td>
                  <td className="p-4">
                    <button onClick={() => setSelectedLead(lead)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LEAD DETAILS MODAL (Comments & Docs) */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Phone size={14}/> {selectedLead.phone} • <MapPin size={14}/> {selectedLead.location}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* COMMENTS SECTION */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><MessageSquare size={18}/> Comments / Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border space-y-3 mb-3">
                    {selectedLead.comments.length === 0 ? <p className="text-sm text-gray-400 italic">No comments yet.</p> : 
                      selectedLead.comments.map((c, i) => <div key={i} className="bg-white p-3 rounded border text-sm text-gray-700">{c}</div>)
                    }
                  </div>
                  <div className="flex gap-2">
                    <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Add note..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <button onClick={addComment} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
                  </div>
                </div>

                {/* DOCUMENTS SECTION */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText size={18}/> Documents</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {selectedLead.docs.map((doc, i) => (
                      <div key={i} className="p-3 border rounded-lg flex items-center gap-2 bg-blue-50 text-blue-700 text-sm truncate">
                        <FileText size={16}/> {doc}
                      </div>
                    ))}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <Upload size={16}/> Upload Document
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveLead} />
      </div>
    </Layout>
  );
}
