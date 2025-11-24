import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

function getFileObj(file) {
  // If file is already { name, url }, return as is; else process File
  if (file && typeof file === 'object' && 'name' in file && ('url' in file)) return Promise.resolve(file);
  return new Promise((resolve) => {
    if (!file.type || !file.type.startsWith("image/")) return resolve({ name: file.name, url: null });
    const reader = new FileReader();
    reader.onload = e => resolve({ name: file.name, url: e.target.result });
    reader.readAsDataURL(file);
  });
}

export default function AddLeadModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '', phone: '', address: '', googlePin: '',
    acres: '', price: '',
    siteVisitDone: false, isConverted: false, converted: false,
    comments: ''
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Populate with initial data when in edit mode
    if (initialData) {
      // Assign files directly if present, else []
      setFormData({ ...initialData });
      setFiles(initialData.files || []);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const fileObjs = await Promise.all(Array.from(e.target.files).map(getFileObj));
    setFiles(prev => [...prev, ...fileObjs]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Required field check
    if (!formData.name || !formData.address || !formData.googlePin || !formData.acres || !formData.price) {
      alert("Fill all required fields: Name, Address, Google Pin, Acres, Price.");
      return;
    }
    onSave({
      ...formData,
      converted: formData.isConverted || formData.converted, // Legacy safe
      files, hasFiles: files.length > 0
    });
    setFiles([]);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      name: '', phone: '', address: '', googlePin: '',
      acres: '', price: '', siteVisitDone: false, isConverted: false, converted: false, comments: ''
    });
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
          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 border rounded-lg"/>
          <input placeholder="Owner Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <input placeholder="Google Map Pin or Lat,Lng" value={formData.googlePin} onChange={e => setFormData({...formData, googlePin: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <input type="text" placeholder="Land Area (Acres)" value={formData.acres || ''} onChange={e => setFormData({...formData, acres: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={formData.siteVisitDone} onChange={e => setFormData({...formData, siteVisitDone: e.target.checked})}/>
            Site Visit Completed?
          </label>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={formData.isConverted} onChange={e => setFormData({...formData, isConverted: e.target.checked})}/>
            Converted?
          </label>
          <textarea placeholder="Site Visit Comments" value={formData.comments || ''} onChange={e => setFormData({...formData, comments: e.target.value})} className="w-full p-2.5 border rounded-lg"/>
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 block text-center cursor-pointer">
            <Upload className="text-gray-400 mx-auto" />
            <span className="block mt-2 text-sm text-indigo-600">Click to upload photos & docs</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange}/>
          </label>
          {files.length > 0 && 
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                f.url ? <img key={i} src={f.url} alt={f.name} className="w-16 h-16 rounded shadow-md object-cover"/> : 
                <span key={i} className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-xs">{f.name}</span>
              ))}
            </div>
          }
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg" type="submit">{initialData ? "Update Lead" : "Upload Lead"}</button>
        </form>
      </div>
    </div>
  );
}
