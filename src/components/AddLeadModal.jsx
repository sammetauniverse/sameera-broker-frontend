import { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import api from '../api';

export default function AddLeadModal({ isOpen, onClose, onLeadAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'new',
    location: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    price: '',
    land_acres: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
        name: formData.name,
        phone_number: formData.phone,
        email: formData.email,
        status: formData.status,
        location: formData.location
        // Note: Add extra fields to your backend model if you want to save Price/Land/Date
    };

    try {
      await api.post('leads/', payload);
      onLeadAdded();
      onClose();
      setFormData({ 
        name: '', phone: '', email: '', status: 'new', location: '',
        date: new Date().toISOString().split('T')[0], price: '', land_acres: ''
      });
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        const firstKey = Object.keys(errorData)[0];
        setError(`${firstKey.replace('_', ' ')}: ${errorData[firstKey][0]}`);
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit New Lead</h2>
            <p className="text-gray-500 text-sm mt-1">Enter lead details below</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                <Calendar className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Client Name</label>
              <input
                type="text" required
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
              <input
                type="tel" required
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
              <input
                type="email" required
                placeholder="client@example.com"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Location</label>
              <input
                type="text"
                placeholder="Bangalore, KA"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 outline-none"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          {/* File Upload Area (Visual Only for now) */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Upload Documents</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <p className="text-gray-900 font-medium">Click to upload files</p>
              <p className="text-gray-400 text-sm mt-1">SVG, PNG, JPG or PDF (max. 800x400px)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
