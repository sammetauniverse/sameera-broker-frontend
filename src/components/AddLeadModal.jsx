import { useState } from 'react';
import { X, Upload, Loader, FileText } from 'lucide-react';
import { uploadFileToFirebase } from '../utils/uploadToFirebase';

export default function AddLeadModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    preferred_location: '',
    budget: '',
    status: 'new',
    file_url: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const url = await uploadFileToFirebase(file);
      if (url) {
        setFormData(prev => ({ ...prev, file_url: url }));
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // --- DATA CLEANING FIX ---
      // Convert empty strings to null so the Backend doesn't crash
      const payload = {
        ...formData,
        budget: formData.budget === '' ? null : formData.budget, // Fix for budget error
        file_url: formData.file_url || null // Fix for empty URL error
      };

      await onSave(payload);
      // Note: The parent component handles closing the modal on success
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input required name="phone_number" value={formData.phone_number} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="1234567890" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2"
              className="w-full p-3 border rounded-lg" placeholder="Enter full address" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
              <input name="preferred_location" value={formData.preferred_location} onChange={handleChange}
                className="w-full p-3 border rounded-lg" placeholder="e.g. Chennai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input name="budget" type="number" value={formData.budget} onChange={handleChange}
                className="w-full p-3 border rounded-lg" placeholder="e.g. 5000000" />
            </div>
          </div>

          {/* Upload Box */}
          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${uploadSuccess ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
            <input type="file" onChange={handleFileChange} className="hidden" id="modal-upload" disabled={uploading} />
            <label htmlFor="modal-upload" className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50' : ''}`}>
              {uploading ? (
                <Loader className="animate-spin text-indigo-600 w-8 h-8 mb-2"/>
              ) : uploadSuccess ? (
                <FileText className="text-green-600 w-8 h-8 mb-2"/>
              ) : (
                <Upload className="text-gray-400 w-8 h-8 mb-2"/>
              )}
              
              <span className="text-sm font-medium text-gray-700">
                {uploading ? "Uploading Document..." : uploadSuccess ? "Document Attached!" : "Click to Upload Document (PDF/Image)"}
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploading} 
              className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors">
              {loading ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
