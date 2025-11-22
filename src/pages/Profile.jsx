import Layout from '../components/Layout';
import { User, Mail, Phone, Building } from 'lucide-react';

export default function Profile() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-12 mb-4">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg inline-block">
                <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
                  A
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Administrator</h2>
                <p className="text-gray-500">Senior Broker</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-1">
                    <User size={18} className="text-indigo-600" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Username</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-7">admin</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-1">
                    <Mail size={18} className="text-indigo-600" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Email</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-7">admin@sameera.com</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-1">
                    <Phone size={18} className="text-indigo-600" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Phone</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-7">+91 98765 43210</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-1">
                    <Building size={18} className="text-indigo-600" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Region</span>
                  </div>
                  <p className="text-gray-900 font-medium pl-7">Chennai & Bangalore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
