import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import AddPropertyModal from '../components/AddPropertyModal';
import { 
  MapPin, IndianRupee, Trash2, Plus, Filter, X, 
  Image as ImageIcon, FileText, MessageSquare, Upload, 
  ChevronDown, User, LogOut, Lock, Edit3 
} from 'lucide-react';

export default function Inventory() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  
  // --- 1. SHARED DB KEY ---
  const SHARED_KEY = 'SHARED_INVENTORY_DB';
  const profileKey = `userProfile_${currentUser}`;

  // Redirect if not logged in
  useEffect(() => { if (!currentUser) navigate('/'); }, [currentUser, navigate]);

  // --- 2. LOAD SHARED DATA ---
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem(SHARED_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState({ name: currentUser || 'User', avatar: null });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // DETAIL VIEW STATE
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Save to Storage
  useEffect(() => {
    localStorage.setItem(SHARED_KEY, JSON.stringify(properties));
  }, [properties]);

  // Load Profile
  useEffect(() => {
    const savedProfile = localStorage.getItem(profileKey);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, [profileKey]);

  // --- ACTIONS ---

  const handleAddProperty = (propData) => {
    const newProp = {
      ...propData,
      id: Date.now(),
      createdBy: currentUser, // Tag Owner
      comments: propData.comments || [],
      docs: propData.files || []
    };
    setProperties([newProp, ...properties]);
  };

  const handleDelete = (id, owner) => {
    if (currentUser === 'admin' || currentUser === owner) {
      if (confirm('Delete this property?')) {
        setProperties(properties.filter(p => p.id !== id));
        setSelectedProperty(null);
      }
    } else {
      alert("Only the owner or admin can delete this.");
    }
  };

  // --- DETAIL MODAL LOGIC ---
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = { ...selectedProperty, comments: [...selectedProperty.comments, newComment] };
    setProperties(properties.map(p => p.id === updated.id ? updated : p));
    setSelectedProperty(updated);
    setNewComment("");
  };

  const handleDetailFileUpload = (e) => {
    if (e.target.files[0]) {
      const updated = { ...selectedProperty, docs: [...selectedProperty.docs, e.target.files[0].name], hasFiles: true };
      setProperties(properties.map(p => p.id === updated.id ? updated : p));
      setSelectedProperty(updated);
    }
  };

  const canEdit = (owner) => currentUser === 'admin' || currentUser === owner;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <div className="flex gap-4">
            <button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 font-medium">
              <Plus size={18} /> Add Property
            </button>
            
            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 bg-white border px-4 py-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover"/> : profile.name[0]}
                </div>
                <span className="text-sm font-medium">{profile.name}</span>
                <ChevronDown size={16} />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border rounded-xl py-1 z-50">
                  <button onClick={() => navigate('/profile')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex gap-2"><User size={14}/> Profile</button>
                  <button onClick={() => {localStorage.clear(); navigate('/')}} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex gap-2"><LogOut size={14}/> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 relative">
                  <ImageIcon size={32} />
                  <span className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">{property.status}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg truncate">{property.title}</h3>
                  <p className="text-indigo-600 font-bold text-xl mt-1">₹ {Number(property.price).toLocaleString()}</p>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <MapPin size={14} /> {property.lat}, {property.lng}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white ${property.createdBy === currentUser ? 'bg-indigo-500' : 'bg-gray-400'}`}>
                        {property.createdBy ? property.createdBy[0].toUpperCase() : 'U'}
                      </div>
                      <span className="text-xs text-gray-500">{property.createdBy === currentUser ? 'You' : property.createdBy}</span>
                    </div>
                    
                    {property.hasFiles && <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 flex gap-1"><FileText size={12}/> Files</span>}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setSelectedProperty(property)} className="flex-1 bg-gray-50 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50">View Details</button>
                    {canEdit(property.createdBy) && (
                      <button onClick={() => handleDelete(property.id, property.createdBy)} className="px-3 text-red-500 bg-red-50 rounded-lg hover:bg-red-100">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              No properties found. Add one to get started!
            </div>
          )}
        </div>

        {/* --- DETAILS MODAL (Comments & Files) --- */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
                <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Info */}
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border">
                  <div><p className="text-xs text-gray-500">Price</p><p className="font-bold">₹ {selectedProperty.price}</p></div>
                  <div><p className="text-xs text-gray-500">Area</p><p className="font-bold">{selectedProperty.acres}</p></div>
                  <div><p className="text-xs text-gray-500">Owner</p><p className="font-bold">{selectedProperty.createdBy}</p></div>
                </div>

                {/* Comments */}
                <div>
                  <h3 className="font-bold mb-2 flex gap-2 items-center"><MessageSquare size={18}/> Comments</h3>
                  <div className="bg-gray-50 p-4 rounded-xl border space-y-2 mb-2 max-h-40 overflow-y-auto">
                    {selectedProperty.comments && selectedProperty.comments.length > 0 ? (
                      selectedProperty.comments.map((c, i) => <div key={i} className="bg-white p-2 rounded shadow-sm text-sm">{c}</div>)
                    ) : <p className="text-sm text-gray-400">No comments yet.</p>}
                  </div>
                  <div className="flex gap-2">
                    <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Add a note..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <button onClick={handleAddComment} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Post</button>
                  </div>
                </div>

                {/* Files */}
                <div>
                  <h3 className="font-bold mb-2 flex gap-2 items-center"><FileText size={18}/> Documents & Images</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedProperty.docs && selectedProperty.docs.length > 0 ? (
                      selectedProperty.docs.map((f, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 text-sm flex gap-2 items-center">
                          <FileText size={14}/> {f}
                        </span>
                      ))
                    ) : <p className="text-sm text-gray-400">No files uploaded.</p>}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <Upload size={16}/> Upload New File
                    <input type="file" className="hidden" onChange={handleDetailFileUpload} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <AddPropertyModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddProperty} />
      </div>
    </Layout>
  );
}
