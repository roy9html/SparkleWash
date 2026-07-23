import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Calendar, Clock, CheckCircle, XCircle, Plus, Trash2, Eye, CreditCard, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // ---------- MOCK DATA ----------
  const services = [
    { id: 1, name: 'Basic Wash', price: 800, duration: 30 },
    { id: 2, name: 'Premium Wash', price: 1500, duration: 45 },
    { id: 3, name: 'Deluxe Package', price: 2800, duration: 60 },
    { id: 4, name: 'Interior Detailing', price: 3200, duration: 90 },
  ];

  const [bookings, setBookings] = useState([
    { id: 1, service: 'Premium Wash', date: '2026-07-20 10:30', amount: 1500, status: 'confirmed' },
    { id: 2, service: 'Basic Wash', date: '2026-07-18 14:00', amount: 800, status: 'completed' },
    { id: 3, service: 'Deluxe Package', date: '2026-07-25 09:00', amount: 2800, status: 'pending' },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, booking: 'Premium Wash', amount: 1500, method: 'MPesa', status: 'completed', date: '2026-07-20' },
    { id: 2, booking: 'Basic Wash', amount: 800, method: 'Cash', status: 'completed', date: '2026-07-18' },
  ]);

  // ---------- PAYMENT MODAL STATE ----------
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // ---------- BOOKING FORM STATE ----------
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({ serviceId: '', date: '', time: '' });

  // ---------- STATS ----------
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
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

  // ---------- PAYMENT HANDLERS ----------
  const openPaymentModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setPhoneNumber('');
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBookingId(null);
    setPhoneNumber('');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!booking) return;

    // Validate phone number (basic)
    if (!phoneNumber.trim() || !/^[0-9]{10,12}$/.test(phoneNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number (e.g., 254712345678)');
      return;
    }

    // Simulate payment processing (will be replaced with Daraja API)
    const newPayment = {
      id: payments.length + 1,
      booking: booking.service,
      amount: booking.amount,
      method: 'MPesa',
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      phone: phoneNumber,
    };
    setPayments([...payments, newPayment]);
    setBookings(bookings.map(b => b.id === selectedBookingId ? { ...b, status: 'completed' } : b));
    toast.success(`Payment of Kshs ${booking.amount} received from ${phoneNumber}`);
    closePaymentModal();
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
          <p className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedBookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-purple-600">Kshs {totalSpent}</p>
        </div>
      </div>

      {upcomingBookings.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-semibold text-lg mb-3">Pending/Confirmed Bookings – Pay Now</h3>
          <div className="space-y-3">
            {upcomingBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{b.service}</p>
                  <p className="text-sm text-gray-500">{b.date} • Kshs {b.amount}</p>
                </div>
                <button
                  onClick={() => openPaymentModal(b.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                >
                  <CreditCard className="w-4 h-4 mr-1" />
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
                          onClick={() => openPaymentModal(b.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs transition flex items-center mx-auto"
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Pay
                        </button>
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                          title="Cancel"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {b.status === 'completed' && (
                      <span className="text-green-600 text-xs font-medium">Paid</span>
                    )}
                    {b.status === 'cancelled' && (
                      <span className="text-red-600 text-xs font-medium">Cancelled</span>
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
              <th className="p-3 text-left">Phone</th>
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
                <td className="p-3">{p.phone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---------- PAYMENT MODAL ----------
  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!booking) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Pay with M‑Pesa</h3>
            <button onClick={closePaymentModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Service: <span className="font-semibold">{booking.service}</span></p>
            <p className="text-sm text-gray-600">Amount: <span className="font-semibold">Kshs {booking.amount}</span></p>
          </div>
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">M‑Pesa Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="254712345678"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: 254XXXXXXXXX (no spaces)</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closePaymentModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
      {renderPaymentModal()}
    </div>
  );
};

export default CustomerDashboard;