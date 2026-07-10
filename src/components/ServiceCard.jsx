import React from 'react';
import { Car, Sparkles, Wrench, RotateCcw, Shield, Settings } from 'lucide-react';

const iconMap = {
  'Car Wash': Car,
  'Detailing': Sparkles,
  'Oil Change': Wrench,
  'Tire Service': RotateCcw,
  'Brake Service': Shield,
  'Engine Service': Settings,
};

const ServiceCard = ({ title, description, icon }) => {
  const IconComponent = iconMap[title] || Car;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
      <div className="flex justify-center mb-4">
        <IconComponent size={48} className="text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition text-sm">
        Book Now
      </button>
    </div>
  );
};

export default ServiceCard;
