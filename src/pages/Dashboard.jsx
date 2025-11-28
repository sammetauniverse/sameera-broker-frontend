import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, converted: 0 });

  const API_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com";

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/leads/stats/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          total: data.total_leads || 0,
          new: data.new_leads || 0,
          converted: data.converted_leads || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();

    // Listen for lead additions from MyLeads page
    const handleLeadAdded = () => {
      console.log('Lead added event received, refreshing stats...');
      fetchStats();
    };

    window.addEventListener('leadAdded', handleLeadAdded);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('leadAdded', handleLeadAdded);
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">New Leads</p>
              <p className="text-2xl font-bold text-gray-800">{stats.new}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Converted</p>
              <p className="text-2xl font-bold text-gray-800">{stats.converted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
