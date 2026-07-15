import React from 'react';
import ServiceCard from '../components/ServiceCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const Services = () => {
  const services = [
    { id: 1, title: 'Car Wash', description: 'Professional car washing service' },
    { id: 2, title: 'Detailing', description: 'Complete interior and exterior detailing' },
    { id: 3, title: 'Oil Change', description: 'Quick and reliable oil change' },
    { id: 4, title: 'Tire Service', description: 'Tire rotation and replacement' },
    { id: 5, title: 'Brake Service', description: 'Brake inspection and repair' },
    { id: 6, title: 'Engine Serviced', description: 'Engine diagnostics and repair' },
  ];

  return (
    <div>
      <Navbar />
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default Services;
