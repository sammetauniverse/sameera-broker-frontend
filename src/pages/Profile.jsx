import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building2, Camera, Save, Edit2 } from 'lucide-react';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    company: '',
    address: '',
    avatar_url: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('https://sameera-broker-backend.onrender.com/api/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://sameera-broker-backend.onrender.com/api/auth/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        alert('Profile updated');
        setEditMode(false);
        fetchProfile();
      } else {
        alert('Failed to update');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating');
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username;
  const initials = fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-8">
        {/* Header with avatar */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {editMode && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow"
                title="Change photo (enter URL for now)"
                onClick={() => {
                  const url = prompt('Paste image URL');
                  if (url) setProfile((p) => ({ ...p, avatar_url: url }));
                }}
              >
                <Camera size={16} />
              </button>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{fullName}</h1>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <User size={16} /> {profile.username}
          </p>
        </div>

        {/* View vs Edit toggle */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
          <button
            type="button"
            onClick={() => setEditMode((v) => !v)}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            <Edit2 size={16} />
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Content */}
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  name="address"
                  rows="3"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          // VIEW MODE
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Full Name</span>
              <span>{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone</span>
              <span>{profile.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Company</span>
              <span>{profile.company || '-'}</span>
            </div>
            <div className="mt-4">
              <span className="font-medium block mb-1">Address</span>
              <p className="text-gray-600 whitespace-pre-line">
                {profile.address || 'No address added yet.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
