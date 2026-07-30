import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Car } from 'lucide-react';

const VehicleManager = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    plate_number: '',
    make: '',
    model: '',
    year: '',
    color: '',
    is_default: false,
  });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year) || null,
      };
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
        toast.success('Vehicle updated');
      } else {
        await api.post('/vehicles', payload);
        toast.success('Vehicle added');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ plate_number: '', make: '', model: '', year: '', color: '', is_default: false });
      fetchVehicles();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const startEdit = (vehicle) => {
    setEditingId(vehicle.id);
    setFormData({
      plate_number: vehicle.plate_number,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year || '',
      color: vehicle.color || '',
      is_default: vehicle.is_default || false,
    });
    setShowForm(true);
  };

  if (loading) return <div>Loading vehicles...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Vehicles</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ plate_number: '', make: '', model: '', year: '', color: '', is_default: false });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Vehicle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="plate_number"
              placeholder="Plate Number"
              value={formData.plate_number}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              name="make"
              placeholder="Make (e.g., Toyota)"
              value={formData.make}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              name="model"
              placeholder="Model (e.g., Camry)"
              value={formData.model}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              name="color"
              placeholder="Color"
              value={formData.color}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_default"
                checked={formData.is_default}
                onChange={handleChange}
              />
              <span>Default vehicle</span>
            </label>
          </div>
          <div className="mt-4 flex space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles added.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Plate</th>
                <th className="p-3 text-left">Make</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-left">Color</th>
                <th className="p-3 text-left">Default</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{v.plate_number}</td>
                  <td className="p-3">{v.make}</td>
                  <td className="p-3">{v.model}</td>
                  <td className="p-3">{v.year}</td>
                  <td className="p-3">{v.color}</td>
                  <td className="p-3">{v.is_default ? 'Yes' : 'No'}</td>
                  <td className="p-3 text-center space-x-2">
                    <button onClick={() => startEdit(v)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehicleManager;