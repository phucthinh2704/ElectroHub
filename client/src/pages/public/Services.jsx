import React from 'react';
import { Shield, Truck, Headphones, Wrench, Zap, Award, ArrowRight, CheckCircle } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Delivery",
      description: "Fast and reliable delivery to your doorstep within 24-48 hours for all orders above $50.",
      features: ["Same-day delivery available", "Real-time tracking", "Secure packaging"],
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Extended Warranty",
      description: "Comprehensive warranty coverage for all electronics with up to 3 years protection.",
      features: ["Accident protection", "Free replacements", "24/7 claim support"],
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Tech Support",
      description: "Expert technical assistance and troubleshooting for all your electronic devices.",
      features: ["Remote assistance", "On-site repairs", "Setup & installation"],
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Customer Care",
      description: "Round-the-clock customer support to assist you with any queries or concerns.",
      features: ["Live chat support", "Phone assistance", "Email support"],
      color: "from-orange-400 to-red-400"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Device Setup",
      description: "Professional installation and setup services for complex electronic equipment.",
      features: ["Home installation", "Data transfer", "Configuration"],
      color: "from-yellow-400 to-orange-400"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Care",
      description: "Exclusive membership program with special discounts and priority services.",
      features: ["Priority support", "Exclusive deals", "Early access"],
      color: "from-indigo-400 to-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Services</span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Experience premium electronics shopping with our comprehensive range of services designed to make your journey seamless and enjoyable.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Electro Hub Digital</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional service and support for all your electronics needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" 
                   style={{background: `linear-gradient(135deg, ${service.color.split(' ')[1]}, ${service.color.split(' ')[3]})`}}>
              </div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:border-white/80 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 group/btn">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience Premium Service?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Electro Hub Digital for their electronics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200">
                View Products
              </button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div> 
    </div>
  );
};

export default Services;