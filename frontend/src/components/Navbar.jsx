import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< Updated upstream
import { User, LogOut, Menu,Bubbles } from 'lucide-react';
=======
import { User, LogOut, Menu, Bubbles } from 'lucide-react';
>>>>>>> Stashed changes

const Navbar = () => {
  const { user, Logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    Logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-400 shadow-[0_4px_6px_1px_rgba(41,40,40,0.6)] rounded-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
          <Bubbles size={28} className="text-blue-600" />
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
          
            SparkeSplash
            <Bubbles size={28} className="text-blue-600" />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition">Services</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition flex items-center">
                  <User size={20} className="mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-700 transition"
                >
                  <LogOut size={20} className="mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                  Register
                </Link>
              </div>
            )}
          </div>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 transition py-2">Home</Link>
            <Link to="/services" className="block text-gray-700 hover:text-blue-600 transition py-2">Services</Link>
            <Link to="/about" className="block text-gray-700 hover:text-blue-600 transition py-2">About</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-blue-600 transition py-2">Contact</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 transition py-2">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left text-red-500 hover:text-red-700 transition py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 transition py-2">Login</Link>
                <Link to="/register" className="block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-center">
                  Registers
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
