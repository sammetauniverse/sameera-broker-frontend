import { useState } from 'react';
import { X, Upload, Calendar, MapPin, CheckSquare } from 'lucide-react';

export default function AddLeadModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'New',
    name: '',
    phone: '',
    googlePin: '', // Lat/Lng or Link
    acres: '',
    price: '',
    siteVisitDone: false,
    isConverted: false,
    comments: ''
  });

  const [files, setFiles] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(f => f.name);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mandatory Check
    if (!formData.name || !formData.acres || !formData.price || !formData.googlePin) {
      alert("Please fill in Name, Location, Acres, and Price.");
      return;
    }

    onSave({
      ...formData,
      status: formData.isConverted ? 'Converted' : formData.status, // Auto-set status if converted
      files: files,
      hasFiles: files.length > 0
    });
    onClose();
    setFiles([]);
    setFormData({ date: new Date().toISOString().split('T')[0], status: 'New', name: '', phone: '', googlePin: '', acres: '', price: '', siteVisitDone: false, isConverted: false, comments: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Upload New Lead / Land</h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input type="date" className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1">Lead Name / Owner</label>
              <input type="text" required placeholder="e.g. Land Owner Name" className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
              <input type="text" placeholder="+91..." className="w-full p-2.5 border rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select className="w-full p-2.5 border rounded-lg bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option>New</option><option>Contacted</option><option>Visit Scheduled</option><option>Negotiation</option>
              </select>
            </div>
          </div>

          {/* Section 2: Land Details (Mandatory) */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={16}/> Land Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Google Pin Location</label>
                <input type="text" required placeholder="Paste Google Maps Link or Lat,Lng" className="w-full p-2.5 border rounded-lg" value={formData.googlePin} onChange={e => setFormData({...formData, googlePin: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Land Area (Acres)</label>
                <input type="text" required placeholder="e.g. 2.5 Acres" className="w-full p-2.5 border rounded-lg" value={formData.acres} onChange={e => setFormData({...formData, acres: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1">Price (Total)</label>
                <input type="number" required placeholder="e.g. 5000000" className="w-full p-2.5 border rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Section 3: Checkboxes */}
          <div className="flex gap-6 border-b pb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={formData.siteVisitDone} onChange={e => setFormData({...formData, siteVisitDone: e.target.checked})} />
              <span className="text-sm font-medium text-gray-700">Site Visit Completed?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-green-600 rounded" checked={formData.isConverted} onChange={e => setFormData({...formData, isConverted: e.target.checked})} />
              <span className="text-sm font-medium text-gray-700">Lead Converted?</span>
            </label>
          </div>

          {/* Section 4: Uploads & Comments */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Upload Media (Photos/Videos/Docs)</label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center hover:bg-gray-50 cursor-pointer transition-colors">
              <Upload className="text-gray-400 mb-2" />
              <span className="text-sm text-indigo-600 font-medium">Click to upload site photos & videos</span>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
            {files.length > 0 && <div className="mt-2 text-xs text-gray-500">{files.length} file(s) selected: {files.join(', ')}</div>}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1">Site Visit Comments</label>
            <textarea className="w-full p-2.5 border rounded-lg resize-none" rows="2" placeholder="Notes from the field..." value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})}></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg text-gray-600">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Upload Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}
