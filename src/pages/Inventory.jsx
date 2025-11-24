import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddPropertyModal from '../components/AddPropertyModal'; // Import the new modal
import { MapPin, IndianRupee, Trash2, Plus, Image as ImageIcon, ChevronDown, User, LogOut } from 'lucide-react';

export default function Inventory() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  const inventoryKey = `inventory_${currentUser}`; 
  const profileKey = `userProfile_${currentUser}`;

  // --- STATE ---
  const [profile, setProfile] = useState({ name: currentUser || 'User', avatar: null });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load Properties SPECIFIC to this user
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem(inventoryKey);
    if (saved) return JSON.parse(saved);
    
    // Only show demo data for admin
    if (currentUser === 'admin') {
      return [{ 
        id: 1, title: "Luxury Villa in ECR", price: "15000000", 
        lat: "12.97", lng: "80.22", acres: "2500 sqft", 
        status: "Available", date: "2025-11-24"
      }];
    }
    return []; // EMPTY for new users
  });

  // Save Properties when changed
  useEffect(() => {
    localStorage.setItem(inventoryKey, JSON.stringify(properties));
  }, [properties, inventoryKey]);

  // Load Profile Photo
  useEffect(() => {
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, [profileKey]);

  const handleAddProperty = (newPropData) => {
    const newProp = { id: Date.now(), ...newPropData };
    setProperties([newProp, ...properties]); // Add to top of list
  };

  const handleDelete = (id) => {
    if (confirm('Delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your listings</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2"
            >
              <Plus size={18} /> Add Property
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-xs overflow-hidden">
                  {profile.avatar ? <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" /> : profile.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                  <button onClick={() => navigate('/profile')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex gap-2"><User size={14}/> Profile</button>
                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex gap-2"><LogOut size={14}/> Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- PROPERTY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 relative">
                <ImageIcon size={32} />
                <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700">
                  {property.status}
                </span>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 truncate">{property.title}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-2">₹ {Number(property.price).toLocaleString()}</p>
                
                <div className="text-sm text-gray-500 mb-3 flex gap-2 items-center">
                  <MapPin size={14}/> {property.lat}, {property.lng}
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 border-t pt-3 mt-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{property.acres}</span>
                  <span>Listed: {property.date}</span>
                </div>

                <button 
                  onClick={() => handleDelete(property.id)} 
                  className="w-full mt-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex justify-center gap-2"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="mb-4 text-gray-400 flex justify-center"><Plus size={48} /></div>
              <h3 className="text-lg font-medium text-gray-900">No properties yet</h3>
              <p className="text-gray-500 mb-4">Add your first property to the inventory.</p>
              <button onClick={() => setIsAddModalOpen(true)} className="text-indigo-600 font-bold hover:underline">Add Property Now</button>
            </div>
          )}
        </div>

        {/* --- CONNECT THE NEW MODAL --- */}
        <AddPropertyModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleAddProperty} 
        />

      </div>
    </Layout>
  );
}
