import { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function AddLeadModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    phone: '',
    address: '',      // <-- Street address
    googlePin: '',
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
    if (!formData.name || !formData.acres || !formData.price || !formData.googlePin || !formData.address) {
      alert("Fill all mandatory fields: Name, Address, Location, Acres, Price.");
      return;
    }
    onSave({
      ...formData,
      files,
      hasFiles: files.length > 0
    });
    onClose();
    setFiles([]);
    setFormData({ date: new Date().toISOString().split('T')[0], name: '', phone: '', address: '', googlePin: '', acres: '', price: '', siteVisitDone: false, isConverted: false, comments: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Upload New Lead / Land</h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">

          <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2.5 border rounded-lg"/>
          <input placeholder="Owner Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Street Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <input placeholder="Google Map Pin or Lat,Lng" value={formData.googlePin} onChange={e => setFormData({...formData, googlePin: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <input type="text" placeholder="Land Area (Acres)" value={formData.acres} onChange={e => setFormData({...formData, acres: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required className="w-full p-2.5 border rounded-lg"/>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={formData.siteVisitDone} onChange={e => setFormData({...formData, siteVisitDone: e.target.checked})}/>
            Site Visit Completed?
          </label>
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={formData.isConverted} onChange={e => setFormData({...formData, isConverted: e.target.checked})}/>
            Converted?
          </label>
          <textarea placeholder="Site Visit Comments" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} className="w-full p-2.5 border rounded-lg"/>
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 block text-center cursor-pointer">
            <Upload className="text-gray-400 mx-auto" />
            <span className="block mt-2 text-sm text-indigo-600">Click to upload photos & docs</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange}/>
          </label>
          {files.length > 0 && 
            <div className="mt-2 text-xs text-gray-500">{files.length} file(s): {files.join(', ')}</div>
          }
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg" type="submit">Upload Lead</button>
        </form>
      </div>
    </div>
  );
}
