import { useState } from 'react';
import Layout from '../components/Layout';
import { MapPin, IndianRupee, Trash2, Plus, Filter } from 'lucide-react';

export default function Inventory() {
  // --- MOCK DATA ---
  const [properties, setProperties] = useState([
    { 
      id: 1, 
      title: "Luxury Villa in ECR", 
      price: 15000000, 
      location: "ECR, Chennai", 
      property_type: "Villa", 
      area_sqft: 2500, 
      description: "Beautiful sea view villa with private pool and garden.",
      status: "Available"
    },
    { 
      id: 2, 
      title: "2BHK Apartment", 
      price: 6500000, 
      location: "Whitefield, Bangalore", 
      property_type: "Apartment", 
      area_sqft: 1200, 
      description: "Spacious apartment near IT park, ready to move in.",
      status: "Sold"
    },
    { 
      id: 3, 
      title: "Commercial Plot", 
      price: 25000000, 
      location: "Gachibowli, Hyderabad", 
      property_type: "Plot", 
      area_sqft: 5000, 
      description: "Corner plot suitable for commercial complex.",
      status: "Available"
    },
  ]);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your property listings</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all">
            <Plus size={18} /> Add Property
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm px-2">
            <Filter size={16} className="text-indigo-600" /> Filter By:
          </div>
          <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Types</option>
            <option>Villa</option>
            <option>Apartment</option>
            <option>Plot</option>
          </select>
          <select className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Status</option>
            <option>Available</option>
            <option>Sold</option>
          </select>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {/* Placeholder Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors relative">
                <span className="text-sm font-medium">No Image Available</span>
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
                </div>
                
                <p className="text-2xl font-bold text-indigo-600 mb-3 flex items-center gap-1">
                  <IndianRupee size={20} />
                  {property.price.toLocaleString()}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin size={14} />
                  {property.location}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4 mt-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-md font-medium">{property.property_type}</span>
                  <span className="font-mono">{property.area_sqft} sq.ft</span>
                </div>

                <button 
                  onClick={() => handleDelete(property.id)}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <Trash2 size={16} /> Remove Listing
                </button>
              </div>
            </div>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No properties found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
