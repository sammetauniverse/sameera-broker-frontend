import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';

export default function AddLeadModal({ isOpen, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', price: '', acres: '', google_pin: '', comments: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm(initialData);
        setFiles(initialData.file_urls || []);
      } else {
        setForm({ name: '', phone: '', address: '', price: '', acres: '', google_pin: '', comments: '' });
        setFiles([]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    setLoading(true);
    const newFiles = [];
    for (const file of e.target.files) {
        try {
            const url = await uploadFileToFirebase(file);
            newFiles.push({ name: file.name, url });
        } catch (e) { console.error(e); }
    }
    setFiles([...files, ...newFiles]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onSave) return alert("Error: Save function missing");
    onSave({ ...form, file_urls: files });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-xl">{initialData ? 'Edit Lead' : 'New Lead'}</h2>
          <button onClick={onClose}><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Phone" value={form.phone_number || form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="w-full border p-2 rounded" placeholder="Address" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Price" type="number" value={form.price || ''} onChange={e => setForm({...form, price: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Acres" value={form.acres || ''} onChange={e => setForm({...form, acres: e.target.value})} />
          
          <label className="block border p-4 text-center cursor-pointer rounded border-dashed">
            <Upload className="mx-auto mb-2"/> <span>{loading ? "Uploading..." : "Upload Files"}</span>
            <input type="file" multiple hidden onChange={handleUpload} disabled={loading} />
          </label>
          <div className="flex flex-wrap gap-2">{files.map((f,i) => <span key={i} className="text-xs bg-gray-100 p-1 rounded">{f.name}</span>)}</div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold" disabled={loading}>
            {loading ? "Processing..." : "Save Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
