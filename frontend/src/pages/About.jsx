import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, Target } from "lucide-react";

const About = () => {
  const features = [
    "Experienced and highly trained professionals",
    "Premium cleaning products",
    "State-of-the-art equipment",
    "Eco-friendly washing techniques",
    "Fast and reliable service",
    "Affordable pricing",
    "Friendly customer support",
    "100% customer satisfaction guaranteed",
  ];

  return (
    <div>
      <Navbar />

      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Section */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">SparkleSplash</span>
            </h1>

            <p className="text-gray-700 text-lg leading-8 mb-8">
              Welcome to <strong>SparkleSplash</strong>, your trusted destination
              for premium car care services. We are committed to providing
              exceptional vehicle cleaning, detailing, and maintenance solutions
              that keep every car looking its absolute best.
            </p>

            <p className="text-gray-700 text-lg leading-8 mb-10">
              Our experienced team combines professional expertise with modern
              equipment and high-quality products to deliver outstanding
              results. Whether you need a quick wash or complete detailing, we
              ensure your vehicle leaves spotless, protected, and ready for the
              road.
            </p>

            {/* Mission Card */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <Target className="text-blue-600 mr-3" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">
                  Our Mission
                </h2>
              </div>

              <p className="text-gray-700 leading-7">
                To provide reliable, affordable, and eco-friendly car care
                services that exceed customer expectations through innovation,
                quality workmanship, and exceptional customer service.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Why Choose Us?
            </h2>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle
                    className="text-green-500 mt-1 mr-3 flex-shrink-0"
                    size={22}
                  />
                  <p className="text-gray-700 text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;