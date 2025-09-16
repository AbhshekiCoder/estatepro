// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { FiHome, FiSearch, FiUser, FiHeart, FiMail, FiLogIn, FiLogOut, FiMenu, FiX, FiSettings, FiCamera, FiGrid, FiList, FiPlus, FiEdit, FiTrash2, FiDollarSign, FiMapPin, FiClock, FiPhone, FiStar, FiCheck, FiArrowRight, FiChevronDown} from 'react-icons/fi';
import { FaChartLine, FaUsers, FaBuilding, FaBed, FaBath, FaRulerCombined, FaCalendarAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

// Main App Component
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const toggleAdminPanel = () => setIsAdminPanel(!isAdminPanel);

  return (
    <Router>
      <div className="min-h-screen bg-amber-50">
        {/* Navigation */}
        <Navbar 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          isLoggedIn={isLoggedIn} 
          toggleLogin={toggleLogin}
          toggleAdminPanel={toggleAdminPanel}
        />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin" element={<AdminPanel toggleAdminPanel={toggleAdminPanel} />} />
          </Routes>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

// Navbar Component
const Navbar = ({ isMenuOpen, setIsMenuOpen, isLoggedIn, toggleLogin, toggleAdminPanel }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${scrolled ? 'bg-amber-900 shadow-xl' : 'bg-amber-900/95 backdrop-blur-sm'} text-amber-50 sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <FaBuilding className="text-amber-400 text-2xl" />
            <span className="font-bold text-xl">EliteEstates</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<FiHome />} text="Home" />
            <NavLink to="/properties" icon={<FiSearch />} text="Properties" />
            <NavLink to="/agents" icon={<FiUser />} text="Agents" />
            <NavLink to="/services" icon={<FiHeart />} text="Services" />
            <NavLink to="/blog" icon={<FiMail />} text="Blog" />
            <NavLink to="/about" icon={<FiUser />} text="About" />
            <NavLink to="/contact" icon={<FiMail />} text="Contact" />
            
            {isLoggedIn && (
              <button 
                onClick={toggleAdminPanel}
                className="flex items-center space-x-1 text-amber-300 hover:text-amber-50 transition-all hover:bg-amber-700 px-3 py-2 rounded-lg"
              >
                <FiSettings />
                <span>Admin</span>
              </button>
            )}
            
            <button 
              onClick={toggleLogin}
              className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-amber-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-amber-800/95 backdrop-blur-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" icon={<FiHome />} text="Home" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/properties" icon={<FiSearch />} text="Properties" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/agents" icon={<FiUser />} text="Agents" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/services" icon={<FiHeart />} text="Services" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/blog" icon={<FiMail />} text="Blog" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/about" icon={<FiUser />} text="About" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/contact" icon={<FiMail />} text="Contact" setIsMenuOpen={setIsMenuOpen} />
            
            {isLoggedIn && (
              <button 
                onClick={() => {
                  toggleAdminPanel();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-amber-300 py-2 px-4 bg-amber-700/50 rounded-lg"
              >
                <FiSettings />
                <span>Admin Panel</span>
              </button>
            )}
            
            <button 
              onClick={() => {
                toggleLogin();
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                isLoggedIn ? 'bg-amber-700 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-500'
              }`}
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

// NavLink Component
const NavLink = ({ to, icon, text }) => (
  <motion.div whileHover={{ y: -2 }}>
    <Link 
      to={to} 
      className="flex items-center space-x-1 text-amber-100 hover:text-amber-50 transition-all py-2 px-3 rounded-lg hover:bg-amber-700/30"
    >
      {icon}
      <span>{text}</span>
    </Link>
  </motion.div>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, icon, text, setIsMenuOpen }) => (
  <motion.div whileTap={{ scale: 0.95 }}>
    <Link 
      to={to} 
      onClick={() => setIsMenuOpen(false)}
      className="flex items-center space-x-2 text-amber-100 py-3 px-4 rounded-lg hover:bg-amber-700/30 transition-all"
    >
      {icon}
      <span>{text}</span>
    </Link>
  </motion.div>
);

// Home Page Component
const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState([]);
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      setFeaturedProperties([
        {
          id: 1,
          title: "Luxury Waterfront Villa",
          price: 1250000,
          address: "123 Coastal Drive, Malibu, CA",
          bedrooms: 5,
          bathrooms: 4.5,
          sqft: 4200,
          year: 2021,
          type: "villa",
          featured: true,
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          id: 2,
          title: "Modern Downtown Penthouse",
          price: 895000,
          address: "456 Skyline Avenue, New York, NY",
          bedrooms: 3,
          bathrooms: 3.5,
          sqft: 2850,
          year: 2022,
          type: "penthouse",
          featured: true,
          image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
          id: 3,
          title: "Historic Townhouse Restoration",
          price: 750000,
          address: "789 Heritage Lane, Boston, MA",
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 3200,
          year: 1920,
          type: "townhouse",
          featured: true,
          image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
      ]);

      setTestimonials([
        {
          id: 1,
          name: "Michael & Sarah Johnson",
          role: "Home Buyers",
          content: "EliteEstates made our dream of owning a home a reality. Their agents were patient, knowledgeable, and always available to answer our questions. We couldn't be happier with our new home!",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          rating: 5
        },
        {
          id: 2,
          name: "Robert Chen",
          role: "Property Investor",
          content: "As a real estate investor, I've worked with many agencies. EliteEstates stands out for their market expertise and negotiation skills. They've helped me build a profitable portfolio.",
          avatar: "https://randomuser.me/api/portraits/men/22.jpg",
          rating: 5
        },
        {
          id: 3,
          name: "Jennifer Williams",
          role: "First-time Seller",
          content: "Selling my family home was emotional, but my EliteEstates agent handled everything with care and professionalism. We got 15% over asking price and closed in just 3 weeks!",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
          rating: 5
        }
      ]);

      setStats([
        { value: "2,500+", label: "Happy Clients" },
        { value: "$4.2B", label: "Property Sales" },
        { value: "18", label: "Years Experience" },
        { value: "98%", label: "Client Satisfaction" }
      ]);
    }, 500);
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center mb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-700/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-amber-50 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            Find Your Dream <span className="text-amber-400">Home</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Discover luxury properties tailored to your lifestyle with our premium real estate services
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/properties" 
              className="bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              Explore Properties
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-amber-400 hover:bg-amber-400/20 text-amber-50 font-bold py-4 px-8 rounded-full transition-all text-lg"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FiChevronDown size={32} className="text-amber-50" />
        </div>
      </section>
      
      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-16 -mt-20 relative z-20 mx-4"
      >
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Find Your Perfect Property</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-amber-800 font-medium mb-2">Location</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter city, neighborhood, or address"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 pl-10"
              />
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-amber-800 font-medium mb-2">Property Type</label>
            <select className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50">
              <option>All Types</option>
              <option>House</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
          </div>
          
          <div>
            <label className="block text-amber-800 font-medium mb-2">Price Range</label>
            <select className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50">
              <option>Any Price</option>
              <option>Under $300,000</option>
              <option>$300,000 - $500,000</option>
              <option>$500,000 - $750,000</option>
              <option>Over $750,000</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-amber-50 py-3 rounded-lg transition-all font-semibold">
              <FiSearch className="inline mr-2" />
              Search
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Featured Properties */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-amber-900 mb-4"
          >
            Featured <span className="text-amber-600">Properties</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-amber-700 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium properties that offer exceptional value and luxurious living
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/properties" 
            className="inline-flex items-center text-amber-700 hover:text-amber-900 font-semibold group"
          >
            View All Properties
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="bg-amber-900 text-amber-50 py-16 mb-16 rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-amber-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-amber-900 mb-4"
          >
            Our <span className="text-amber-600">Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-amber-700 max-w-2xl mx-auto"
          >
            Comprehensive real estate solutions tailored to meet your unique needs and aspirations
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<FiHome size={48} className="text-amber-600" />}
            title="Property Buying"
            description="We guide you through the entire home buying process, from search to closing, ensuring you find the perfect property at the best price."
          />
          <ServiceCard 
            icon={<FiDollarSign size={48} className="text-amber-600" />}
            title="Property Selling"
            description="Maximize your property's value with our strategic marketing, pricing expertise, and negotiation skills for a successful sale."
          />
          <ServiceCard 
            icon={<FiSettings size={48} className="text-amber-600" />}
            title="Property Management"
            description="Comprehensive management services for rental properties, handling everything from tenant screening to maintenance and financial reporting."
          />
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/services" 
            className="inline-flex items-center text-amber-700 hover:text-amber-900 font-semibold group"
          >
            Explore All Services
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-amber-900 mb-4"
          >
            What Our <span className="text-amber-600">Clients Say</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-amber-700 max-w-2xl mx-auto"
          >
            Hear from our satisfied clients who have experienced our exceptional service and expertise
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-10 md:p-16 text-amber-50 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Find Your Dream Home?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 text-amber-100"
          >
            Connect with our expert agents today and let us help you navigate your real estate journey with confidence
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/contact" 
              className="bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              Get Started Today
            </Link>
            <Link 
              to="/agents" 
              className="bg-transparent border-2 border-amber-50 hover:bg-amber-50/20 text-amber-50 font-bold py-4 px-8 rounded-full transition-all text-lg"
            >
              Meet Our Agents
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-amber-500 text-amber-900 font-bold py-2 px-4 rounded-full shadow-md">
          ${property.price.toLocaleString()}
        </div>
        {property.featured && (
          <div className="absolute top-4 left-4 bg-amber-900 text-amber-50 text-xs font-bold py-1 px-3 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">{property.title}</h3>
        <div className="flex items-center text-amber-600 mb-4">
          <FiMapPin className="mr-2" />
          <span className="text-sm">{property.address}</span>
        </div>
        
        <div className="flex justify-between text-amber-600 mb-6">
          <div className="flex items-center">
            <FaBed className="mr-2" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-2" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-2" />
            <span>{property.sqft.toLocaleString()} sq.ft.</span>
          </div>
        </div>
        
        <Link 
          to={`/property/${property.id}`}
          className="block w-full bg-amber-700 hover:bg-amber-600 text-amber-50 text-center py-3 rounded-lg transition-all group-hover:shadow-lg"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ 
      y: -10,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}
    className="bg-white p-8 rounded-2xl shadow-md text-center group"
  >
    <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-amber-900 mb-4 group-hover:text-amber-700 transition-colors">{title}</h3>
    <p className="text-amber-700">{description}</p>
  </motion.div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-2xl shadow-md p-6"
  >
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <FiStar key={i} className="text-amber-400 fill-current" />
      ))}
    </div>
    
    <p className="text-amber-700 mb-6 italic">"{testimonial.content}"</p>
    
    <div className="flex items-center">
      <img 
        src={testimonial.avatar} 
        alt={testimonial.name}
        className="w-12 h-12 rounded-full mr-4 object-cover"
      />
      <div>
        <div className="font-bold text-amber-900">{testimonial.name}</div>
        <div className="text-amber-600 text-sm">{testimonial.role}</div>
      </div>
    </div>
  </motion.div>
);

// Properties Page Component
const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    bedrooms: '',
    propertyType: '',
    minSqft: '',
    maxSqft: '',
    yearBuilt: ''
  });
  const [sortOption, setSortOption] = useState('default');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          title: "Luxury Waterfront Villa",
          price: 1250000,
          address: "123 Coastal Drive, Malibu, CA",
          bedrooms: 5,
          bathrooms: 4.5,
          sqft: 4200,
          year: 2021,
          type: "villa",
          featured: true,
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
        },
        {
          id: 2,
          title: "Modern Downtown Penthouse",
          price: 895000,
          address: "456 Skyline Avenue, New York, NY",
          bedrooms: 3,
          bathrooms: 3.5,
          sqft: 2850,
          year: 2022,
          type: "penthouse",
          featured: true,
          image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg"
        },
        {
          id: 3,
          title: "Historic Townhouse Restoration",
          price: 750000,
          address: "789 Heritage Lane, Boston, MA",
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 3200,
          year: 1920,
          type: "townhouse",
          featured: true,
          image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
        },
        {
          id: 4,
          title: "Suburban Family Home",
          price: 650000,
          address: "101 Maple Street, Austin, TX",
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2800,
          year: 2015,
          type: "house",
          featured: false,
          image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
        },
        {
          id: 5,
          title: "Urban Loft Apartment",
          price: 525000,
          address: "202 Loft Avenue, Chicago, IL",
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1800,
          year: 2019,
          type: "apartment",
          featured: false,
          image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
        },
        {
          id: 6,
          title: "Mountain Retreat Cabin",
          price: 450000,
          address: "303 Pine Trail, Denver, CO",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 2100,
          year: 2010,
          type: "cabin",
          featured: false,
          image: "https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg"
        },
        {
          id: 7,
          title: "Beachfront Condo",
          price: 720000,
          address: "404 Ocean Drive, Miami, FL",
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1650,
          year: 2018,
          type: "condo",
          featured: false,
          image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"
        },
        {
          id: 8,
          title: "Country Estate",
          price: 1850000,
          address: "505 Country Lane, Nashville, TN",
          bedrooms: 6,
          bathrooms: 5.5,
          sqft: 5500,
          year: 2017,
          type: "estate",
          featured: true,
          image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
        }
      ];
      
      setProperties(mockProperties);
      setLoading(false);
    }, 800);
  }, []);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const filteredProperties = properties.filter(property => {
    return (
      (filters.location === '' || property.address.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.price === '' || 
        (filters.price === 'low' && property.price < 500000) ||
        (filters.price === 'medium' && property.price >= 500000 && property.price < 1000000) ||
        (filters.price === 'high' && property.price >= 1000000)
      ) &&
      (filters.bedrooms === '' || 
        (filters.bedrooms === '1' && property.bedrooms === 1) ||
        (filters.bedrooms === '2' && property.bedrooms === 2) ||
        (filters.bedrooms === '3' && property.bedrooms === 3) ||
        (filters.bedrooms === '4' && property.bedrooms >= 4)
      ) &&
      (filters.propertyType === '' || property.type === filters.propertyType) &&
      (filters.minSqft === '' || property.sqft >= parseInt(filters.minSqft)) &&
      (filters.maxSqft === '' || property.sqft <= parseInt(filters.maxSqft)) &&
      (filters.yearBuilt === '' || property.year >= parseInt(filters.yearBuilt))
    );
  });
  
  // Apply sorting
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'newest':
        return b.year - a.year;
      case 'oldest':
        return a.year - b.year;
      case 'largest':
        return b.sqft - a.sqft;
      case 'smallest':
        return a.sqft - b.sqft;
      default:
        return 0;
    }
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Property Listings</h1>
        <p className="text-amber-700">Discover our curated collection of exceptional properties</p>
      </div>
      
      {/* Filters and Sorting */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full md:w-1/2">
            <label className="block text-amber-800 font-medium mb-2">Search Location</label>
            <div className="relative">
              <input 
                type="text" 
                name="location"
                placeholder="City, neighborhood or address"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 pl-10"
                value={filters.location}
                onChange={handleFilterChange}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-amber-800 font-medium mb-2">Sort By</label>
            <select 
              className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="largest">Largest First</option>
              <option value="smallest">Smallest First</option>
            </select>
          </div>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="mt-6">
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-amber-700 hover:text-amber-900 flex items-center"
          >
            <span className="mr-2">{showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            {showAdvancedFilters ? <FiX size={18} /> : <FiSettings size={18} />}
          </button>
        </div>
        
        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6"
          >
            <div>
              <label className="block text-amber-800 font-medium mb-2">Property Type</label>
              <select 
                name="propertyType"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="cabin">Cabin</option>
                <option value="estate">Estate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-amber-800 font-medium mb-2">Price Range</label>
              <select 
                name="price"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                value={filters.price}
                onChange={handleFilterChange}
              >
                <option value="">Any Price</option>
                <option value="low">Under $500,000</option>
                <option value="medium">$500,000 - $1,000,000</option>
                <option value="high">Over $1,000,000</option>
              </select>
            </div>
            
            <div>
              <label className="block text-amber-800 font-medium mb-2">Bedrooms</label>
              <select 
                name="bedrooms"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                value={filters.bedrooms}
                onChange={handleFilterChange}
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-amber-800 font-medium mb-2">Year Built</label>
              <input 
                type="number" 
                name="yearBuilt"
                placeholder="Min year"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                value={filters.yearBuilt}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-amber-800 font-medium mb-2">Min Sq. Ft.</label>
              <input 
                type="number" 
                name="minSqft"
                placeholder="Min size"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                value={filters.minSqft}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-amber-800 font-medium mb-2">Max Sq. Ft.</label>
              <input 
                type="number" 
                name="maxSqft"
                placeholder="Max size"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                value={filters.maxSqft}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="md:col-span-2 flex items-end">
              <button 
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-lg transition"
                onClick={() => setFilters({ 
                  location: '', 
                  price: '', 
                  bedrooms: '', 
                  propertyType: '',
                  minSqft: '',
                  maxSqft: '',
                  yearBuilt: ''
                })}
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-amber-700">
          <span className="font-semibold">{sortedProperties.length}</span> properties found
        </div>
        <div className="flex items-center">
          <span className="text-amber-700 mr-2">View:</span>
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-lg mr-2 ${viewMode === 'grid' ? 'bg-amber-600 text-amber-50' : 'bg-amber-100 text-amber-700'}`}
          >
            <FiGrid size={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-600 text-amber-50' : 'bg-amber-100 text-amber-700'}`}
          >
            <FiList size={20} />
          </button>
        </div>
      </div>
      
      {/* Property Listings */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProperties.length > 0 ? (
            sortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="bg-amber-100 p-6 rounded-2xl inline-block mb-6">
                <FiSearch size={48} className="text-amber-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">No properties match your criteria</h3>
              <p className="text-amber-700 mb-6">Try adjusting your filters to see more properties</p>
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-6 rounded-lg transition"
                onClick={() => setFilters({ 
                  location: '', 
                  price: '', 
                  bedrooms: '', 
                  propertyType: '',
                  minSqft: '',
                  maxSqft: '',
                  yearBuilt: ''
                })}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedProperties.length > 0 ? (
            sortedProperties.map((property) => (
              <PropertyListCard key={property.id} property={property} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="bg-amber-100 p-6 rounded-2xl inline-block mb-6">
                <FiSearch size={48} className="text-amber-600 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4">No properties match your criteria</h3>
              <p className="text-amber-700 mb-6">Try adjusting your filters to see more properties</p>
              <button 
                className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-6 rounded-lg transition"
                onClick={() => setFilters({ 
                  location: '', 
                  price: '', 
                  bedrooms: '', 
                  propertyType: '',
                  minSqft: '',
                  maxSqft: '',
                  yearBuilt: ''
                })}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {sortedProperties.length > 0 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            <IoIosArrowBack />
          </button>
          {[1, 2, 3, 4, 5].map(page => (
            <button 
              key={page}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                page === 1 
                  ? 'bg-amber-700 text-amber-50' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </div>
  );
};

// Property List Card Component (for list view)
const PropertyListCard = ({ property }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row group"
    >
      <div className="md:w-1/3 relative overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {property.featured && (
          <div className="absolute top-4 left-4 bg-amber-900 text-amber-50 text-xs font-bold py-1 px-3 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6 md:w-2/3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-2 group-hover:text-amber-700 transition-colors">{property.title}</h3>
            <div className="flex items-center text-amber-600 mb-2">
              <FiMapPin className="mr-2" />
              <span className="text-sm">{property.address}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2 md:mt-0">${property.price.toLocaleString()}</div>
        </div>
        
        <div className="flex justify-between text-amber-600 mb-6">
          <div className="flex items-center">
            <FaBed className="mr-2" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-2" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-2" />
            <span>{property.sqft.toLocaleString()} sq.ft.</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>Built {property.year}</span>
          </div>
        </div>
        
        <p className="text-amber-700 mb-6 line-clamp-2">
          Beautiful property with modern amenities and spacious rooms. Perfect for families looking for comfort and luxury.
        </p>
        
        <div className="flex justify-between items-center">
          <div className="text-amber-600 text-sm">
            <span className="font-semibold">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
          </div>
          <Link 
            to={`/property/${property.id}`}
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 py-2 px-6 rounded-lg transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Property Details Component
const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          title: "Luxury Waterfront Villa",
          price: 1250000,
          address: "123 Coastal Drive, Malibu, CA 90210",
          bedrooms: 5,
          bathrooms: 4.5,
          sqft: 4200,
          year: 2021,
          type: "villa",
          description: "This stunning modern waterfront villa offers the ultimate in luxury coastal living. Situated on a private beachfront parcel with panoramic ocean views, this architectural masterpiece was designed by renowned architect James Harrison and completed in 2021. The property features an open floor plan with floor-to-ceiling windows that flood the space with natural light and provide breathtaking views from nearly every room.",
          fullDescription: `The gourmet kitchen is a chef's dream, featuring top-of-the-line Wolf and Sub-Zero appliances, custom Italian cabinetry, quartzite countertops, and a spacious island perfect for entertaining. The great room opens to an expansive terrace with an infinity pool, outdoor kitchen, and multiple seating areas perfect for enjoying the spectacular sunsets.

The primary suite is a private sanctuary with a sitting area, private balcony, walk-in closet with custom organizers, and a spa-like bathroom with a freestanding soaking tub, dual vanities, and a spacious rain shower. Three additional en-suite bedrooms provide comfortable accommodations for family and guests.

Additional features include a state-of-the-art home theater, wine cellar, fitness center, and a separate guest house with a full kitchen and living area. The property is equipped with smart home technology, including automated lighting, climate control, and security systems.

The professionally landscaped grounds feature mature palm trees, native drought-resistant plants, and multiple entertainment areas. The private beach access makes this property truly one-of-a-kind.`,
          features: ['Waterfront', 'Infinity Pool', 'Home Theater', 'Wine Cellar', 'Smart Home', 'Gourmet Kitchen', 'Guest House', 'Beach Access', 'Ocean Views', 'Outdoor Kitchen', 'Home Gym', 'Security System'],
          amenities: ['Swimming Pool', 'Garage', 'Garden', 'Security System', 'Hardwood Floors', 'Central AC', 'Fireplace', 'Smart Home', 'Home Theater', 'Wine Cellar', 'Gym', 'Balcony'],
          images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg",
            "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
            "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
            "https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg"
          ],
          agent: {
            name: "Sarah Johnson",
            title: "Senior Real Estate Agent",
            phone: "+1 (555) 123-4567",
            email: "sarah@eliteestates.com",
            bio: "With over 10 years of experience in luxury real estate, Sarah specializes in waterfront properties and has helped numerous clients find their dream homes. Her extensive market knowledge and dedication to client satisfaction have made her one of the top agents in the region.",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            properties: 42,
            experience: 10
          },
          location: {
            lat: 34.025922,
            lng: -118.779757,
            nearby: ['Malibu Beach (0.2 mi)', 'Malibu Pier (1.5 mi)', 'Shopping Center (2 mi)', 'Schools (3 mi)', 'Hospital (5 mi)']
          },
          taxes: 12500,
          hoa: 450,
          yearRenovated: 2021
        },
        {
          id: 2,
          title: "Modern Downtown Penthouse",
          price: 895000,
          address: "456 Skyline Avenue, New York, NY 10001",
          bedrooms: 3,
          bathrooms: 3.5,
          sqft: 2850,
          year: 2022,
          type: "penthouse",
          description: "Experience urban luxury in this stunning penthouse with panoramic city views. Located in the heart of Manhattan, this contemporary residence offers the perfect blend of sophisticated design and modern convenience.",
          fullDescription: `This exquisite penthouse occupies the entire top floor of the prestigious Skyline Tower, offering breathtaking 360-degree views of the city skyline. The residence features an open-concept living area with 12-foot ceilings and floor-to-ceiling windows that flood the space with natural light.

The chef's kitchen is equipped with top-of-the-line Miele appliances, custom Italian cabinetry, and a large marble island that seats six. The living area opens to a spacious terrace, perfect for entertaining or enjoying morning coffee with spectacular city views.

The primary bedroom suite features a private terrace, walk-in closet with custom organizers, and a luxurious bathroom with a freestanding soaking tub, dual vanities, and a rain shower. Two additional bedrooms each have en-suite bathrooms and generous closet space.

Building amenities include a 24-hour concierge, fitness center, spa, rooftop pool, private dining room, and conference facilities. The penthouse includes two parking spaces in the underground garage.`,
          features: ['City Views', 'Private Terrace', 'High Ceilings', 'Smart Home', 'Gourmet Kitchen', 'Concierge', 'Rooftop Pool', 'Parking'],
          amenities: ['Concierge', 'Gym', 'Pool', 'Security', 'Hardwood Floors', 'Central AC', 'Fireplace', 'Smart Home', 'Balcony', 'Parking'],
          images: [
            "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
            "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
            "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg",
            "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg",
            "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg",
            "https://images.pexels.com/photos/1457846/pexels-photo-1457846.jpeg"
          ],
          agent: {
            name: "Michael Anderson",
            title: "Luxury Property Specialist",
            phone: "+1 (555) 987-6543",
            email: "michael@eliteestates.com",
            bio: "Michael specializes in luxury urban properties and has been helping clients navigate the competitive Manhattan real estate market for over 8 years. His expertise and negotiation skills have resulted in numerous successful transactions for his clients.",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            properties: 37,
            experience: 8
          },
          location: {
            lat: 40.753182,
            lng: -73.982253,
            nearby: ['Central Park (0.5 mi)', 'Times Square (1 mi)', 'Shopping (0.3 mi)', 'Restaurants (0.2 mi)', 'Subway (0.1 mi)']
          },
          taxes: 9800,
          hoa: 1200,
          yearRenovated: 2022
        },
        {
          id: 3,
          title: "Historic Townhouse Restoration",
          price: 750000,
          address: "789 Heritage Lane, Boston, MA 02108",
          bedrooms: 4,
          bathrooms: 2.5,
          sqft: 3200,
          year: 1920,
          type: "townhouse",
          description: "This beautifully restored historic townhouse combines classic architecture with modern amenities. Located in the heart of Boston's historic district, this property offers character and convenience in equal measure.",
          fullDescription: `This meticulously restored 1920s townhouse retains its original historic charm while incorporating all the modern amenities desired for contemporary living. The property features original hardwood floors, detailed moldings, and three working fireplaces.

The gourmet kitchen has been completely updated with high-end appliances, custom cabinetry, and marble countertops while maintaining the character of the home. The formal dining room features original wainscoting and a beautiful chandelier.

The second floor includes the primary bedroom with an en-suite bathroom and two additional bedrooms. The third floor features a flexible space that can be used as a fourth bedroom, home office, or media room. The finished basement provides additional living space and includes a half bathroom.

The private backyard is a tranquil oasis in the city, featuring a patio area, professional landscaping, and a water feature. The property includes a detached garage with additional storage space.`,
          features: ['Historic Home', 'Original Details', 'Modern Kitchen', 'Private Garden', 'Garage', 'Fireplaces', 'Hardwood Floors', 'Updated Systems'],
          amenities: ['Garden', 'Garage', 'Fireplace', 'Hardwood Floors', 'Central AC', 'Updated Plumbing', 'Updated Electrical', 'Storage'],
          images: [
            "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
            "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
            "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
            "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
            "https://images.pexels.com/photos/1643386/pexels-photo-1643386.jpeg",
            "https://images.pexels.com/photos/1457848/pexels-photo-1457848.jpeg"
          ],
          agent: {
            name: "David Chen",
            title: "Historic Properties Expert",
            phone: "+1 (555) 456-7890",
            email: "david@eliteestates.com",
            bio: "David specializes in historic properties and has extensive knowledge of Boston's historic districts and preservation guidelines. His attention to detail and passion for historic architecture have made him the go-to agent for clients seeking character homes.",
            image: "https://randomuser.me/api/portraits/men/22.jpg",
            properties: 28,
            experience: 6
          },
          location: {
            lat: 42.358894,
            lng: -71.056742,
            nearby: ['Boston Common (0.3 mi)', 'Freedom Trail (0.2 mi)', 'Restaurants (0.1 mi)', 'Public Transportation (0.2 mi)', 'Schools (0.5 mi)']
          },
          taxes: 6800,
          hoa: 0,
          yearRenovated: 2019
        }
      ];
      
      const foundProperty = mockProperties.find(p => p.id === parseInt(id));
      setProperty(foundProperty);
      setLoading(false);
    }, 600);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">Property not found</h2>
        <Link to="/properties" className="text-amber-700 hover:text-amber-900 font-semibold">
          Browse all properties
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <Link to="/properties" className="text-amber-700 hover:text-amber-900 flex items-center group">
          <IoIosArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Properties
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Property Images */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
            <img 
              src={property.images[currentImageIndex]} 
              alt={property.title}
              className="w-full h-full object-cover transition duration-500"
            />
            <div className="absolute bottom-4 right-4 bg-amber-900 bg-opacity-70 text-amber-50 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {property.images.length}
            </div>
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-amber-900/70 text-amber-50 w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setCurrentImageIndex((currentImageIndex - 1 + property.images.length) % property.images.length)}
            >
              <IoIosArrowBack />
            </button>
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-amber-900/70 text-amber-50 w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() => setCurrentImageIndex((currentImageIndex + 1) % property.images.length)}
            >
              <IoIosArrowForward />
            </button>
          </div>
          
          <div className="grid grid-cols-6 gap-4 mb-8">
            {property.images.map((img, index) => (
              <div 
                key={index} 
                className={`rounded-xl overflow-hidden h-20 cursor-pointer transition-all duration-300 ${
                  currentImageIndex === index 
                    ? 'ring-4 ring-amber-500 transform scale-105' 
                    : 'ring-1 ring-gray-200'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img 
                  src={img} 
                  alt={`Property view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Property Header */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-amber-700 mb-2">
                  <FiMapPin className="mr-2" />
                  <span>{property.address}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-amber-700">${property.price.toLocaleString()}</div>
            </div>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="text-center">
                <div className="text-amber-900 font-bold text-xl">{property.bedrooms}</div>
                <div className="text-amber-700">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-amber-900 font-bold text-xl">{property.bathrooms}</div>
                <div className="text-amber-700">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="text-amber-900 font-bold text-xl">{property.sqft.toLocaleString()}</div>
                <div className="text-amber-700">Sq. Ft.</div>
              </div>
              <div className="text-center">
                <div className="text-amber-900 font-bold text-xl">{property.year}</div>
                <div className="text-amber-700">Built</div>
              </div>
              <div className="text-center">
                <div className="text-amber-900 font-bold text-xl">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</div>
                <div className="text-amber-700">Type</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 px-6 rounded-lg font-semibold transition-all">
                Schedule a Tour
              </button>
              <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 px-6 rounded-lg font-semibold transition-all">
                <FiHeart className="inline mr-2" />
                Save Property
              </button>
              <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 px-6 rounded-lg font-semibold transition-all">
                <FiMail className="inline mr-2" />
                Share
              </button>
            </div>
          </div>
          
          {/* Property Tabs */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div className="border-b border-amber-200 mb-6">
              <div className="flex flex-wrap gap-6">
                <button 
                  className={`pb-3 font-semibold ${activeTab === 'details' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-amber-600'}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button 
                  className={`pb-3 font-semibold ${activeTab === 'features' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-amber-600'}`}
                  onClick={() => setActiveTab('features')}
                >
                  Features
                </button>
                <button 
                  className={`pb-3 font-semibold ${activeTab === 'location' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-amber-600'}`}
                  onClick={() => setActiveTab('location')}
                >
                  Location
                </button>
                <button 
                  className={`pb-3 font-semibold ${activeTab === 'contact' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-amber-600'}`}
                  onClick={() => setActiveTab('contact')}
                >
                  Contact
                </button>
              </div>
            </div>
            
            {activeTab === 'details' && (
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">Property Description</h2>
                <p className="text-amber-700 mb-6">
                  {property.description}
                </p>
                <p className="text-amber-700 mb-6">
                  {property.fullDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-3">Property Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Property Type:</span>
                        <span className="text-amber-900 font-medium">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Year Built:</span>
                        <span className="text-amber-900 font-medium">{property.year}</span>
                      </div>
                      {property.yearRenovated && (
                        <div className="flex justify-between">
                          <span className="text-amber-700">Year Renovated:</span>
                          <span className="text-amber-900 font-medium">{property.yearRenovated}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-amber-700">Square Feet:</span>
                        <span className="text-amber-900 font-medium">{property.sqft.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Bedrooms:</span>
                        <span className="text-amber-900 font-medium">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Bathrooms:</span>
                        <span className="text-amber-900 font-medium">{property.bathrooms}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 mb-3">Financial Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Price:</span>
                        <span className="text-amber-900 font-medium">${property.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Property Taxes:</span>
                        <span className="text-amber-900 font-medium">${property.taxes.toLocaleString()}/year</span>
                      </div>
                      {property.hoa > 0 && (
                        <div className="flex justify-between">
                          <span className="text-amber-700">HOA Fees:</span>
                          <span className="text-amber-900 font-medium">${property.hoa}/month</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">Features & Amenities</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-amber-900 mb-3">Property Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <FiCheck className="text-amber-600 mr-2" />
                        <span className="text-amber-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-3">Community Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <FiCheck className="text-amber-600 mr-2" />
                        <span className="text-amber-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'location' && (
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">Location & Nearby</h2>
                
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 mb-6 flex items-center justify-center">
                  <div className="text-center text-amber-700">
                    <FiMapPin size={32} className="mx-auto mb-2" />
                    <p>Interactive Map</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-amber-900 mb-3">Nearby Places</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.location.nearby.map((place, index) => (
                    <div key={index} className="flex items-center">
                      <FiMapPin className="text-amber-600 mr-2" />
                      <span className="text-amber-700">{place}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'contact' && (
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">Contact Agent</h2>
                <p className="text-amber-700 mb-6">
                  Interested in this property? Contact our agent for more information or to schedule a viewing.
                </p>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-800 font-medium mb-2">Your Name</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-800 font-medium mb-2">Your Email</label>
                      <input 
                        type="email" 
                        className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-amber-800 font-medium mb-2">Your Phone</label>
                      <input 
                        type="tel" 
                        className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-800 font-medium mb-2">Best Time to Contact</label>
                      <select className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50">
                        <option>Any Time</option>
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-amber-800 font-medium mb-2">Message</label>
                    <textarea 
                      rows="4" 
                      className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                      placeholder="Tell us about your interest in this property..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 rounded-lg font-semibold transition-all"
                  >
                    Send Message to Agent
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Agent Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 sticky top-24">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Listing Agent</h2>
            <div className="flex items-center mb-4">
              <img 
                src={property.agent.image} 
                alt={property.agent.name}
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
              <div>
                <div className="font-bold text-amber-900">{property.agent.name}</div>
                <div className="text-amber-700 text-sm">{property.agent.title}</div>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="text-amber-400 fill-current" size={14} />
                  ))}
                  <span className="text-amber-600 text-sm ml-1">(42 reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-amber-700">
                <FiPhone className="mr-3" />
                <span>{property.agent.phone}</span>
              </div>
              <div className="flex items-center text-amber-700">
                <FiMail className="mr-3" />
                <span>{property.agent.email}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 rounded-lg transition-all font-semibold">
                <FiPhone className="inline mr-2" />
                Call Agent
              </button>
              <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-lg transition-all font-semibold">
                <FiMail className="inline mr-2" />
                Email Agent
              </button>
              <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-lg transition-all font-semibold">
                <FiUser className="inline mr-2" />
                View Profile
              </button>
            </div>
          </div>
          
          {/* Mortgage Calculator */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Mortgage Calculator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-amber-800 mb-2">Home Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600">$</span>
                  <input 
                    type="text" 
                    value={property.price.toLocaleString()}
                    className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 pl-8"
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-amber-800 mb-2">Down Payment</label>
                <select className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50">
                  <option>20% (${(property.price * 0.2).toLocaleString()})</option>
                  <option>15% (${(property.price * 0.15).toLocaleString()})</option>
                  <option>10% (${(property.price * 0.1).toLocaleString()})</option>
                  <option>5% (${(property.price * 0.05).toLocaleString()})</option>
                  <option>3% (${(property.price * 0.03).toLocaleString()})</option>
                </select>
              </div>
              
              <div>
                <label className="block text-amber-800 mb-2">Loan Term</label>
                <select className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50">
                  <option>30 years fixed</option>
                  <option>15 years fixed</option>
                  <option>10 years fixed</option>
                  <option>5/1 ARM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-amber-800 mb-2">Interest Rate</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value="5.75%"
                    className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600">%</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-amber-200">
                <div className="flex justify-between mb-2">
                  <span className="text-amber-800 font-semibold">Monthly Payment</span>
                  <span className="font-bold text-amber-900">$4,328</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600 mb-1">
                  <span>Principal & Interest</span>
                  <span>$3,892</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600 mb-1">
                  <span>Property Taxes</span>
                  <span>${Math.round(property.taxes / 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600 mb-1">
                  <span>Home Insurance</span>
                  <span>$125</span>
                </div>
                {property.hoa > 0 && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span>HOA Fees</span>
                    <span>${property.hoa}</span>
                  </div>
                )}
              </div>
              
              <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-3 rounded-lg transition-all font-semibold">
                Get Pre-Approved
              </button>
            </div>
          </div>
          
          {/* Virtual Tour */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Virtual Tour</h2>
            <div className="aspect-w-16 aspect-h-9 bg-amber-100 rounded-xl overflow-hidden">
              <div className="w-full h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-amber-600 mb-2">
                    <FiCamera size={48} className="mx-auto" />
                  </div>
                  <p className="text-amber-800 mb-3">Virtual tour available</p>
                  <button className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-6 rounded-lg transition-all">
                    Launch 3D Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page Component
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission to backend
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Contact Us</h1>
        <p className="text-amber-700 mb-6">We're here to help you with all your real estate needs</p>
        
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Message Sent Successfully!</h2>
            <p className="text-amber-700 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-6 rounded-lg transition-all"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-amber-800 font-medium mb-2">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-amber-800 font-medium mb-2">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-amber-800 font-medium mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-amber-800 font-medium mb-2">Subject *</label>
                <select 
                  name="subject"
                  className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="buying">Buying a Property</option>
                  <option value="selling">Selling a Property</option>
                  <option value="renting">Renting a Property</option>
                  <option value="investment">Investment Properties</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-amber-800 font-medium mb-2">Message *</label>
              <textarea 
                rows="5" 
                name="message"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
      
      {/* Contact Information */}
      <div>
        <h2 className="text-3xl font-bold text-amber-900 mb-6">Get In Touch</h2>
        <p className="text-amber-700 mb-8">
          Have questions about our properties or services? Our team of expert agents is ready to help 
          you find your dream home or answer any real estate questions you may have.
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start p-4 bg-amber-50 rounded-xl">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <FiMail className="text-amber-700" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Email Us</h3>
              <p className="text-amber-700">info@eliteestates.com</p>
              <p className="text-amber-700">support@eliteestates.com</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-amber-50 rounded-xl">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <FiHome className="text-amber-700" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Visit Us</h3>
              <p className="text-amber-700">123 Luxury Avenue</p>
              <p className="text-amber-700">Beverly Hills, CA 90210</p>
            </div>
          </div>
          
          <div className="flex items-start p-4 bg-amber-50 rounded-xl">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <FiPhone className="text-amber-700" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Call Us</h3>
              <p className="text-amber-700">+1 (555) 123-4567</p>
              <p className="text-amber-700">Mon-Fri, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-900 text-amber-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Office Hours</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span>10:00 AM - 4:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span>By Appointment</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64 flex items-center justify-center">
          <div className="text-center text-amber-700">
            <FiMapPin size={32} className="mx-auto mb-2" />
            <p>Interactive Map</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Page Component
const AboutPage = () => {
  const [team, setTeam] = useState([]);
  const [values, setValues] = useState([]);
  
  useEffect(() => {
    setTimeout(() => {
      setTeam([
        {
          id: 1,
          name: "Michael Anderson",
          role: "Founder & CEO",
          bio: "With over 20 years of experience in luxury real estate, Michael founded EliteEstates with a vision to create a premium real estate service that prioritizes client satisfaction above all else.",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          social: {
            facebook: "#",
            twitter: "#",
            linkedin: "#",
            instagram: "#"
          }
        },
        {
          id: 2,
          name: "Sarah Johnson",
          role: "Senior Real Estate Agent",
          bio: "Sarah specializes in luxury waterfront properties and has been recognized as one of the top agents in the region for the past 8 years.",
          image: "https://randomuser.me/api/portraits/women/44.jpg",
          social: {
            facebook: "#",
            twitter: "#",
            linkedin: "#",
            instagram: "#"
          }
        },
        {
          id: 3,
          name: "David Chen",
          role: "Property Management Director",
          bio: "David leads our property management division, bringing over 12 years of experience in managing luxury rental properties and investment portfolios.",
          image: "https://randomuser.me/api/portraits/men/22.jpg",
          social: {
            facebook: "#",
            twitter: "#",
            linkedin: "#",
            instagram: "#"
          }
        }
      ]);
      
      setValues([
        {
          id: 1,
          title: "Excellence",
          description: "We strive for excellence in every aspect of our service, from property presentation to client communication.",
          icon: <FiStar className="text-amber-600" size={28} />
        },
        {
          id: 2,
          title: "Integrity",
          description: "We conduct business with honesty and transparency, building trust with our clients through ethical practices.",
          icon: <FiHeart className="text-amber-600" size={28} />
        },
        {
          id: 3,
          title: "Innovation",
          description: "We embrace innovative technologies and strategies to provide our clients with the best possible service.",
          icon: <FiSettings className="text-amber-600" size={28} />
        }
      ]);
    }, 500);
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center mb-16 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-700/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-amber-50 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About EliteEstates</h1>
          <p className="text-xl max-w-3xl mx-auto">Your trusted partner in luxury real estate for over 18 years</p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Our Story</h2>
          <p className="text-amber-700 mb-4">
            Founded in 2005, EliteEstates began with a simple mission: to transform the luxury real estate experience 
            for discerning buyers and sellers. What started as a small team of passionate agents has grown into one of 
            the most respected luxury real estate agencies in the country.
          </p>
          <p className="text-amber-700 mb-4">
            Our founder, Michael Anderson, recognized the need for a more personalized approach to luxury real estate. 
            Frustrated with the impersonal nature of traditional agencies, he built EliteEstates on the principles 
            of integrity, expertise, and exceptional client service.
          </p>
          <p className="text-amber-700 mb-6">
            Today, we serve thousands of clients each year, helping them navigate the complexities of the luxury real 
            estate market with confidence and ease. Our team of expert agents brings decades of combined experience 
            and a deep understanding of local markets across the country.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-amber-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-900 mb-1">18+</div>
              <div className="text-amber-700">Years Experience</div>
            </div>
            <div className="bg-amber-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-900 mb-1">2,500+</div>
              <div className="text-amber-700">Happy Clients</div>
            </div>
            <div className="bg-amber-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-900 mb-1">$4.2B+</div>
              <div className="text-amber-700">Property Sales</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-96 flex items-center justify-center">
          <div className="text-center text-amber-700">
            <FiCamera size={48} className="mx-auto mb-2" />
            <p>Company Image</p>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="bg-amber-50 rounded-3xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-12 text-center">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <motion.div 
              key={value.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{value.title}</h3>
              <p className="text-amber-700">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Meet Our Leadership Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((person) => (
            <motion.div 
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden text-center"
            >
              <div className="bg-gray-200 border-2 border-dashed w-full h-64 flex items-center justify-center">
                <div className="text-amber-700">
                  <FiUser size={48} className="mx-auto mb-2" />
                  <p>Team Member Photo</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-900 mb-1">{person.name}</h3>
                <p className="text-amber-600 mb-4">{person.role}</p>
                <p className="text-amber-700 mb-6">{person.bio}</p>
                <div className="flex justify-center space-x-4">
                  <a href={person.social.facebook} className="text-amber-600 hover:text-amber-700">
                    <FaFacebookF />
                  </a>
                  <a href={person.social.twitter} className="text-amber-600 hover:text-amber-700">
                    <FaTwitter />
                  </a>
                  <a href={person.social.linkedin} className="text-amber-600 hover:text-amber-700">
                    <FaLinkedinIn />
                  </a>
                  <a href={person.social.instagram} className="text-amber-600 hover:text-amber-700">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/agents" 
            className="inline-flex items-center text-amber-700 hover:text-amber-900 font-semibold group"
          >
            View All Team Members
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      
      {/* Testimonials Preview */}
      <section className="bg-amber-900 text-amber-50 rounded-3xl p-12 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-amber-800/30 p-6 rounded-2xl">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="text-amber-400 fill-current" />
              ))}
            </div>
            <p className="italic mb-6">"EliteEstates made our dream of owning a waterfront property a reality. Their attention to detail and market knowledge exceeded our expectations."</p>
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full w-12 h-12 mr-4"></div>
              <div>
                <div className="font-bold">Robert Johnson</div>
                <div className="text-amber-200">Malibu, CA</div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-800/30 p-6 rounded-2xl">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="text-amber-400 fill-current" />
              ))}
            </div>
            <p className="italic mb-6">"The team at EliteEstates handled the sale of our family home with care and professionalism. We achieved a sale price 15% above market value."</p>
            <div className="flex items-center">
              <div className="bg-gray-300 rounded-full w-12 h-12 mr-4"></div>
              <div>
                <div className="font-bold">Sarah Williams</div>
                <div className="text-amber-200">New York, NY</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Link 
            to="/testimonials" 
            className="inline-flex items-center text-amber-300 hover:text-amber-50 font-semibold group"
          >
            Read More Testimonials
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-10 text-amber-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Work With Us?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Whether you're buying, selling, or investing, our team of experts is here to guide you every step of the way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/contact" 
            className="bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold py-3 px-8 rounded-full transition-all"
          >
            Contact Us Today
          </Link>
          <Link 
            to="/properties" 
            className="bg-transparent border-2 border-amber-50 hover:bg-amber-50/20 text-amber-50 font-bold py-3 px-8 rounded-full transition-all"
          >
            Browse Properties
          </Link>
        </div>
      </section>
    </div>
  );
};

// Agents Page Component
const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      const mockAgents = [
        {
          id: 1,
          name: "Sarah Johnson",
          title: "Senior Real Estate Agent",
          specialty: "Luxury Waterfront Properties",
          experience: 10,
          properties: 42,
          rating: 4.9,
          image: "https://randomuser.me/api/portraits/women/44.jpg",
          phone: "+1 (555) 123-4567",
          email: "sarah@eliteestates.com",
          bio: "Sarah specializes in luxury waterfront properties and has been recognized as one of the top agents in the region for the past 8 years. Her extensive market knowledge and dedication to client satisfaction have resulted in numerous successful transactions.",
          areas: ["Malibu", "Santa Monica", "Pacific Palisades", "Venice"]
        },
        {
          id: 2,
          name: "Michael Anderson",
          title: "Luxury Property Specialist",
          specialty: "Urban Luxury Properties",
          experience: 8,
          properties: 37,
          rating: 4.8,
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          phone: "+1 (555) 987-6543",
          email: "michael@eliteestates.com",
          bio: "Michael specializes in luxury urban properties and has been helping clients navigate the competitive Manhattan real estate market for over 8 years. His expertise and negotiation skills have resulted in numerous successful transactions for his clients.",
          areas: ["Manhattan", "Brooklyn", "Queens", "Jersey City"]
        },
        {
          id: 3,
          name: "David Chen",
          title: "Historic Properties Expert",
          specialty: "Character Homes & Renovations",
          experience: 6,
          properties: 28,
          rating: 4.9,
          image: "https://randomuser.me/api/portraits/men/22.jpg",
          phone: "+1 (555) 456-7890",
          email: "david@eliteestates.com",
          bio: "David specializes in historic properties and has extensive knowledge of Boston's historic districts and preservation guidelines. His attention to detail and passion for historic architecture have made him the go-to agent for clients seeking character homes.",
          areas: ["Boston", "Cambridge", "Brookline", "Newton"]
        },
        {
          id: 4,
          name: "Jennifer Lopez",
          title: "Investment Property Specialist",
          specialty: "Commercial & Investment Properties",
          experience: 12,
          properties: 53,
          rating: 4.7,
          image: "https://randomuser.me/api/portraits/women/65.jpg",
          phone: "+1 (555) 234-5678",
          email: "jennifer@eliteestates.com",
          bio: "Jennifer specializes in investment properties and has helped numerous clients build profitable real estate portfolios. Her analytical approach and market insights provide clients with valuable investment opportunities.",
          areas: ["Los Angeles", "Orange County", "San Diego", "Las Vegas"]
        },
        {
          id: 5,
          name: "Robert Kim",
          title: "First-Time Home Buyer Specialist",
          specialty: "Residential Properties",
          experience: 5,
          properties: 31,
          rating: 4.8,
          image: "https://randomuser.me/api/portraits/men/45.jpg",
          phone: "+1 (555) 345-6789",
          email: "robert@eliteestates.com",
          bio: "Robert specializes in helping first-time home buyers navigate the complex process of purchasing their first home. His patience and guidance have helped numerous clients achieve their dream of homeownership.",
          areas: ["Austin", "San Antonio", "Houston", "Dallas"]
        },
        {
          id: 6,
          name: "Emily Wilson",
          title: "Luxury Condo Specialist",
          specialty: "High-Rise & Luxury Condos",
          experience: 7,
          properties: 39,
          rating: 4.9,
          image: "https://randomuser.me/api/portraits/women/28.jpg",
          phone: "+1 (555) 876-5432",
          email: "emily@eliteestates.com",
          bio: "Emily specializes in luxury condominiums and has extensive knowledge of Chicago's high-rise market. Her expertise in condo regulations and building amenities helps clients make informed decisions.",
          areas: ["Chicago", "Evanston", "Oak Park", "Naperville"]
        }
      ];
      
      setAgents(mockAgents);
      setFilteredAgents(mockAgents);
    }, 500);
  }, []);
  
  const handleFilter = (specialty) => {
    setFilter(specialty);
    if (specialty === 'all') {
      setFilteredAgents(agents);
    } else {
      setFilteredAgents(agents.filter(agent => 
        agent.specialty.toLowerCase().includes(specialty.toLowerCase())
      ));
    }
  };
  
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Meet Our Agents</h1>
        <p className="text-amber-700 max-w-2xl mx-auto">
          Our team of experienced real estate professionals is dedicated to helping you achieve your property goals
        </p>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button 
          onClick={() => handleFilter('all')} 
          className={`px-4 py-2 rounded-full transition-all ${filter === 'all' ? 'bg-amber-600 text-amber-50' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
        >
          All Agents
        </button>
        <button 
          onClick={() => handleFilter('luxury')} 
          className={`px-4 py-2 rounded-full transition-all ${filter === 'luxury' ? 'bg-amber-600 text-amber-50' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
        >
          Luxury Specialists
        </button>
        <button 
          onClick={() => handleFilter('investment')} 
          className={`px-4 py-2 rounded-full transition-all ${filter === 'investment' ? 'bg-amber-600 text-amber-50' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
        >
          Investment Properties
        </button>
        <button 
          onClick={() => handleFilter('first-time')} 
          className={`px-4 py-2 rounded-full transition-all ${filter === 'first-time' ? 'bg-amber-600 text-amber-50' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
        >
          First-Time Buyers
        </button>
      </div>
      
      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
      
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-amber-100 p-6 rounded-2xl inline-block mb-6">
            <FiUser size={48} className="text-amber-600 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-4">No agents match your criteria</h3>
          <p className="text-amber-700">Try selecting a different specialty</p>
        </div>
      )}
      
      {/* CTA Section */}
      <div className="bg-amber-900 text-amber-50 rounded-3xl p-10 text-center mt-16">
        <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Are you an experienced real estate professional looking to join a premier agency?
        </p>
        <button className="bg-amber-600 hover:bg-amber-500 text-amber-50 font-bold py-3 px-8 rounded-full transition-all">
          View Career Opportunities
        </button>
      </div>
    </div>
  );
};

// Agent Card Component
const AgentCard = ({ agent }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-72 overflow-hidden">
        <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
          <div className="text-amber-700">
            <FiUser size={48} className="mx-auto mb-2" />
            <p>Agent Photo</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <div className="text-amber-50">
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-current" />
              ))}
            </div>
            <div className="text-sm">{agent.rating} Rating</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-1 group-hover:text-amber-700 transition-colors">{agent.name}</h3>
        <p className="text-amber-600 mb-3">{agent.title}</p>
        <p className="text-amber-700 mb-4 line-clamp-2">{agent.specialty}</p>
        
        <div className="flex justify-between text-amber-600 mb-6">
          <div className="text-center">
            <div className="font-bold text-amber-900">{agent.experience}+</div>
            <div className="text-sm">Years</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-amber-900">{agent.properties}</div>
            <div className="text-sm">Properties</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-amber-900">{agent.rating}</div>
            <div className="text-sm">Rating</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link 
            to={`/agent/${agent.id}`}
            className="flex-1 bg-amber-700 hover:bg-amber-600 text-amber-50 text-center py-2 rounded-lg transition-all"
          >
            View Profile
          </Link>
          <button className="w-12 h-12 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-all flex items-center justify-center">
            <FiHeart />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Services Page Component
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [process, setProcess] = useState([]);
  
  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          id: 1,
          title: "Property Buying",
          description: "We guide you through the entire home buying process, from search to closing, ensuring you find the perfect property at the best price.",
          icon: <FiHome className="text-amber-600" size={32} />,
          features: [
            "Personalized property search",
            "Market analysis and pricing guidance",
            "Property tours and evaluations",
            "Negotiation and offer management",
            "Closing coordination and support"
          ]
        },
        {
          id: 2,
          title: "Property Selling",
          description: "Maximize your property's value with our strategic marketing, pricing expertise, and negotiation skills for a successful sale.",
          icon: <FiDollarSign className="text-amber-600" size={32} />,
          features: [
            "Comprehensive market analysis",
            "Professional photography and staging",
            "Strategic marketing campaign",
            "Skilled negotiation representation",
            "Closing coordination and support"
          ]
        },
        {
          id: 3,
          title: "Property Management",
          description: "Comprehensive management services for rental properties, handling everything from tenant screening to maintenance and financial reporting.",
          icon: <FiSettings className="text-amber-600" size={32} />,
          features: [
            "Tenant screening and placement",
            "Rent collection and financial reporting",
            "Property maintenance and repairs",
            "Lease administration and compliance",
            "Regular property inspections"
          ]
        },
        {
          id: 4,
          title: "Real Estate Investment",
          description: "Build and manage a profitable real estate portfolio with our investment expertise and property management services.",
          icon: <FaChartLine className="text-amber-600" size={32} />,
          features: [
            "Investment property identification",
            "Market analysis and ROI projections",
            "Property acquisition assistance",
            "Portfolio management strategies",
            "Investment performance tracking"
          ]
        },
        {
          id: 5,
          title: "Luxury Home Marketing",
          description: "Specialized marketing services for luxury properties, including premium photography, video tours, and targeted outreach.",
          icon: <FiCamera className="text-amber-600" size={32} />,
          features: [
            "Professional photography and videography",
            "Custom property websites",
            "Luxury magazine features",
            "Targeted digital marketing",
            "Exclusive broker events"
          ]
        },
        {
          id: 6,
          title: "Relocation Services",
          description: "Comprehensive relocation assistance for individuals and families moving to new areas, including neighborhood guidance and school information.",
          icon: <FiMapPin className="text-amber-600" size={32} />,
          features: [
            "Neighborhood and community guidance",
            "School district information",
            "Local service recommendations",
            "Moving coordination assistance",
            "Settling-in support"
          ]
        }
      ]);
      
      setProcess([
        {
          id: 1,
          title: "Consultation",
          description: "We begin with a detailed consultation to understand your needs, preferences, and goals.",
          icon: "1"
        },
        {
          id: 2,
          title: "Planning",
          description: "We develop a customized strategy tailored to your specific real estate objectives.",
          icon: "2"
        },
        {
          id: 3,
          title: "Execution",
          description: "Our team implements the plan with precision, keeping you informed at every step.",
          icon: "3"
        },
        {
          id: 4,
          title: "Completion",
          description: "We ensure a smooth closing process and follow-up to guarantee your satisfaction.",
          icon: "4"
        }
      ]);
    }, 500);
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center mb-16 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-700/60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-amber-50 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">Comprehensive real estate solutions tailored to your unique needs</p>
        </div>
      </section>
      
      {/* Services Grid */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">How We Can Help You</h2>
          <p className="text-amber-700 max-w-2xl mx-auto">
            From buying your dream home to managing investment properties, we offer a full range of real estate services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceDetailCard key={service.id} service={service} />
          ))}
        </div>
      </section>
      
      {/* Process Section */}
      <section className="bg-amber-50 rounded-3xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-12 text-center">Our Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {process.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-amber-700">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{step.title}</h3>
              <p className="text-amber-700">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-10 text-amber-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Contact us today to discuss how we can help you with your real estate needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/contact" 
            className="bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold py-3 px-8 rounded-full transition-all"
          >
            Schedule a Consultation
          </Link>
          <Link 
            to="/agents" 
            className="bg-transparent border-2 border-amber-50 hover:bg-amber-50/20 text-amber-50 font-bold py-3 px-8 rounded-full transition-all"
          >
            Meet Our Team
          </Link>
        </div>
      </section>
    </div>
  );
};

// Service Detail Card Component
const ServiceDetailCard = ({ service }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all"
    >
      <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-amber-200 transition-colors">
        {service.icon}
      </div>
      <h3 className="text-xl font-bold text-amber-900 mb-4 group-hover:text-amber-700 transition-colors">{service.title}</h3>
      <p className="text-amber-700 mb-6">{service.description}</p>
      
      <ul className="space-y-2 mb-6">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-center text-amber-700">
            <FiCheck className="text-amber-600 mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className="text-amber-600 hover:text-amber-700 font-semibold flex items-center group">
        Learn More
        <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

// Blog Page Component
const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "2024 Real Estate Market Trends and Predictions",
          excerpt: "Discover the latest trends shaping the real estate market in 2024 and what buyers and sellers can expect in the coming year.",
          image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
          date: "January 15, 2024",
          author: "Michael Anderson",
          category: "Market Trends",
          readTime: "5 min read"
        },
        {
          id: 2,
          title: "10 Essential Tips for First-Time Home Buyers",
          excerpt: "Navigating the home buying process for the first time? Here are 10 essential tips to help you make informed decisions.",
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
          date: "December 8, 2023",
          author: "Sarah Johnson",
          category: "Home Buying",
          readTime: "7 min read"
        },
        {
          id: 3,
          title: "Maximizing Your Home's Value Before Selling",
          excerpt: "Learn how to prepare your home for sale and maximize its value with these strategic improvements and staging tips.",
          image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
          date: "November 22, 2023",
          author: "David Chen",
          category: "Home Selling",
          readTime: "6 min read"
        },
        {
          id: 4,
          title: "The Benefits of Investing in Rental Properties",
          excerpt: "Discover why rental properties remain a solid investment and how to build a profitable real estate portfolio.",
          image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
          date: "October 15, 2023",
          author: "Jennifer Lopez",
          category: "Investment",
          readTime: "8 min read"
        },
        {
          id: 5,
          title: "Luxury Home Features That Buyers Want in 2024",
          excerpt: "From smart home technology to outdoor living spaces, discover the luxury features that are trending in 2024.",
          image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
          date: "September 30, 2023",
          author: "Emily Wilson",
          category: "Luxury Homes",
          readTime: "5 min read"
        },
        {
          id: 6,
          title: "Understanding Mortgage Options for Your Home Purchase",
          excerpt: "A comprehensive guide to understanding different mortgage options and choosing the right one for your home purchase.",
          image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
          date: "August 18, 2023",
          author: "Robert Kim",
          category: "Financing",
          readTime: "9 min read"
        }
      ]);
      
      setCategories([
        { name: "Market Trends", count: 12 },
        { name: "Home Buying", count: 8 },
        { name: "Home Selling", count: 6 },
        { name: "Investment", count: 9 },
        { name: "Luxury Homes", count: 7 },
        { name: "Financing", count: 5 }
      ]);
    }, 500);
  }, []);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Real Estate Insights</h1>
          <p className="text-amber-700">Expert advice, market trends, and tips for buyers, sellers, and investors</p>
        </div>
        
        {/* Featured Post */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <img 
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" 
              alt="Featured Post"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent flex items-end p-8">
              <div className="text-amber-50">
                <span className="bg-amber-600 text-amber-50 text-sm font-bold py-1 px-3 rounded-full mb-4 inline-block">
                  Market Trends
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">2024 Real Estate Market Trends and Predictions</h2>
                <div className="flex items-center text-amber-100">
                  <span>January 15, 2024</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                  <span className="mx-2">•</span>
                  <span>By Michael Anderson</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.slice(1).map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-12 space-x-2">
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            <IoIosArrowBack />
          </button>
          <button className="w-10 h-10 rounded-full bg-amber-700 text-amber-50 flex items-center justify-center">
            1
          </button>
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            2
          </button>
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            3
          </button>
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      
      {/* Sidebar */}
      <div>
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Search Blog</h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search articles..."
              className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50 pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
          </div>
        </div>
        
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Categories</h3>
          <ul className="space-y-3">
            {categories.map((category, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-amber-700 hover:text-amber-900 cursor-pointer">{category.name}</span>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold py-1 px-2 rounded-full">{category.count}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Recent Posts */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-amber-900 mb-4">Recent Posts</h3>
          <ul className="space-y-4">
            {posts.slice(0, 3).map((post) => (
              <li key={post.id} className="flex items-start">
                <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1 line-clamp-2">{post.title}</h4>
                  <p className="text-amber-600 text-sm">{post.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Newsletter */}
        <div className="bg-amber-900 text-amber-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Subscribe to Newsletter</h3>
          <p className="text-amber-100 mb-4">Get the latest real estate insights delivered to your inbox</p>
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full p-3 rounded-lg bg-amber-800 text-amber-50 border border-amber-700"
            />
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-amber-50 py-3 rounded-lg font-semibold transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Blog Post Card Component
const BlogPostCard = ({ post }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
          <div className="text-amber-700">
            <FiCamera size={32} className="mx-auto mb-2" />
            <p>Blog Image</p>
          </div>
        </div>
        <div className="absolute top-4 left-4">
          <span className="bg-amber-600 text-amber-50 text-xs font-bold py-1 px-3 rounded-full">
            {post.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-amber-700 mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex justify-between items-center text-amber-600 text-sm mb-4">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gray-300 rounded-full w-8 h-8 mr-3"></div>
            <span className="text-amber-700 font-medium">{post.author}</span>
          </div>
          <button className="text-amber-600 hover:text-amber-700 font-semibold flex items-center group">
            Read More
            <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Admin Panel Component
const AdminPanel = ({ toggleAdminPanel }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          title: "Luxury Waterfront Villa",
          price: 1250000,
          status: "available",
          views: 124,
          inquiries: 8,
          date: "2024-01-15"
        },
        {
          id: 2,
          title: "Modern Downtown Penthouse",
          price: 895000,
          status: "pending",
          views: 89,
          inquiries: 5,
          date: "2024-01-10"
        },
        {
          id: 3,
          title: "Historic Townhouse Restoration",
          price: 750000,
          status: "sold",
          views: 210,
          inquiries: 12,
          date: "2024-01-05"
        },
        {
          id: 4,
          title: "Suburban Family Home",
          price: 650000,
          status: "available",
          views: 76,
          inquiries: 3,
          date: "2024-01-03"
        },
        {
          id: 5,
          title: "Urban Loft Apartment",
          price: 525000,
          status: "available",
          views: 92,
          inquiries: 6,
          date: "2023-12-28"
        }
      ]);
      
      setStats({
        totalProperties: 42,
        activeListings: 28,
        pendingProperties: 7,
        soldProperties: 7,
        totalViews: 5420,
        totalInquiries: 215,
        conversionRate: '4.2%'
      });
      
      setLoading(false);
    }, 800);
  }, []);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="border-b border-amber-200 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-900">Admin Dashboard</h1>
          <button 
            onClick={toggleAdminPanel}
            className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-4 rounded-lg transition-all"
          >
            Exit Admin
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Sidebar */}
        <div className="bg-amber-800 text-amber-50 p-6 md:col-span-1">
          <nav className="space-y-4">
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaChartLine />
              <span>Dashboard</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === 'properties' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('properties')}
            >
              <FaBuilding />
              <span>Properties</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === 'leads' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('leads')}
            >
              <FiUser />
              <span>Leads & Inquiries</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers />
              <span>Users</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all ${
                activeTab === 'settings' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings />
              <span>Settings</span>
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="p-6 md:col-span-3">
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{stats.totalProperties}</div>
                  <div className="text-amber-700">Total Properties</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{stats.activeListings}</div>
                  <div className="text-amber-700">Active Listings</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{stats.pendingProperties}</div>
                  <div className="text-amber-700">Pending</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{stats.soldProperties}</div>
                  <div className="text-amber-700">Sold Properties</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{stats.totalViews}</div>
                  <div className="text-amber-700">Total Property Views</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{stats.totalInquiries}</div>
                  <div className="text-amber-700">Total Inquiries</div>
                </div>
              </div>
              
              {/* Recent Activities */}
              <div className="bg-white border border-amber-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-amber-900 mb-4">Recent Activities</h2>
                
                <div className="space-y-4">
                  {[
                    { action: "New property added: Luxury Waterfront Villa", time: "2 hours ago", user: "Sarah Johnson" },
                    { action: "Property status updated: Modern Penthouse → Pending", time: "5 hours ago", user: "Michael Anderson" },
                    { action: "New user registration: Robert Smith", time: "1 day ago", user: "System" },
                    { action: "Property sold: Historic Townhouse Restoration", time: "2 days ago", user: "David Chen" },
                    { action: "New inquiry received for Suburban Family Home", time: "3 days ago", user: "System" }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between border-b border-amber-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <div className="text-amber-800">{activity.action}</div>
                        <div className="text-amber-600 text-sm">By {activity.user}</div>
                      </div>
                      <div className="text-amber-600 text-sm whitespace-nowrap">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'properties' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-amber-900">Property Management</h2>
                <button className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-4 rounded-lg transition-all flex items-center">
                  <FiPlus className="mr-2" />
                  Add New Property
                </button>
              </div>
              
              <div className="bg-white border border-amber-200 rounded-xl p-6 mb-8">
                <div className="flex flex-wrap gap-4 mb-6">
                  <button className="px-4 py-2 rounded-lg bg-amber-600 text-amber-50">All</button>
                  <button className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200">Available</button>
                  <button className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</button>
                  <button className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200">Sold</button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-amber-200">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Property</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Inquiries</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Date Added</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-200">
                      {properties.map((property) => (
                        <tr key={property.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-amber-900">{property.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-amber-900">${property.price.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              property.status === 'available' ? 'bg-green-100 text-green-800' :
                              property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{property.views}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{property.inquiries}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">{property.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-amber-600 hover:text-amber-900 mr-3">
                              <FiEdit />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'leads' && (
            <div className="bg-white border border-amber-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Leads & Inquiries</h2>
              <p className="text-amber-700">Lead management functionality will be implemented here.</p>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div className="bg-white border border-amber-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">User Management</h2>
              <p className="text-amber-700">User management functionality will be implemented here.</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white border border-amber-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">System Settings</h2>
              <p className="text-amber-700">System configuration options will be available here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-amber-900 text-amber-100 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaBuilding className="text-amber-400 text-2xl" />
              <span className="font-bold text-xl">EliteEstates</span>
            </div>
            <p className="text-amber-300 mb-4">
              Your trusted partner in luxury real estate for over 18 years. We specialize in helping clients buy, sell, and invest in premium properties.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-100 w-10 h-10 rounded-full flex items-center justify-center transition-all">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-100 w-10 h-10 rounded-full flex items-center justify-center transition-all">
                <FaTwitter />
              </a>
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-100 w-10 h-10 rounded-full flex items-center justify-center transition-all">
                <FaInstagram />
              </a>
              <a href="#" className="bg-amber-800 hover:bg-amber-700 text-amber-100 w-10 h-10 rounded-full flex items-center justify-center transition-all">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-amber-300 hover:text-amber-50 transition-all">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-amber-300 hover:text-amber-50 transition-all">Properties</Link>
              </li>
              <li>
                <Link to="/agents" className="text-amber-300 hover:text-amber-50 transition-all">Agents</Link>
              </li>
              <li>
                <Link to="/services" className="text-amber-300 hover:text-amber-50 transition-all">Services</Link>
              </li>
              <li>
                <Link to="/about" className="text-amber-300 hover:text-amber-50 transition-all">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-amber-300 hover:text-amber-50 transition-all">Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4 text-amber-300">
              <li className="flex items-start">
                <FiHome className="mr-3 mt-1 flex-shrink-0" />
                <span>123 Luxury Avenue, Beverly Hills, CA 90210</span>
              </li>
              <li className="flex items-start">
                <FiMail className="mr-3 mt-1 flex-shrink-0" />
                <span>info@eliteestates.com<br />support@eliteestates.com</span>
              </li>
              <li className="flex items-start">
                <FiPhone className="mr-3 mt-1 flex-shrink-0" />
                <span>+1 (555) 123-4567<br />+1 (555) 987-6543</span>
              </li>
              <li className="flex items-start">
                <FiClock className="mr-3 mt-1 flex-shrink-0" />
                <span>Mon-Fri: 9am-6pm<br />Sat: 10am-4pm</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-amber-300 mb-4">
              Subscribe to our newsletter for the latest property listings and market insights.
            </p>
            <div className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email address"
                className="bg-amber-800 text-amber-50 px-4 py-3 rounded-lg border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="bg-amber-600 hover:bg-amber-500 text-amber-50 py-3 rounded-lg font-semibold transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-amber-800 mt-12 pt-6 text-center text-amber-500">
          <p>&copy; {new Date().getFullYear()} EliteEstates. All rights reserved. | <a href="#" className="hover:text-amber-400">Privacy Policy</a> | <a href="#" className="hover:text-amber-400">Terms of Service</a></p>
        </div>
      </div>
    </footer>
  );
};