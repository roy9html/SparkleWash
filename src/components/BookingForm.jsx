import React, { useState } from 'react';
import { toast } from 'sonner';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    vehicle: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Booking created successfully!');
      setFormData({ service: '', date: '', time: '', vehicle: '', notes: '' });
    } catch (error) {
      toast.error('Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Book a Service</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a service</option>
              <option value="car-wash">Car Wash</option>
              <option value="detailing">Detailing</option>
              <option value="oil-change">Oil Change</option>
              <option value="tire-service">Tire Service</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Vehicle</label>
            <input
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Toyota Camry 2020"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any special requests..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
