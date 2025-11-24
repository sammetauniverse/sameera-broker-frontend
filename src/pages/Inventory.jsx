import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  MapPin, IndianRupee, Trash2, Plus, Filter, X, 
  Image as ImageIcon, FileText, MessageSquare, Upload, 
  ChevronDown, User, LogOut, Home 
} from 'lucide-react';

export default function Inventory() {
  const navigate = useNavigate();

  // --- STATE ---
  const [profile, setProfile] = useState({ name: 'Admin', avatar: null });
  const [properties, setProperties] = useState([
    { 
      id: 1, 
      title: "Luxury Villa in ECR", 
      price: "15000000", 
      location: "ECR, Chennai", 
      property_type: "Villa", 
      area_sqft: "2500", 
      description: "Sea view villa with pool.", 
      status: "Available",
      comments: ["Client visit scheduled for Monday."],
      docs: ["deed.pdf"] 
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newComment, setNewComment] = useState("");
  
  const [newPropForm, setNewPropForm] = useState({
    title: '', price: '', location: '', property_type: 'Villa', area_sqft: '', description: '', status: 'Available'
  });

  // --- LOAD PROFILE PHOTO ---
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    const newProp = { id: Date.now(), ...newPropForm, comments: [], docs: [] };
    setProperties([newProp, ...properties]);
    setIsAddModalOpen(false);
    setNewPropForm({ title: '', price: '', location: '', property_type: 'Villa', area_sqft: '', description: '', status: 'Available' });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
      setSelectedProperty(null);
    }
  };

  // Details Modal Actions
  const addComment = () => {
    if (!newComment.trim()) return;
    const updated = { ...selectedProperty, comments: [...selectedProperty.comments, newComment] };
    setProperties(properties.map(p => p.id === updated.id ? updated : p));
    setSelectedProperty(updated);
    setNewComment("");
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      const updated = { ...selectedProperty, docs: [...selectedProperty.docs, e.target.files[0].name] };
      setProperties(properties.map(p => p.id === updated.id ? updated : p));
      setSelectedProperty(updated);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage listings, documents, and notes</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
            >
              <Plus size={18} /> Add Property
            </button>

            {/* Profile Dropdown (Now showing REAL photo) */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold text-xs overflow-hidden border border-indigo-200">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
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
          {properties.map((property) => (
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
                <div className="text-sm text-gray-500 mb-3 flex gap-2 items-center"><MapPin size={14}/> {property.location}</div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setSelectedProperty(property)} className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100">View Details</button>
                  <button onClick={() => handleDelete(property.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL: ADD PROPERTY --- */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Property</h2>
                <button onClick={() => setIsAddModalOpen(false)}><X className="text-gray-400" /></button>
              </div>
              <form onSubmit={handleAddProperty} className="space-y-4">
                <input required placeholder="Property Title" className="w-full p-2 border rounded-lg" value={newPropForm.title} onChange={e => setNewPropForm({...newPropForm, title: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price (₹)" className="w-full p-2 border rounded-lg" value={newPropForm.price} onChange={e => setNewPropForm({...newPropForm, price: e.target.value})} />
                  <input required type="number" placeholder="Area (sq.ft)" className="w-full p-2 border rounded-lg" value={newPropForm.area_sqft} onChange={e => setNewPropForm({...newPropForm, area_sqft: e.target.value})} />
                </div>
                <input required placeholder="Location" className="w-full p-2 border rounded-lg" value={newPropForm.location} onChange={e => setNewPropForm({...newPropForm, location: e.target.value})} />
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">Save Property</button>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: DETAILS --- */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
                <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Comments */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><MessageSquare size={18}/> Comments</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border space-y-3 mb-3">
                    {selectedProperty.comments.length === 0 ? <p className="text-sm text-gray-400">No comments.</p> : selectedProperty.comments.map((c, i) => <div key={i} className="bg-white p-2 rounded border text-sm">{c}</div>)}
                  </div>
                  <div className="flex gap-2">
                    <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="Add note..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <button onClick={addComment} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">Post</button>
                  </div>
                </div>
                {/* Docs */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText size={18}/> Docs</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {selectedProperty.docs.map((doc, i) => <div key={i} className="p-2 border rounded flex gap-2 bg-blue-50 text-xs"><FileText size={14}/> {doc}</div>)}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    <Upload size={16}/> Upload File
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
