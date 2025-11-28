import api from '../api';
import { useEffect, useState } from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, converted: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/leads/'); // or '/leads/summary/' if you add that endpoint
        const data = res.data;
        const leads = Array.isArray(data) ? data : (data.results || []);

        setStats({
          total: leads.length,
          new: leads.filter((l) => l.status === 'new').length,
          converted: leads.filter((l) => l.is_converted).length,
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Leads</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">New Leads</p>
            <h2 className="text-2xl font-bold">{stats.new}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Converted</p>
            <h2 className="text-2xl font-bold">{stats.converted}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
