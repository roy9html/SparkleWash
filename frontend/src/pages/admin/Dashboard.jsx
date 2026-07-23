import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  Users, Calendar, CreditCard, Star,
  LayoutDashboard, Car, DollarSign,
  Plus, Edit, Trash2, Eye, X,
  Search, UserPlus, Package, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import DashboardCard from '../../components/DashboardCard';
import BookingTable from '../../components/BookingTable';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- MOCK DATA ----------
  const [users, setUsers] = useState([
    { id: 1, name: 'Jane Mwangi', email: 'jane@example.com', role: 'customer', status: 'active', joined: '2026-01-15' },
    { id: 2, name: 'Peter Ochieng', email: 'peter@example.com', role: 'customer', status: 'active', joined: '2026-02-20' },
    { id: 3, name: 'Grace Akinyi', email: 'grace@example.com', role: 'customer', status: 'inactive', joined: '2026-03-10' },
    { id: 4, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joined: '2026-01-01' },
  ]);

  const [services, setServices] = useState([
    { id: 1, name: 'Basic Wash', price: 800, duration: 30, isActive: true },
    { id: 2, name: 'Premium Wash', price: 1500, duration: 45, isActive: true },
    { id: 3, name: 'Deluxe Package', price: 2800, duration: 60, isActive: true },
    { id: 4, name: 'Interior Detailing', price: 3200, duration: 90, isActive: false },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, user: 'Jane Mwangi', booking: 'Premium Wash', amount: 1500, method: 'MPesa', status: 'completed', date: '2026-07-16 10:30', ref: 'MPESA123' },
    { id: 2, user: 'Peter Ochieng', booking: 'Basic Wash', amount: 800, method: 'Cash', status: 'pending', date: '2026-07-16 09:15', ref: 'CASH456' },
    { id: 3, user: 'Grace Akinyi', booking: 'Deluxe Package', amount: 2800, method: 'MPesa', status: 'completed', date: '2026-07-15 16:45', ref: 'MPESA789' },
    { id: 4, user: 'David Kamau', booking: 'Interior Detailing', amount: 3200, method: 'Card', status: 'failed', date: '2026-07-15 14:20', ref: 'CARD012' },
  ]);

  // ---------- MODAL STATE ----------
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'addUser', 'editUser', 'addService', 'editService'
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  // ---------- STATS ----------
  const totalUsers = users.length;
  const activeServices = services.filter(s => s.isActive).length;
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalBookings = payments.length;

  // ---------- HANDLERS ----------
  const handleDelete = (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    if (type === 'user') setUsers(users.filter(u => u.id !== id));
    else if (type === 'service') setServices(services.filter(s => s.id !== id));
    else if (type === 'payment') setPayments(payments.filter(p => p.id !== id));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    setFormData(item ? { ...item } : {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalType === 'addUser') {
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role || 'customer',
        status: 'active',
        joined: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser]);
      toast.success('User added');
    } else if (modalType === 'editUser') {
      setUsers(users.map(u => u.id === currentItem.id ? { ...u, ...formData } : u));
      toast.success('User updated');
    } else if (modalType === 'addService') {
      const newService = {
        id: services.length + 1,
        name: formData.name,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        isActive: true,
      };
      setServices([...services, newService]);
      toast.success('Service added');
    } else if (modalType === 'editService') {
      setServices(services.map(s => s.id === currentItem.id ? { ...s, ...formData } : s));
      toast.success('Service updated');
    }
    closeModal();
  };

  const handleStatusChange = (type, id, newStatus) => {
    if (type === 'payment') {
      setPayments(payments.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast.success('Payment status updated');
    }
  };

  // ---------- TAB RENDERING ----------
  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Users" value={totalUsers} icon={<Users size={24} />} color="blue" />
        <DashboardCard title="Active Services" value={activeServices} icon={<Car size={24} />} color="green" />
        <DashboardCard title="Revenue" value={`Kshs ${totalRevenue.toLocaleString()}`} icon={<DollarSign size={24} />} color="purple" />
        <DashboardCard title="Bookings" value={totalBookings} icon={<Calendar size={24} />} color="orange" />
      </div>
      <BookingTable />
    </>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
        <button onClick={() => openModal('addUser')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3">{u.joined}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => openModal('editUser', u)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('user', u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Services</h2>
        <button onClick={() => openModal('addService')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Add Service
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price (Kshs)</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.price}</td>
                <td className="p-3">{s.duration} min</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => openModal('editService', s)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete('service', s.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Booking</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Ref</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.filter(p => p.user.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.user}</td>
                <td className="p-3">{p.booking}</td>
                <td className="p-3">Kshs {p.amount}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange('payment', p.id, e.target.value)}
                    className={`text-xs rounded-full px-2 py-1 border-0 ${getStatusColor(p.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td className="p-3">{p.date}</td>
                <td className="p-3">{p.ref}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => handleDelete('payment', p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---------- UTILITY ----------
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // ---------- MODAL ----------
  const renderModal = () => {
    if (!showModal) return null;
    const isEdit = modalType.includes('edit');
    const title = isEdit ? `Edit ${modalType.replace('edit','')}` : `Add New ${modalType.replace('add','')}`;
    const fields = modalType.includes('User') ? ['name', 'email'] : ['name', 'price', 'duration'];
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave}>
            {fields.map(f => (
              <div key={f} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 capitalize">{f}</label>
                <input
                  type={f === 'email' ? 'email' : f === 'price' || f === 'duration' ? 'number' : 'text'}
                  value={formData[f] || ''}
                  onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                  step={f === 'price' ? '0.01' : '1'}
                />
              </div>
            ))}
            {modalType.includes('User') && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role || 'customer'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ---------- TABS ----------
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'services', label: 'Services', icon: Car },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="inline w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'payments' && renderPayments()}

        {renderModal()}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;