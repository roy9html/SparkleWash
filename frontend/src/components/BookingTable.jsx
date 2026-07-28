import React from 'react';

const BookingTable = ({ bookings = [], onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Add Bookings
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
            {bookings.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4 text-gray-500">No bookings found</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">#{booking.id}</td>
                  <td className="px-4 py-2">{booking.customer}</td>
                  <td className="px-4 py-2">{booking.service}</td>
                  <td className="px-4 py-2">{new Date(booking.booking_date).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {onEdit && (
                      <button onClick={() => onEdit(booking)} className="text-blue-500 hover:text-blue-700 mr-2">
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(booking.id)} className="text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;