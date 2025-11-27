import { useState, useEffect } from 'react';
import { X, Upload, FileText, Trash2, Loader } from 'lucide-react';
import { uploadFile } from '../utils/uploadToFirebase'; // Importing the util

export default function AddLeadModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    preferred_location: '',
    budget: '',
    status: 'new',
    file_url: '' // Storing single file URL for simplicity
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file); // Uses our util
      setFormData(prev => ({ ...prev, file_url: url }));
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Pass data to parent component to handle the API save
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-red-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input required name="name" value={formData.name} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input required name="phone_number" value={formData.phone_number} onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Phone" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2"
              className="w-full p-3 border rounded-lg" placeholder="Full address" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
              <input name="preferred_location" value={formData.preferred_location} onChange={handleChange}
                className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input name="budget" type="number" value={formData.budget} onChange={handleChange}
                className="w-full p-3 border rounded-lg" />
            </div>
          </div>

          {/* File Upload UI */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
            <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              {uploading ? <Loader className="animate-spin text-indigo-500 w-8 h-8" /> : <Upload className="text-gray-400 w-8 h-8" />}
              <span className="text-indigo-600 font-semibold mt-2">Click to upload document</span>
            </label>
            {formData.file_url && <p className="text-green-600 text-sm mt-2">Document attached!</p>}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading || uploading} className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400">
              {loading ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
