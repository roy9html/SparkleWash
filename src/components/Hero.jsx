import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone } from 'lucide-react';

const Hero = () => {
  return (
    <section 
      className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Glassmorphism card */}
      <div className="relative z-10 max-w-3xl mx-4 p-8 md:p-12 rounded-2xl bg-gray-400/30 backdrop-blur-md shadow-[0_4px_6px_-1px_rgba(41,40,40,0.6)] border border-white/20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Welcome to <span className="text-blue-200">SparkeSplash</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8">
          Professional car care services that make your vehicle shine like new.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-lg"
          >
            <Car size={20} />
            Our Services
          </Link>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-lg backdrop-blur-sm border border-white/30 transition duration-200 shadow-lg"
          >
            <Phone size={20} />
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
