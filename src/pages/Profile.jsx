export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
          U
        </div>
        <div>
          <h2 className="text-xl font-semibold">Admin User</h2>
          <p className="text-gray-500">Broker Account</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="font-medium text-green-600">Active</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">Real Estate Broker</p>
        </div>
      </div>
    </div>
  );
}
