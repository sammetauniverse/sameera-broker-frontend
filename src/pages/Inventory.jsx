import { useState } from 'react';
import Layout from '../components/Layout';
import { MapPin, IndianRupee, Trash2, Plus, Filter, X, Image as ImageIcon } from 'lucide-react';

export default function Inventory() {
  const [properties, setProperties] = useState([
    { id: 1, title: "Luxury Villa in ECR", price: 15000000, location: "ECR, Chennai", property_type: "Villa", area_sqft: 2500, description: "Beautiful sea view villa.", status: "Available", image: null },
    { id: 2, title: "2BHK Apartment", price: 6500000, location: "Whitefield, Bangalore", property_type: "Apartment", area_sqft: 1200, description: "Near IT park.", status: "Sold", image: null },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ title: '', price: '', location: '', property_type: 'Villa', area_sqft: '', description: '', status: 'Available' });

  const handleAddProperty = (e) => {
    e.preventDefault();
    setProperties([{ id: Date.now(), ...newProperty }, ...properties]);
    setIsModalOpen(false);
    setNewProperty({ title: '', price: '', location: '', property_type: 'Villa', area_sqft: '', description: '', status: 'Available' });
  };

  const handleDelete = (id) => {
    if (confirm('Delete property?')) setProperties(properties.filter(p => p.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2">
            <Plus size={18} /> Add Property
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm group hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 relative">
                <ImageIcon size={32} />
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{property.status}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-2"><IndianRupee size={18} className="inline" /> {Number(property.price).toLocaleString()}</p>
                <div className="text-sm text-gray-500 mb-3 flex gap-2 items-center"><MapPin size={14}/> {property.location}</div>
                <div className="flex justify-between text-xs text-gray-500 border-t pt-3 mt-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{property.property_type}</span>
                  <span>{property.area_sqft} sq.ft</span>
                </div>
                <button onClick={() => handleDelete(property.id)} className="w-full mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex justify-center gap-2"><Trash2 size={16} /> Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD PROPERTY MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Property</h2>
                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
              </div>
              <form onSubmit={handleAddProperty} className="space-y-4">
                <input required placeholder="Property Title" className="w-full p-3 border rounded-lg" value={newProperty.title} onChange={e => setNewProperty({...newProperty, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price" className="w-full p-3 border rounded-lg" value={newProperty.price} onChange={e => setNewProperty({...newProperty, price: e.target.value})} />
                  <input required type="number" placeholder="Area (sq.ft)" className="w-full p-3 border rounded-lg" value={newProperty.area_sqft} onChange={e => setNewProperty({...newProperty, area_sqft: e.target.value})} />
                </div>
                <input required placeholder="Location" className="w-full p-3 border rounded-lg" value={newProperty.location} onChange={e => setNewProperty({...newProperty, location: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full p-3 border rounded-lg" value={newProperty.property_type} onChange={e => setNewProperty({...newProperty, property_type: e.target.value})}>
                    <option>Villa</option><option>Apartment</option><option>Plot</option>
                  </select>
                  <select className="w-full p-3 border rounded-lg" value={newProperty.status} onChange={e => setNewProperty({...newProperty, status: e.target.value})}>
                    <option>Available</option><option>Sold</option>
                  </select>
                </div>
                <textarea placeholder="Description" className="w-full p-3 border rounded-lg h-24" value={newProperty.description} onChange={e => setNewProperty({...newProperty, description: e.target.value})}></textarea>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">Add Property</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
