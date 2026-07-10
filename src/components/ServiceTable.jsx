import React, { useState } from 'react';

const ServiceTable = () => {
  const [services, setServices] = useState([
    { id: 1, name: 'Car Wash', price: 'Kshs 1000', duration: '30 min', category: 'Cleaning' },
    { id: 2, name: 'Detailing', price: 'Kshs 2500', duration: '2 hours', category: 'Cleaning' },
    { id: 3, name: 'Oil Change', price: 'Kshs 1500', duration: '45 min', category: 'Maintenance' },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Services</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Add Service
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Duration</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">#{service.id}</td>
                <td className="px-4 py-2">{service.name}</td>
                <td className="px-4 py-2">{service.price}</td>
                <td className="px-4 py-2">{service.duration}</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {service.category}
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

export default ServiceTable;
