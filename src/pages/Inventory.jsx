import { useEffect, useState } from 'react';
import api from '../api';
import AddPropertyModal from '../components/AddPropertyModal';
import { Plus, Trash2, MapPin } from 'lucide-react';

export default function Inventory() {
  const [properties, setProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProperties = () => {
    api.get('inventory/')
      .then(res => setProperties(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`inventory/${id}/`);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        alert('Failed to delete property');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Inventory</h1>
          <p className="text-gray-500">Manage your real estate listings</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
        >
          <Plus size={20} /> Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48 overflow-hidden">
              {property.image ? (
                <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {property.status}
                </span>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{property.title}</h2>
                <span className="text-red-600 font-bold">₹{parseInt(property.price).toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin size={16} className="mr-1" />
                {property.location}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {property.property_type} • {property.plot_area}
                </span>
                
                <button 
                  onClick={() => handleDelete(property.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                  title="Delete Property"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPropertyAdded={fetchProperties} 
      />
    </div>
  );
}
