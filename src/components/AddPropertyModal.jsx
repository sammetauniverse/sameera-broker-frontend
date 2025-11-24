import { useState } from 'react';
import { X, Upload, MapPin, IndianRupee, Calendar } from 'lucide-react';

export default function AddPropertyModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    status: 'Available',
    lat: '',
    lng: '',
    acres: '',
    price: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Send data back to parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Inventory</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Listing Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-700"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option>Available</option>
                <option>Sold</option>
                <option>Pending</option>
              </select>
            </div>

            {/* Property Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Property Title / Name</label>
              <input 
                type="text" 
                placeholder="e.g. Luxury Villa in ECR" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Location Lat */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
              <input 
                type="text" 
                placeholder="e.g. 12.9716" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.lat}
                onChange={e => setFormData({...formData, lat: e.target.value})}
              />
            </div>

            {/* Location Lng */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
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
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Area (Acres/Sq.ft)</label>
              <input 
                type="text" 
                placeholder="e.g. 5.2 Acres" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.acres}
                onChange={e => setFormData({...formData, acres: e.target.value})}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (INR)</label>
              <input 
                type="number" 
                placeholder="e.g. 25000000" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Upload Property Images & Docs</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-500 transition-colors">
                <Upload size={24} />
              </div>
              <p className="text-indigo-600 font-medium text-sm">Upload files <span className="text-gray-500 font-normal">or drag and drop</span></p>
            </div>
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
              Save Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
