import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import {
  Users, Calendar, CreditCard, Car, DollarSign,
  Plus, Edit, Trash2, X, Search, LayoutDashboard
} from 'lucide-react';
import api from '../../services/api';
import DashboardCard from '../../components/DashboardCard';
import BookingTable from '../../components/BookingTable';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import VehicleManager from '../../components/VehicleManager';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // State from API
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, servicesRes, paymentsRes, bookingsRes] = await Promise.all([
        api.get('/users'),
        api.get('/services'),
        api.get('/payments'),
        api.get('/bookings'),
      ]);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
      setPayments(paymentsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stats
  const totalUsers = users.length;
  const activeServices = services.filter(s => s.is_active).length;
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalBookings = bookings.length;

  // CRUD Handlers
  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      await api.delete(`/${type}s/${id}`);
      toast.success(`${type} deleted`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success('Booking deleted');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setCurrentItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({});
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      let payload = {};

      if (modalType === 'addUser') {
        endpoint = '/users';
        payload = {
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          password: formData.password || 'password123',
          role: formData.role || 'customer'
        };
        await api.post(endpoint, payload);
        toast.success('User added');
      } 
      else if (modalType === 'editUser') {
        endpoint = `/users/${currentItem.id}`;
        payload = {
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          role: formData.role
        };
        await api.put(endpoint, payload);
        toast.success('User updated');
      } 
      else if (modalType === 'addService') {
        endpoint = '/services';
        const price = parseFloat(formData.price);
        const duration = parseInt(formData.duration_minutes, 10);
        if (isNaN(price) || price <= 0) {
          toast.error('Price must be a positive number');
          return;
        }
        if (isNaN(duration) || duration <= 0) {
          toast.error('Duration must be a positive integer');
          return;
        }
        payload = {
          name: formData.name?.trim(),
          price: price,
          duration_minutes: duration,
          description: formData.description?.trim() || '',
          is_active: true
        };
        await api.post(endpoint, payload);
        toast.success('Service added');
      } 
      else if (modalType === 'editService') {
        endpoint = `/services/${currentItem.id}`;
        const price = parseFloat(formData.price);
        const duration = parseInt(formData.duration_minutes, 10);
        if (isNaN(price) || price <= 0) {
          toast.error('Price must be a positive number');
          return;
        }
        if (isNaN(duration) || duration <= 0) {
          toast.error('Duration must be a positive integer');
          return;
        }
        payload = {
          name: formData.name?.trim(),
          price: price,
          duration_minutes: duration,
          description: formData.description?.trim() || '',
          is_active: formData.is_active !== undefined ? formData.is_active : true
        };
        await api.put(endpoint, payload);
        toast.success('Service updated');
      }
      
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('. ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    }
  };

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      await api.put(`/${type}s/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  // ---------- RENDER FUNCTIONS ----------
  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Users" value={totalUsers} icon={<Users size={24} />} color="blue" />
        <DashboardCard title="Active Services" value={activeServices} icon={<Car size={24} />} color="green" />
        <DashboardCard title="Revenue" value={`Kshs ${totalRevenue.toLocaleString()}`} icon={<DollarSign size={24} />} color="purple" />
        <DashboardCard title="Bookings" value={totalBookings} icon={<Calendar size={24} />} color="orange" />
      </div>
      <BookingTable bookings={bookings} onDelete={handleDeleteBooking} />
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
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(u => (
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
              <th className="p-3 text-left">Duration (min)</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.price}</td>
                <td className="p-3">{s.duration_minutes}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {s.is_active ? 'Active' : 'Inactive'}
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
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.filter(p => p.user?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.user}</td>
                <td className="p-3">{p.booking}</td>
                <td className="p-3">Kshs {p.amount}</td>
                <td className="p-3">{p.payment_method}</td>
                <td className="p-3">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange('payment', p.id, e.target.value)}
                    className="text-xs rounded-full px-2 py-1 border-0 bg-gray-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td className="p-3">{new Date(p.payment_date).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete('payment', p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---------- VEHICLES ----------
  const renderVehicles = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">All Vehicles</h2>
      <VehicleManager isAdmin={true} />
    </div>
  );

  // Modal
  const renderModal = () => {
    if (!showModal) return null;
    const isEdit = modalType.includes('edit');
    const title = isEdit ? `Edit ${modalType.replace('edit','')}` : `Add New ${modalType.replace('add','')}`;
    const fields = modalType.includes('User')
      ? ['name', 'email']
      : ['name', 'price', 'duration_minutes', 'description'];
    const fieldLabels = {
      name: 'Name',
      email: 'Email',
      price: 'Price (Kshs)',
      duration_minutes: 'Duration (minutes)',
      description: 'Description'
    };
    const getInputType = (f) => {
      if (f === 'email') return 'email';
      if (f === 'price' || f === 'duration_minutes') return 'number';
      return 'text';
    };
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
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {fieldLabels[f] || f}
                </label>
                <input
                  type={getInputType(f)}
                  value={formData[f] || ''}
                  onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required={f !== 'description'}
                  step={f === 'price' ? '0.01' : f === 'duration_minutes' ? '1' : undefined}
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'services', label: 'Services', icon: Car },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

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

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'vehicles' && renderVehicles()}

        {renderModal()}
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;