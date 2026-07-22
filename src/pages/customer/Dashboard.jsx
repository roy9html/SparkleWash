import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Trash2, Eye } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // ---------- MOCK DATA ----------
  // Services (same as admin – could be fetched from API later)
  const services = [
    { id: 1, name: 'Basic Wash', price: 800, duration: 30 },
    { id: 2, name: 'Premium Wash', price: 1500, duration: 45 },
    { id: 3, name: 'Deluxe Package', price: 2800, duration: 60 },
    { id: 4, name: 'Interior Detailing', price: 3200, duration: 90 },
  ];

  // User's bookings (mock – filtered by user id later)
  const [bookings, setBookings] = useState([
    { id: 1, service: 'Premium Wash', date: '2026-07-20 10:30', amount: 1500, status: 'confirmed' },
    { id: 2, service: 'Basic Wash', date: '2026-07-18 14:00', amount: 800, status: 'completed' },
    { id: 3, service: 'Deluxe Package', date: '2026-07-25 09:00', amount: 2800, status: 'pending' },
  ]);

  // User's payments (mock)
  const [payments, setPayments] = useState([
    { id: 1, booking: 'Premium Wash', amount: 1500, method: 'MPesa', status: 'completed', date: '2026-07-20' },
    { id: 2, booking: 'Basic Wash', amount: 800, method: 'Cash', status: 'completed', date: '2026-07-18' },
  ]);

  // ---------- BOOKING FORM STATE ----------
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({ serviceId: '', date: '', time: '' });

  // ---------- STATS ----------
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  // ---------- HANDLERS ----------
  const handleCancelBooking = (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    toast.success('Booking cancelled');
  };

  const handleBookService = (e) => {
    e.preventDefault();
    const { serviceId, date, time } = newBooking;
    if (!serviceId || !date || !time) {
      toast.error('Please fill all fields');
      return;
    }
    const service = services.find(s => s.id === parseInt(serviceId));
    if (!service) return;
    const newBookingObj = {
      id: bookings.length + 1,
      service: service.name,
      date: `${date} ${time}`,
      amount: service.price,
      status: 'pending',
    };
    setBookings([...bookings, newBookingObj]);
    setNewBooking({ serviceId: '', date: '', time: '' });
    setShowBookingForm(false);
    toast.success('Booking created!');
  };

  const handlePayment = (bookingId) => {
    // Mock payment – just mark as completed and add payment record
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      toast.error('This booking cannot be paid');
      return;
    }
    // Add payment
    const newPayment = {
      id: payments.length + 1,
      booking: booking.service,
      amount: booking.amount,
      method: 'MPesa',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
    };
    setPayments([...payments, newPayment]);
    // Update booking status
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b));
    toast.success('Payment successful!');
  };

  // ---------- TAB RENDERING ----------
  const renderOverview = () => (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Customer'}!</h1>
        <p className="text-gray-600">Manage your bookings and appointments</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{upcomingBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-purple-600">Kshs {totalSpent}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg mb-2">Quick Action</h3>
        <button
          onClick={() => setShowBookingForm(!showBookingForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showBookingForm ? 'Cancel' : 'Book a Service'}
        </button>
        {showBookingForm && (
          <form onSubmit={handleBookService} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <select
                value={newBooking.serviceId}
                onChange={(e) => setNewBooking({ ...newBooking, serviceId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              >
                <option value="">Select a service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Kshs {s.price})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={newBooking.time}
                onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Submit Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => {
              const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800',
                confirmed: 'bg-blue-100 text-blue-800',
                completed: 'bg-green-100 text-green-800',
                cancelled: 'bg-red-100 text-red-800',
              };
              return (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.service}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">Kshs {b.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => handlePayment(b.id)}
                          className="text-green-600 hover:bg-green-50 p-1 rounded"
                          title="Pay now"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">My Payments</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Booking</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.booking}</td>
                <td className="p-3">Kshs {p.amount}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {p.status}
                  </span>
                </td>
                <td className="p-3">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---------- TABS ----------
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'bookings', label: 'My Bookings', icon: Clock },
    { id: 'payments', label: 'My Payments', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
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
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'payments' && renderPayments()}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;