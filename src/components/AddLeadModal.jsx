import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';

export default function AddLeadModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', price: '', acres: '', googlePin: '', comments: '', siteVisitDone: false, isConverted: false });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
            ...initialData,
            googlePin: initialData.google_pin || initialData.googlePin || '', // Handle backend field name mismatch
            siteVisitDone: initialData.site_visit_done || false,
            isConverted: initialData.is_converted || false,
        });
        setFiles(initialData.file_urls || []);
      } else {
        setForm({ name: '', phone: '', address: '', price: '', acres: '', googlePin: '', comments: '', siteVisitDone: false, isConverted: false });
        setFiles([]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    const newFiles = [];
    for (const file of selectedFiles) {
        try {
            const url = await uploadFileToFirebase(file);
            newFiles.push({ name: file.name, url });
        } catch (err) { console.error("Upload failed:", err); }
    }
    setFiles(prev => [...prev, ...newFiles]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // PREVENT CRASH: Check if onSave exists
    if (typeof onSave !== 'function') {
        console.error("CRITICAL: onSave prop is missing or invalid!", onSave);
        alert("System Error: Cannot save lead. Please reload.");
        return;
    }

    // Map frontend state to backend expected fields
    const submissionData = {
        name: form.name,
        phone_number: form.phone || form.phone_number,
        address: form.address,
        price: form.price,
        acres: form.acres,
        google_pin: form.googlePin,
        comments: form.comments,
        site_visit_done: form.siteVisitDone,
        is_converted: form.isConverted,
        file_urls: files
    };

    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between p-4 border-b items-center bg-white sticky top-0">
          <h2 className="font-bold text-lg">{initialData ? 'Edit Lead' : 'New Lead'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Owner Name *" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Phone" value={form.phone || form.phone_number || ''} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="Address *" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Google Map Pin" value={form.googlePin || ''} onChange={e => setForm({...form, googlePin: e.target.value})} />
          
          <div className="flex gap-4">
            <input className="w-1/2 border p-2 rounded" placeholder="Price *" type="number" value={form.price || ''} onChange={e => setForm({...form, price: e.target.value})} required />
            <input className="w-1/2 border p-2 rounded" placeholder="Acres" value={form.acres || ''} onChange={e => setForm({...form, acres: e.target.value})} />
          </div>

          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.siteVisitDone || false} onChange={e => setForm({...form, siteVisitDone: e.target.checked})} /> Site Visit Done?</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isConverted || false} onChange={e => setForm({...form, isConverted: e.target.checked})} /> Converted?</label>
          </div>

          <textarea className="w-full border p-2 rounded" placeholder="Comments" value={form.comments || ''} onChange={e => setForm({...form, comments: e.target.value})} />

          <label className="block border-2 border-dashed p-4 text-center cursor-pointer rounded hover:bg-gray-50">
            <Upload className="mx-auto text-gray-400 mb-2"/>
            <span className="text-sm text-blue-600 font-medium">{loading ? "Uploading..." : "Click to upload photos/docs"}</span>
            <input type="file" multiple hidden onChange={handleUpload} disabled={loading} />
          </label>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded">
              {files.map((f, i) => (
                <span key={i} className="text-xs bg-white border px-2 py-1 rounded truncate max-w-[150px]">{f.name}</span>
              ))}
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? "Processing..." : "Save Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
