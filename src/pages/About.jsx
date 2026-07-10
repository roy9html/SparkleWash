import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div>
      <Navbar/>
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About SparkeSplash</h1>
        <div className="prose prose-lg">
          <p>
           Welcome to SparkleSplash, where expert car care meets unmatched service quality.
We’ve proudly supported our community with commitment and skill, ensuring every vehicle leaves our workshop in peak condition.
          </p>
          <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
          <p>
            To provide exceptional car care services that exceed our customers' expectations,
            using eco-friendly products and cutting-edge techniques.
          </p>
          <h2 className="text-2xl font-semibold mt-8">Why Choose Us?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Professional and experienced team</li>
            <li>State-of-the-art equipment</li>
            <li>Eco-friendly products</li>
            <li>Competitive pricing</li>
            <li>100% satisfaction guarantee</li>
          </ul>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
