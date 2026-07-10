import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Calendar, CreditCard, LogOut, Settings } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          SparkeSplash
          <span className="text-sm block text-gray-400 font-normal">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/bookings" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition">
            <Calendar size={20} />
            <span>Bookings</span>
          </Link>
          <Link to="/admin/customers" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition">
            <Users size={20} />
            <span>Customers</span>
          </Link>
          <Link to="/admin/payments" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition">
            <CreditCard size={20} />
            <span>Payments</span>
          </Link>
          <Link to="/admin/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-700 transition text-red-400 hover:text-red-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
