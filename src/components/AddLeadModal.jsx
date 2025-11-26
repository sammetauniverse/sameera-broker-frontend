// Forced Update v4 - Fixed Syntax
import { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';

export default function AddLeadModal({ isOpen, onClose, onLeadSave, initialData }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '', phone: '', address: '', googlePin: '',
    acres: '', price: '',
    siteVisitDone: false, isConverted: false,
    comments: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
        setFiles(Array.isArray(initialData.file_urls) ? initialData.file_urls : []);
      } else {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            name: '', phone: '', address: '', googlePin: '', acres: '', price: '',
            siteVisitDone: false, isConverted: false, comments: ''
        });
        setFiles([]);
      }
    }
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const filesArr = Array.from(e.target.files);
    if (filesArr.length === 0) return;
    setLoading(true);
    const uploadedFiles = [];
    for (const file of filesArr) {
      try {
        const url = await uploadFileToFirebase(file);
        uploadedFiles.push({ url, name: file.name });
      } catch (err) {
        console.error(err);
      }
    }
    setFiles(prev => [...prev, ...uploadedFiles]);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.price) {
      alert("Please fill Name, Address, and Price.");
      return;
    }

    if (typeof onLeadSave === 'function') {
      onLeadSave({
        ...formData,
        files: files
      });
    } else {
      console.error("CRITICAL ERROR: onLeadSave prop is missing!");
      alert("System Error: Cannot save.");
      return;
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{initialData ? "Edit Lead" : "Upload New Lead"}</h2>
          <button onClick={onClose}><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <input placeholder="Owner Name" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Phone" value={formData.phone_number || formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Street Address" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          <input placeholder="Google Map Pin" value={formData.google_pin || formData.googlePin || ''} onChange={e => setFormData({ ...formData, googlePin: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          <input type="text" placeholder="Land Area (Acres)" value={formData.acres || ''} onChange={e => setFormData({ ...formData, acres: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: e.target.value })} required className="w-full p-2.5 border rounded-lg" />
          
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.site_visit_done || false} onChange={e => setFormData({ ...formData, site_visit_done: e.target.checked })} /> Site Visit Completed?</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_converted || false} onChange={e => setFormData({ ...formData, is_converted: e.target.checked })} /> Converted?</label>
          <textarea placeholder="Comments" value={formData.comments || ''} onChange={e => setFormData({ ...formData, comments: e.target.value })} className="w-full p-2.5 border rounded-lg" />
          
          <label className="border-2 border-dashed rounded-xl p-6 block text-center cursor-pointer">
            <Upload className="mx-auto"/><span>Click to upload files</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
          
          {loading && <div>Uploading...</div>}
          
          {files.length > 0 &&
            <div className="flex gap-2 flex-wrap">{files.map((f, i) => (<span key={i} className="bg-gray-100 p-1 rounded text-xs">{f.name}</span>))}</div>
          }
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">{loading ? "Saving..." : "Save Lead"}</button>
        </form>
      </div>
    </div>
  );
}
