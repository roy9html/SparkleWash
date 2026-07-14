import React from 'react';

const CustomerTable = () => {
  const customers = [
    { id: 1, name: 'John Kamau', email: 'john@gmail.com', phone: '0790287332', bookings: 5 },
    { id: 2, name: 'Daniel Muthui', email: 'daniel@gmail.com', phone: '0721234567', bookings: 3 },
    { id: 3, name: 'Martin Nyaga', email: 'nyaga@gmail.com', phone: '0111723354', bookings: 7 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bookings</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">#{customer.id}</td>
                <td className="px-4 py-2">{customer.name}</td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">{customer.phone}</td>
                <td className="px-4 py-2">{customer.bookings}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
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

export default CustomerTable;
