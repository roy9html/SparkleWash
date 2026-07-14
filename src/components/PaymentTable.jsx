import React from 'react';

const PaymentTable = () => {
  const payments = [
    { id: 1, customer: 'John Kamau', amount: 'Kshs 1500', date: '2024-01-15', status: 'Completed' },
    { id: 2, customer: 'Daniel Muthui', amount: 'Kshs 1000', date: '2024-01-14', status: 'Pending' },
    { id: 3, customer: 'Martin Nyaga', amount: 'kshs 3000', date: '2024-01-13', status: 'Failed' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Payments here</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">#{payment.id}</td>
                <td className="px-4 py-2">{payment.customer}</td>
                <td className="px-4 py-2">{payment.amount}</td>
                <td className="px-4 py-2">{payment.date}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
