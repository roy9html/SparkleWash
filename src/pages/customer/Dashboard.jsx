import React from 'react';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../../components/BookingForm';
import BookingTable from '../../components/BookingTable';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back {user?.name || 'User'}!</h1>
        <p className="text-gray-600">Manage your bookings and appointments</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingForm />
        <div>
          <BookingTable />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
