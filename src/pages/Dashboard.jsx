import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, Phone, MapPin, FileText, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, converted: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://sameera-broker-backend.onrender.com";

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    try {
      // Fetch stats
      const statsResponse = await fetch(`${API_URL}/api/leads/stats/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          total: statsData.total_leads || 0,
          new: statsData.new_leads || 0,
          converted: statsData.converted_leads || 0,
        });
      }

      // Fetch recent leads (all leads from all users)
      const leadsResponse = await fetch(`${API_URL}/api/leads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        const allLeads = Array.isArray(leadsData) ? leadsData : (leadsData.results || []);
        // Show only the 6 most recent leads
        setRecentLeads(allLeads.slice(0, 6));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Listen for lead additions
    const handleLeadAdded = () => {
      console.log('Lead added, refreshing dashboard...');
      fetchDashboardData();
    };

    window.addEventListener('leadAdded', handleLeadAdded);

    return () => {
      window.removeEventListener('leadAdded', handleLeadAdded);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Stats Cards */}
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

      {/* Recent Leads Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Leads</h2>
        
        {recentLeads.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No leads available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentLeads.map((lead) => (
              <div 
                key={lead.id} 
                className="bg-gray-50 p-4 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-800">{lead.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    lead.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                    lead.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'converted' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {lead.status?.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-indigo-600" /> 
                    {lead.phone_number}
                  </div>
                  
                  {lead.preferred_location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-indigo-600" /> 
                      {lead.preferred_location}
                    </div>
                  )}
                  
                  {lead.budget && (
                    <div className="text-gray-700 font-semibold">
                      Budget: ₹{lead.budget}
                    </div>
                  )}
                  
                  {lead.file_url && (
                    <a 
                      href={lead.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 text-indigo-600 hover:underline text-xs pt-2 border-t"
                    >
                      <FileText size={12}/> Document <ExternalLink size={10}/>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
