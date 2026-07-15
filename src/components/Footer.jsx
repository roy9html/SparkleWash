import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto px-0.7 pb-0.7">
      <div className="container mx-auto bg-gray-900 text-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-3 py-3 md:px-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SparkeSplash</h3>
              <p className="text-gray-400">Professional car care services for your vehicle.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white transition">Services</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Car Wash</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Detailing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Oil Change</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tire Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>info@sparkesplash.com</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin size={16} className="mt-1" />
                  <span>123 Main Street, City, State 12345</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SparkeSplash. All rights reserveds.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
