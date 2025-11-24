import { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';

export default function AddPropertyModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    status: 'Available',
    lat: '',
    lng: '',
    acres: '',
    price: '',
    comments: '' // Initial comment
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(f => f.name);
    setUploadedFiles([...uploadedFiles, ...fileNames]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine form data with files
    const propertyData = {
      ...formData,
      files: uploadedFiles,
      hasFiles: uploadedFiles.length > 0,
      comments: formData.comments ? [formData.comments] : [] // Convert initial string to array
    };

    onSave(propertyData);
    onClose();
    
    // Reset
    setFormData({ date: new Date().toISOString().split('T')[0], title: '', status: 'Available', lat: '', lng: '', acres: '', price: '', comments: '' });
    setUploadedFiles([]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Add New Inventory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* ... (Fields for Title, Price, Location, etc.) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Property Title</label>
              <input required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Luxury Villa"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (INR)</label>
              <input required type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Area</label>
              <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" value={formData.acres} onChange={e => setFormData({...formData, acres: e.target.value})} placeholder="e.g. 2400 Sq.ft"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lat</label>
              <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lng</label>
              <input className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} />
            </div>
          </div>

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Comments</label>
            <textarea className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none" rows="2" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} placeholder="Add notes..."></textarea>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upload Photos / Docs</label>
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer block">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Upload size={24} className="text-indigo-500" />
              </div>
              <p className="text-indigo-600 font-medium text-sm">Click to upload files</p>
              <input type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
            
            {/* File Preview List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((f, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs border border-indigo-100">{f}</span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Property</button>
          </div>
        </form>
      </div>
    </div>
  );
}
