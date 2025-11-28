import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

export default function AddLeadModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    preferred_location: '',
    budget: '',
    acres: '',
    site_visit_completed: false,
    comments: '',
    file_url: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cloudinary Upload Widget
  const openCloudinaryWidget = () => {
    // Create widget instance
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dt38qbrni', // Your cloud name from previous uploads
        uploadPreset: 'broker_docs', // Create this in Cloudinary dashboard
        sources: ['local', 'camera'],
        multiple: false,
        maxFileSize: 10000000, // 10MB
        resourceType: 'auto',
        clientAllowedFormats: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
        folder: 'broker_leads', // Organize uploads
      },
      (error, result) => {
        if (error) {
          console.error('Upload error:', error);
          alert('File upload failed. Please try again.');
          return;
        }

        if (result.event === 'success') {
          console.log('Upload success:', result.info);
          setFormData(prev => ({ ...prev, file_url: result.info.secure_url }));
        }
      }
    );

    widget.open();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone_number) {
      alert('Name and Phone are required!');
      return;
    }
    
    console.log("Submitting lead data:", formData); // Debug
    onSave(formData);
    
    // Reset form
    setFormData({
      name: '',
      phone_number: '',
      address: '',
      preferred_location: '',
      budget: '',
      acres: '',
      site_visit_completed: false,
      comments: '',
      file_url: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Add New Lead</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
              rows={2}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location, Budget, Acres */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                name="preferred_location"
                value={formData.preferred_location}
                onChange={handleChange}
                placeholder="e.g. Chennai"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="5000000"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Acres</label>
              <input
                type="number"
                step="0.01"
                name="acres"
                value={formData.acres}
                onChange={handleChange}
                placeholder="5.2"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comments / Notes</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Add any notes or comments about this lead..."
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Site Visit Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="site_visit"
              name="site_visit_completed"
              checked={formData.site_visit_completed}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600"
            />
            <label htmlFor="site_visit" className="text-sm text-gray-700">
              Site Visit Completed
            </label>
          </div>

          {/* File Upload using Cloudinary Widget */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-3">
              Click to Upload Document (PDF/Image)
            </p>
            <button
              type="button"
              onClick={openCloudinaryWidget}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Choose File
            </button>
            {formData.file_url && (
              <div className="mt-3">
                <p className="text-xs text-green-600">✓ File uploaded successfully</p>
                <a 
                  href={formData.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View uploaded file
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
}
