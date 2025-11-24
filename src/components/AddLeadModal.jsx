import { useState } from 'react';
import { X, Upload, Calendar, MapPin } from 'lucide-react';

export default function AddLeadModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'New',
    name: '',
    address: '', // NEW: Street Address
    lat: '', // Optional now
    lng: '', // Optional now
    acres: '',
    price: '',
    comments: '', // NEW: Comments
    siteVisit: false
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(f => f.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate Required Fields
    if (!formData.name || !formData.address || !formData.price) {
      alert("Please fill in Name, Address, and Price.");
      return;
    }

    const leadData = {
      ...formData,
      files: uploadedFiles, // Attach file names
      hasFiles: uploadedFiles.length > 0
    };
    
    onSave(leadData);
    onClose();
    
    // Reset Form
    setFormData({ date: new Date().toISOString().split('T')[0], status: 'New', name: '', address: '', lat: '', lng: '', acres: '', price: '', comments: '', siteVisit: false });
    setUploadedFiles([]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">Submit New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input 
                type="date" 
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Visit Scheduled</option>
                <option>Closed</option>
              </select>
            </div>

            {/* Client Name (REQUIRED) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. Rajesh Kumar" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Price (REQUIRED) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Price (INR) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number"
                required
                placeholder="e.g. 25000000" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            {/* Street Address (REQUIRED - NEW) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                required
                placeholder="e.g. 123 MG Road, Bangalore" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            {/* Latitude (OPTIONAL) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Latitude <span className="text-gray-400 text-[10px]">(Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. 12.9716" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.lat}
                onChange={e => setFormData({...formData, lat: e.target.value})}
              />
            </div>

            {/* Longitude (OPTIONAL) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Longitude <span className="text-gray-400 text-[10px]">(Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="e.g. 77.5946" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.lng}
                onChange={e => setFormData({...formData, lng: e.target.value})}
              />
            </div>

            {/* Acres */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Land (Acres)</label>
              <input 
                type="text" 
                placeholder="e.g. 5.2" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.acres}
                onChange={e => setFormData({...formData, acres: e.target.value})}
              />
            </div>

            {/* Site Visit Checkbox */}
            <div className="flex items-center pt-6">
              <input 
                type="checkbox" 
                id="siteVisit" 
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                checked={formData.siteVisit}
                onChange={e => setFormData({...formData, siteVisit: e.target.checked})}
              />
              <label htmlFor="siteVisit" className="ml-2 text-sm text-gray-700 font-medium">Site Visit Scheduled</label>
            </div>
          </div>

          {/* Comments Box (NEW) */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comments / Notes</label>
            <textarea 
              rows="3"
              placeholder="Add any additional notes about this lead..." 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              value={formData.comments}
              onChange={e => setFormData({...formData, comments: e.target.value})}
            />
          </div>

          {/* Upload Area (FIXED) */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upload Files (Photos, Videos, Docs)</label>
            
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group block">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-500 transition-colors">
                <Upload size={24} />
              </div>
              <p className="text-indigo-600 font-medium text-sm">Click to upload <span className="text-gray-500 font-normal">or drag and drop</span></p>
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileUpload}
              />
            </label>

            {/* Show Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100 flex items-center gap-1">
                    <Upload size={12} /> {file}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
