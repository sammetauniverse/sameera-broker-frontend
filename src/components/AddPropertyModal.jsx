import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import api from '../api';

export default function AddPropertyModal({ isOpen, onClose, onPropertyAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    property_type: 'plot',
    status: 'available',
    plot_area: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData for file upload
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      await api.post('inventory/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onPropertyAdded();
      onClose();
    } catch (error) {
      alert('Error adding property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Property</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
              id="property-image"
            />
            <label htmlFor="property-image" className="cursor-pointer flex flex-col items-center">
              <Upload size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">{image ? image.name : "Click to upload property image"}</span>
            </label>
          </div>

          <input
            type="text" placeholder="Property Title" required
            className="w-full border rounded p-2"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number" placeholder="Price (₹)" required
              className="w-full border rounded p-2"
              value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
            <input
              type="text" placeholder="Location" required
              className="w-full border rounded p-2"
              value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full border rounded p-2 bg-white"
              value={formData.property_type} onChange={(e) => setFormData({...formData, property_type: e.target.value})}
            >
              <option value="plot">Plot</option>
              <option value="house">House</option>
              <option value="flat">Flat</option>
            </select>
            <input
              type="text" placeholder="Area (e.g. 2400 sq ft)"
              className="w-full border rounded p-2"
              value={formData.plot_area} onChange={(e) => setFormData({...formData, plot_area: e.target.value})}
            />
          </div>

          <textarea
            placeholder="Description"
            className="w-full border rounded p-2 h-24"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition-colors font-bold shadow-md"
          >
            {loading ? 'Uploading...' : 'Publish Property'}
          </button>
        </form>
      </div>
    </div>
  );
}
