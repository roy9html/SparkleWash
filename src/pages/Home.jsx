import React from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const services = [
    { id: 1, title: 'Car Wash', description: 'Professional car washing service' },
    { id: 2, title: 'Detailing', description: 'Complete interior and exterior detailing' },
    { id: 3, title: 'Oil Change', description: 'Quick and reliable oil change' },
    { id: 4, title: 'Tire Service', description: 'Tire rotation and replacement' },
  ];

  return (
    <div>
      <Navbar />
      <Hero />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(service => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
