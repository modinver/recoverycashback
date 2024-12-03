import React from 'react';
import { useAuthStore } from '../../store/auth';
import { LogOut, User } from 'lucide-react';

const AdminHeader = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-emerald-600">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;