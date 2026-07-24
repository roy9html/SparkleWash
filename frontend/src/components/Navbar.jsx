import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, Logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-300/90 rounded-2xl shadow-xl mx-4 my-1 border border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
            <Droplets size={28} className="text-blue-500" />
            <span>SparkeSplash</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Services
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center">
                  <User size={18} className="mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 transition font-medium"
                >
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-500 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition font-medium shadow-md hover:shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 transition"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/services" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={toggleMenu}>
              Services
            </Link>
            <Link to="/about" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={toggleMenu}>
              Contact
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2 flex items-center" onClick={toggleMenu}>
                  <User size={18} className="mr-2" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }} 
                  className="block w-full text-left text-red-500 hover:text-red-700 transition font-medium py-2 flex items-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 transition font-medium py-2" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/register" className="block bg-blue-500 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition font-medium text-center shadow-md" onClick={toggleMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;