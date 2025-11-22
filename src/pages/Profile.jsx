import { useState } from 'react';
import Layout from '../components/Layout';
import { User, Mail, Phone, Building, Upload, Camera } from 'lucide-react';

export default function Profile() {
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative group cursor-pointer">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full flex items-center gap-1">
                <Camera size={12} /> Edit Cover
              </span>
            </div>
          </div>

          <div className="px-8 pb-8">
            {/* Profile Picture Upload Section */}
            <div className="relative -top-12 mb-4 w-24 h-24 group">
              <div className="w-full h-full bg-white rounded-full p-1 shadow-lg relative overflow-hidden">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold border-2 border-indigo-100">
                    A
                  </div>
                )}
                
                {/* Hover Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full z-10">
                  <Upload size={20} className="mb-1" />
                  <span className="text-[10px] font-medium">Upload</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                  />
                </label>
              </div>
            </div>
            
            {/* User Details */}
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Administrator</h2>
                  <p className="text-indigo-600 font-medium">Senior Broker</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                      <User size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Username</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-11">admin</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                      <Mail size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-11">admin@sameera.com</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                      <Phone size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Phone</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-11">+91 98765 43210</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600 transition-colors">
                      <Building size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Region</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-11">Chennai & Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
