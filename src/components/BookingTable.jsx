import React from 'react';

const BookingTable = () => {
  const bookings = [
    { id: 1, customer: 'John Kamau', service: 'Car Wash', date: '2024-01-15', status: 'Confirmed' },
    { id: 2, customer: 'Daniel Muthui', service: 'Detailing', date: '2024-01-16', status: 'Pending' },
    { id: 3, customer: 'Martin Nyaga', service: 'Oil Change', date: '2024-01-17', status: 'Completed' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Add Booking
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Service</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">#{booking.id}</td>
                <td className="px-4 py-2">{booking.customer}</td>
                <td className="px-4 py-2">{booking.service}</td>
                <td className="px-4 py-2">{booking.date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
