import React, { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/xykrydgo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to send message.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-3">
                <Phone className="text-blue-500 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+254740063099</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-3">
                <Mail className="text-blue-500 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@sparkesplash.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-start space-x-3">
                <MapPin className="text-blue-500 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">NGONG LANE, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition duration-300"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;