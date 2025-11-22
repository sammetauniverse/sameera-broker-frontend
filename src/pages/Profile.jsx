import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Camera, Save, Loader } from 'lucide-react';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: 'Sameera Bangalore',
    phone: '+91 98765 43210',
    avatar: null
  });

  // Load saved profile on startup
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert image to Base64 string to save in LocalStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert("Profile updated successfully!");
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300 font-bold text-4xl">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-md">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
