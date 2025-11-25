import { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { uploadFileToDrive, makeFilePublic, getDriveDownloadUrl } from '../utils/googleDrive';

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

  // Handles file upload to Google Drive and stores only {url, name}
  const handleFileChange = async (e) => {
    const filesArr = Array.from(e.target.files);
    setLoading(true);
    const uploadedFiles = [];
    for (const file of filesArr) {
      try {
        const id = await uploadFileToDrive(file);
        await makeFilePublic(id);
        const url = getDriveDownloadUrl(id);
        uploadedFiles.push({ url, name: file.name });
      } catch (err) {
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
    onSave({
      ...formData,
      converted: formData.isConverted || formData.converted,
      files,
      hasFiles: files.length > 0
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
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 block text-center cursor-pointer">
            <Upload className="text-gray-400 mx-auto" />
            <span className="block mt-2 text-sm text-indigo-600">Click to upload any file</span>
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
          {loading && <div className="text-indigo-600">Uploading files...</div>}
          {Array.isArray(files) && files.length > 0 &&
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span key={i} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded border border-gray-200 text-xs">
                  <FileText size={16} />{f.name}
                </span>
              ))}
            </div>
          }
          <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg" type="submit" disabled={loading}>
            {initialData ? "Update Lead" : "Upload Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}
