import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Calendar, Clock, CheckCircle, XCircle, CreditCard, X, Loader, Car } from 'lucide-react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import VehicleManager from '../../components/VehicleManager';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    serviceId: '',
    date: '',
    time: '',
    plate_number: '',
    make: '',
    model: '',
    year: '',
    color: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, bookingsRes, paymentsRes] = await Promise.all([
        api.get('/services'),
        api.get('/bookings'),
        api.get('/payments'),
      ]);
      setServices(servicesRes.data);
      setBookings(bookingsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pollPaymentStatus = (paymentId, bookingId, maxAttempts = 60) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const response = await api.get(`/payments/${paymentId}`);
        const payment = response.data;
        if (payment.status === 'completed') {
          clearInterval(interval);
          toast.success('Payment completed successfully!');
          fetchData();
          setIsPaying(false);
        } else if (payment.status === 'failed') {
          clearInterval(interval);
          toast.error('Payment failed. Please try again.');
          setIsPaying(false);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          toast.info('Payment is taking longer than expected. Please check your M-Pesa messages.');
          setIsPaying(false);
        }
      } catch (error) {
        // Continue polling
      }
    }, 2000);
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}`, { status: 'cancelled' });
      toast.success('Booking cancelled');
      fetchData();
    } catch (error) {
      toast.error('Cancellation failed');
    }
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    const { serviceId, date, time, plate_number, make, model, year, color } = newBooking;
    if (!serviceId || !date || !time || !plate_number || !make || !model) {
      toast.error('Please fill all required fields (service, date, time, plate, make, model)');
      return;
    }
    const bookingDate = new Date(`${date}T${time}`).toISOString();
    try {
      await api.post('/bookings', {
        service_id: parseInt(serviceId),
        booking_date: bookingDate,
        vehicle_plate_number: plate_number.trim().toUpperCase(),
        vehicle_make: make.trim(),
        vehicle_model: model.trim(),
        vehicle_year: parseInt(year) || null,
        vehicle_color: color.trim() || ''
      });
      toast.success('Booking created!');
      setNewBooking({ serviceId: '', date: '', time: '', plate_number: '', make: '', model: '', year: '', color: '' });
      setShowBookingForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const openPaymentModal = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    setSelectedBookingId(bookingId);
    setPhoneNumber('');
    const remaining = booking.total_amount - (booking.paid_amount || 0);
    setPaymentAmount(remaining.toFixed(2));
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBookingId(null);
    setPhoneNumber('');
    setPaymentAmount('');
    setIsPaying(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!booking) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }
    const remaining = booking.total_amount - (booking.paid_amount || 0);
    if (amount > remaining) {
      toast.error(`Amount cannot exceed remaining balance: Kshs ${remaining.toFixed(2)}`);
      return;
    }
    if (!phoneNumber.trim() || !/^[0-9]{10,12}$/.test(phoneNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number (e.g., 254712345678)');
      return;
    }
    setIsPaying(true);
    try {
      const response = await api.post('/payments', {
        booking_id: selectedBookingId,
        amount: amount,
        payment_method: 'mpesa',
        mpesa_phone: phoneNumber,
      });

      const paymentId = response.data.id;
      if (response.data.status === 'pending') {
        toast.info('STK push sent. Please check your phone and enter your PIN to complete payment.');
        closePaymentModal();
        pollPaymentStatus(paymentId, booking.id);
      } else {
        toast.success('Payment completed successfully!');
        closePaymentModal();
        fetchData();
        setIsPaying(false);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Payment failed. Please try again.';
      toast.error(errMsg);
      setIsPaying(false);
    }
  };

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
          <h3 className="font-semibold text-lg mb-3">Pending/Confirmed Bookings</h3>
          <div className="space-y-3">
            {upcomingBookings.map(b => {
              const remaining = b.total_amount - (b.paid_amount || 0);
              return (
                <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{b.service}</p>
                    <p className="text-sm text-gray-500">{new Date(b.booking_date).toLocaleString()} - Kshs {b.total_amount}</p>
                    <p className="text-xs text-gray-400">Paid: Kshs {b.paid_amount || 0} | Remaining: Kshs {remaining.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => openPaymentModal(b.id)}
                    disabled={isPaying || remaining <= 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center disabled:opacity-50"
                  >
                    {isPaying ? <Loader className="w-4 h-4 mr-1 animate-spin" /> : <CreditCard className="w-4 h-4 mr-1" />}
                    {isPaying ? 'Processing...' : remaining <= 0 ? 'Fully Paid' : 'Pay Now'}
                  </button>
                </div>
              );
            })}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                <input
                  type="text"
                  value={newBooking.plate_number}
                  onChange={(e) => setNewBooking({ ...newBooking, plate_number: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., KAA 123A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Make</label>
                <input
                  type="text"
                  value={newBooking.make}
                  onChange={(e) => setNewBooking({ ...newBooking, make: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., Toyota"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={newBooking.model}
                  onChange={(e) => setNewBooking({ ...newBooking, model: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., Camry"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  value={newBooking.year}
                  onChange={(e) => setNewBooking({ ...newBooking, year: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="text"
                  value={newBooking.color}
                  onChange={(e) => setNewBooking({ ...newBooking, color: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="e.g., Silver"
                />
              </div>
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
              <th className="p-3 text-left">Paid</th>
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
              const remaining = b.total_amount - (b.paid_amount || 0);
              return (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.service}</td>
                  <td className="p-3">{new Date(b.booking_date).toLocaleString()}</td>
                  <td className="p-3">Kshs {b.total_amount}</td>
                  <td className="p-3">Kshs {b.paid_amount || 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {b.status !== 'cancelled' && b.status !== 'completed' && remaining > 0 && (
                      <button
                        onClick={() => openPaymentModal(b.id)}
                        disabled={isPaying}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs transition flex items-center mx-auto disabled:opacity-50"
                      >
                        {isPaying ? <Loader className="w-3 h-3 mr-1 animate-spin" /> : <CreditCard className="w-3 h-3 mr-1" />}
                        {isPaying ? 'Processing' : 'Pay'}
                      </button>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && remaining <= 0 && (
                      <span className="text-green-600 text-xs font-medium">Fully Paid</span>
                    )}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded"
                        title="Cancel"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    {b.status === 'completed' && <span className="text-green-600 text-xs font-medium">Paid</span>}
                    {b.status === 'cancelled' && <span className="text-red-600 text-xs font-medium">Cancelled</span>}
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
                <td className="p-3">{p.payment_method}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {p.status}
                  </span>
                </td>
                <td className="p-3">{new Date(p.payment_date).toLocaleDateString()}</td>
                <td className="p-3">{p.mpesa_phone || 'Not provided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">My Vehicles</h2>
      <VehicleManager />
    </div>
  );

  const renderPaymentModal = () => {
    if (!showPaymentModal) return null;
    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!booking) return null;
    const remaining = booking.total_amount - (booking.paid_amount || 0);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Pay with M-Pesa</h3>
            <button onClick={closePaymentModal} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Service: <span className="font-semibold">{booking.service}</span></p>
            <p className="text-sm text-gray-600">Total: <span className="font-semibold">Kshs {booking.total_amount}</span></p>
            <p className="text-sm text-gray-600">Paid: <span className="font-semibold">Kshs {booking.paid_amount || 0}</span></p>
            <p className="text-sm text-gray-600">Remaining: <span className="font-semibold text-blue-600">Kshs {remaining.toFixed(2)}</span></p>
          </div>
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay (Kshs)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={remaining}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Max: Kshs {remaining.toFixed(2)}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
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
              <button type="button" onClick={closePaymentModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button
                type="submit"
                disabled={isPaying}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center"
              >
                {isPaying ? <Loader className="w-4 h-4 mr-1 animate-spin" /> : null}
                {isPaying ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'bookings', label: 'My Bookings', icon: Clock },
    { id: 'payments', label: 'My Payments', icon: CheckCircle },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
  ];

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
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
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'vehicles' && renderVehicles()}
      </div>
      <Footer />
      {renderPaymentModal()}
    </div>
  );
};

export default CustomerDashboard;