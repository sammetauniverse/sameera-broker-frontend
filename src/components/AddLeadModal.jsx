import { useState, useEffect } from 'react';
import { X, Upload, FileText, Trash2, Loader } from 'lucide-react';

export default function AddLeadModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    google_pin: '',
    preferred_location: '',
    budget: '',
    status: 'new',
    is_converted: false,
    site_visit_done: false,
    comments: '',
    file_urls: [] 
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        file_urls: initialData.file_urls || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- FILE UPLOAD LOGIC ---
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      // Placeholder for file logic - preserves existing files and adds dummy URLs for now
      // ensuring the UI doesn't break.
      const newUrls = files.map(f => URL.createObjectURL(f));
      
      setFormData(prev => ({
        ...prev,
        file_urls: [...prev.file_urls, ...newUrls]
      }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      file_urls: prev.file_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // CRITICAL FIX: Check if onSave exists before calling it
      if (typeof onSave === 'function') {
        await onSave(formData);
      } else {
        console.error("onSave function is missing!");
        alert("System Error: Save function missing.");
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Failed to save lead. " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                required
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Contact number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
              <input 
                name="preferred_location"
                value={formData.preferred_location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input 
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md disabled:bg-gray-400 flex justify-center items-center gap-2"
            >
              {loading ? <Loader className="animate-spin w-5 h-5"/> : 'Save Lead'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
