import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import { Plus, Trash2, MapPin, IndianRupee } from 'lucide-react';

export default function Inventory() {
  const [properties, setProperties] = useState([]);

  const fetchProperties = () => {
    api.get('properties/')
      .then(res => setProperties(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = (id) => {
    if (confirm('Delete this property?')) {
      api.delete(`properties/${id}/`)
        .then(() => fetchProperties())
        .catch(err => console.error(err));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your real estate listings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {property.image && (
                <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-3 flex items-center">
                  <IndianRupee size={20} />
                  {property.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  {property.location}
                </p>
                <p className="text-gray-600 text-sm mb-4">{property.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{property.property_type} • {property.area_sqft} sq ft</span>
                </div>
                <button 
                  onClick={() => handleDelete(property.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No properties yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
