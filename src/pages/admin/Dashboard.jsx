import React from 'react';
import DashboardCard from '../../components/DashboardCard';
import BookingTable from '../../components/BookingTable';
import { Users, Calendar, CreditCard, Star } from 'lucide-react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";


const AdminDashboard = () => {
  const stats = [
    { title: 'Total Customers', value: '350', icon: <Users size={24} />, color: 'blue' },
    { title: 'Bookings Today', value: '45', icon: <Calendar size={24} />, color: 'green' },
    { title: 'Revenue', value: 'Kshs 40,000', icon: <CreditCard size={24} />, color: 'purple' },
    { title: 'Rating', value: '4.6', icon: <Star size={24} />, color: 'orange' },
  ];

  return (
    <div className="p-6">
      < Navbar/>
      <h1 className="text-3xl font-bold mb-6">Dashboard,</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>
      <div className="space-y-6 mb-10">
        <BookingTable />
      </div>
      <Footer/>
    </div>
  );
};

export default AdminDashboard;