import { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';

export default function AddLeadModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '', phone: '', address: '', googlePin: '',
    acres: '', price: '',
    siteVisitDone: false, isConverted: false, converted: false,
    comments: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
      setFiles(Array.isArray(initialData.files) ? initialData.files : []);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Updated: Handles file upload to Firebase Storage
  const handleFileChange = async (e) => {
    const filesArr = Array.from(e.target.files);
    if (filesArr.length === 0) return;

    setLoading(true);
    const uploadedFiles = [];

    for (const file of filesArr) {
      try {
        // Use the new Firebase function
        const url = await uploadFileToFirebase(file);
        uploadedFiles.push({ url, name: file.name });
      } catch (err) {
        console.error(err);
        alert(`Upload failed for ${file.name}`);
      }
    }

    setFiles(prev => [...prev, ...uploadedFiles]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.googlePin || !formData.acres || !formData.price) {
      alert("Fill all required fields: Name, Address, Google Pin, Acres, Price.");
      return;
    }

    // SAFETY CHECK: Ensure onSave is actually a function before calling it
    if (typeof onSave === 'function') {
      onSave({
        ...formData,
        converted: formData.isConverted || formData.converted,
        files,
        hasFiles: files.length > 0
      });
    } else {
      console.error("CRITICAL ERROR: onSave prop is missing or not a function in AddLeadModal");
      alert("System Error: Cannot save lead. Please contact support.");
      return;
    }
    
    // Clear form only if it's a new entry (not edit)
    if (!initialData) {
      setFiles([]);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        name: '', phone: '', address: '', googlePin: '',
        acres: '', price: '', siteVisitDone: false, isConverted: false, converted: false, comments: ''
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{initialData ? "Edit Lead / Land" : "Upload New Lead / Land"}</h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Owner Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Street Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Google Map Pin or Lat,Lng" value={formData.googlePin} onChange={e => setFormData({ ...formData, googlePin: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <input type="text" placeholder="Land Area (Acres)" value={formData.acres || ''} onChange={e => setFormData({ ...formData, acres: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={formData.siteVisitDone} onChange={e => setFormData({ ...formData, siteVisitDone: e.target.checked })} />
            Site Visit Completed?
          </label>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={formData.isConverted} onChange={e => setFormData({ ...formData, isConverted: e.target.checked })} />
            Converted?
          </label>
          <textarea placeholder="Site Visit Comments" value={formData.comments || ''} onChange={e => setFormData({ ...formData, comments: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 block text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <Upload className="text-gray-400 mx-auto" />
            <span className="block mt-2 text-sm text-indigo-600 font-medium">Click to upload files to Firebase</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
          
          {loading && <div className="text-indigo-600 font-medium animate-pulse">Uploading files to Firebase...</div>}
          
          {Array.isArray(files) && files.length > 0 &&
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span key={i} className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 text-xs font-medium">
                  <FileText size={14} /> 
                  <a href={f.url} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[150px]">{f.name}</a>
                </span>
              ))}
            </div>
          }
          
          <button className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-all disabled:opacity-50" type="submit" disabled={loading}>
            {loading ? "Please wait..." : (initialData ? "Update Lead" : "Upload Lead")}
          </button>
        </form>
      </div>
    </div>
  );
}
