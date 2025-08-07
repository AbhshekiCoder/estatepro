// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { FiHome, FiSearch, FiUser, FiHeart, FiMail, FiLogIn, FiLogOut, FiMenu, FiX, FiSettings, FiCamera, FiGrid, FiList} from 'react-icons/fi';
import { FaChartLine, FaUsers, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
  return (
    <nav className="bg-amber-900 text-amber-50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <FaBuilding className="text-amber-400 text-2xl" />
            <span className="font-bold text-xl">EstatePro</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" icon={<FiHome />} text="Home" />
            <NavLink to="/properties" icon={<FiSearch />} text="Properties" />
            <NavLink to="/contact" icon={<FiMail />} text="Contact" />
            <NavLink to="/about" icon={<FiUser />} text="About" />
            
            {isLoggedIn && (
              <button 
                onClick={toggleAdminPanel}
                className="flex items-center space-x-1 text-amber-300 hover:text-amber-50 transition"
              >
                <FiSettings />
                <span>Admin</span>
              </button>
            )}
            
            <button 
              onClick={toggleLogin}
              className="flex items-center space-x-1 bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition"
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
          className="md:hidden bg-amber-800"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" icon={<FiHome />} text="Home" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/properties" icon={<FiSearch />} text="Properties" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/contact" icon={<FiMail />} text="Contact" setIsMenuOpen={setIsMenuOpen} />
            <MobileNavLink to="/about" icon={<FiUser />} text="About" setIsMenuOpen={setIsMenuOpen} />
            
            {isLoggedIn && (
              <button 
                onClick={() => {
                  toggleAdminPanel();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-amber-300 py-2"
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
              className={`flex items-center space-x-2 py-2 px-4 rounded-lg ${
                isLoggedIn ? 'bg-amber-700' : 'bg-amber-600'
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
  <Link 
    to={to} 
    className="flex items-center space-x-1 text-amber-100 hover:text-amber-50 transition"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, icon, text, setIsMenuOpen }) => (
  <Link 
    to={to} 
    onClick={() => setIsMenuOpen(false)}
    className="flex items-center space-x-2 text-amber-100 py-2"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

// Home Page Component
const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
    setFeaturedProperties([
  {
    id: 1,
    title: "Modern Apartment",
    price: 350000,
    address: "123 Oak Street, San Francisco",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1250,
    year: 2018,
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 2,
    title: "Luxury Villa",
    price: 495000,
    address: "456 Pine Avenue, New York",
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 1850,
    year: 2020,
    image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 3,
    title: "Urban Townhouse",
    price: 275000,
    address: "789 Maple Road, Chicago",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    year: 2015,
    image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  }
]);
    }, 500);
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl p-8 md:p-16 text-amber-50 mb-16"
      >
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Find Your Dream Home Today
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8 text-amber-100"
          >
            Discover the perfect property that matches your lifestyle and budget
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/properties" 
              className="inline-block bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold py-3 px-8 rounded-full transition transform hover:scale-105"
            >
              Browse Properties
            </Link>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Featured Properties */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900">Featured Properties</h2>
          <Link to="/properties" className="text-amber-700 hover:text-amber-900 font-semibold">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
      
      {/* Services Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Our Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            icon={<FiSearch size={48} />}
            title="Property Search"
            description="Find your perfect home with our advanced search tools and personalized recommendations."
          />
          <ServiceCard 
            icon={<FiUser size={48} />}
            title="Agent Services"
            description="Connect with our expert agents who will guide you through the buying or selling process."
          />
          <ServiceCard 
            icon={<FiHeart size={48} />}
            title="Property Management"
            description="Comprehensive management services for rental properties and investment portfolios."
          />
        </div>
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="relative">
        {/* Use actual image */}
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-amber-500 text-amber-900 font-bold py-1 px-3 rounded-full">
          ${property.price.toLocaleString()}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-2">{property.title}</h3>
        <p className="text-amber-700 mb-4">{property.address}</p>
        
        <div className="flex justify-between text-amber-600 mb-4">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.sqft.toLocaleString()} sq.ft.</span>
        </div>
        
        <Link 
          to={`/property/${property.id}`}
          className="block w-full bg-amber-700 hover:bg-amber-600 text-amber-50 text-center py-2 rounded-lg transition"
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
    whileHover={{ 
      y: -10,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}
    className="bg-white p-8 rounded-2xl shadow-md text-center"
  >
    <div className="text-amber-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-amber-900 mb-3">{title}</h3>
    <p className="text-amber-700">{description}</p>
  </motion.div>
);

// Properties Page Component
// src/App.js
// ... (previous imports and code remain the same)

// Properties Page Component - Enhanced Version
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
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          title: "Modern Apartment",
          price: 350000,
          address: "123 Oak Street, San Francisco",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1250,
          year: 2018,
          type: "apartment",
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
        },
        {
          id: 2,
          title: "Luxury Villa",
          price: 495000,
          address: "456 Pine Avenue, New York",
          bedrooms: 4,
          bathrooms: 3.5,
          sqft: 1850,
          year: 2020,
          type: "house",
          image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg"
        },
        {
          id: 3,
          title: "Urban Townhouse",
          price: 275000,
          address: "789 Maple Road, Chicago",
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1100,
          year: 2015,
          type: "townhouse",
          image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
        },
        {
          id: 4,
          title: "Suburban Family Home",
          price: 420000,
          address: "101 Elm Drive, Austin",
          bedrooms: 5,
          bathrooms: 3,
          sqft: 2200,
          year: 2010,
          type: "house",
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
        },
        {
          id: 5,
          title: "Downtown Loft",
          price: 325000,
          address: "202 Cedar Lane, Seattle",
          bedrooms: 1,
          bathrooms: 1,
          sqft: 950,
          year: 2019,
          type: "apartment",
          image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg"
        },
        {
          id: 6,
          title: "Waterfront Property",
          price: 750000,
          address: "303 Bayview Road, Miami",
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 1800,
          year: 2017,
          type: "house",
          image: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg"
        },
        {
          id: 7,
          title: "Mountain Cabin",
          price: 295000,
          address: "404 Forest Trail, Denver",
          bedrooms: 2,
          bathrooms: 1,
          sqft: 900,
          year: 2005,
          type: "cabin",
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
        },
        {
          id: 8,
          title: "Luxury Condo",
          price: 650000,
          address: "505 Skyline Blvd, Los Angeles",
          bedrooms: 2,
          bathrooms: 2.5,
          sqft: 1500,
          year: 2022,
          type: "condo",
          image: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg"
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
        (filters.price === 'low' && property.price < 300000) ||
        (filters.price === 'medium' && property.price >= 300000 && property.price < 500000) ||
        (filters.price === 'high' && property.price >= 500000)
      ) &&
      (filters.bedrooms === '' || 
        (filters.bedrooms === '1' && property.bedrooms === 1) ||
        (filters.bedrooms === '2' && property.bedrooms === 2) ||
        (filters.bedrooms === '3' && property.bedrooms >= 3)
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
        <h1 className="text-4xl font-bold text-amber-900 mb-4">Available Properties</h1>
        <p className="text-amber-700">Find your perfect home from our curated collection</p>
      </div>
      
      {/* Filters and Sorting */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full">
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
                <option value="cabin">Cabin</option>
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
                <option value="low">Under $300,000</option>
                <option value="medium">$300,000 - $500,000</option>
                <option value="high">Over $500,000</option>
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
                <option value="3">3+</option>
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
          <button className="p-2 rounded-lg bg-amber-100 text-amber-700 mr-2">
            <FiGrid size={20} />
          </button>
          <button className="p-2 rounded-lg bg-amber-600 text-amber-50">
            <FiList size={20} />
          </button>
        </div>
      </div>
      
      {/* Property Listings */}
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
      
      {/* Pagination */}
      {sortedProperties.length > 0 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center justify-center">
            &larr;
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
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

// Property Details Component
const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          title: "Modern Apartment",
          price: 350000,
          address: "123 Oak Street, San Francisco, CA 94101",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1250,
          year: 2018,
          description: "This stunning modern apartment offers luxury living at its finest. Located in the heart of the city, this property features an open floor plan, high ceilings, and floor-to-ceiling windows that flood the space with natural light. The gourmet kitchen boasts top-of-the-line appliances, quartz countertops, and a spacious island perfect for entertaining.",
          features: ['Swimming Pool', 'Garage', 'Garden', 'Security System', 'Hardwood Floors', 'Central AC', 'Fireplace', 'Smart Home'],
          images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
            "https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg",
            "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
          ]
        },
        {
          id: 2,
          title: "Luxury Villa",
          price: 495000,
          address: "456 Pine Avenue, New York, NY 10001",
          bedrooms: 4,
          bathrooms: 3.5,
          sqft: 1850,
          year: 2020,
          description: "Experience luxury living in this exquisite villa. With panoramic views and premium finishes throughout, this home features a chef's kitchen with custom cabinetry, a spacious master suite with walk-in closet, and a professionally landscaped backyard perfect for outdoor entertaining.",
          features: ['Swimming Pool', 'Garage', 'Garden', 'Security System', 'Hardwood Floors', 'Central AC', 'Fireplace', 'Smart Home', 'Home Theater'],
          images: [
            "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg",
            "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
            "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg",
            "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg"
          ]
        },
        {
          id: 3,
          title: "Urban Townhouse",
          price: 275000,
          address: "789 Maple Road, Chicago, IL 60601",
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1100,
          year: 2015,
          description: "This beautifully renovated townhouse combines modern convenience with historic charm. Located in a vibrant neighborhood, this home features an open-concept living area, updated kitchen with stainless steel appliances, and a private rooftop terrace with city views.",
          features: ['Garage', 'Security System', 'Hardwood Floors', 'Central AC', 'Smart Home', 'Rooftop Terrace'],
          images: [
            "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg",
            "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
            "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
            "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg"
          ]
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
        <Link to="/properties" className="text-amber-700 hover:text-amber-900 flex items-center">
          &larr; Back to Properties
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
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            {property.images.map((img, index) => (
              <div 
                key={index} 
                className={`rounded-xl overflow-hidden h-24 cursor-pointer transition-all duration-300 ${
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
          
          {/* Property Details */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-amber-900 mb-2">{property.title}</h1>
                <p className="text-amber-700">{property.address}</p>
              </div>
              <div className="text-3xl font-bold text-amber-700">${property.price.toLocaleString()}</div>
            </div>
            
            <div className="flex space-x-8 mb-8">
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
            </div>
            
            <h2 className="text-xl font-bold text-amber-900 mb-4">Description</h2>
            <p className="text-amber-700 mb-6">
              {property.description}
            </p>
            
            <h2 className="text-xl font-bold text-amber-900 mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                  <span className="text-amber-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 rounded-lg text-lg font-semibold transition">
              Schedule a Tour
            </button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Agent Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Listing Agent</h2>
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 mr-4" />
              <div>
                <div className="font-bold text-amber-900">Sarah Johnson</div>
                <div className="text-amber-700">Licensed Real Estate Agent</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 rounded-lg transition">
                <FiMail className="inline mr-2" />
                Contact Agent
              </button>
              <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 rounded-lg transition">
                <FiUser className="inline mr-2" />
                View Profile
              </button>
            </div>
          </div>
          
          {/* Mortgage Calculator */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Mortgage Calculator</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-amber-800 mb-1">Home Price</label>
                <input 
                  type="text" 
                  value={`$${property.price.toLocaleString()}`}
                  className="w-full p-2 border border-amber-300 rounded-lg bg-amber-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-amber-800 mb-1">Down Payment</label>
                <select className="w-full p-2 border border-amber-300 rounded-lg bg-amber-50">
                  <option>20% (${(property.price * 0.2).toLocaleString()})</option>
                  <option>10% (${(property.price * 0.1).toLocaleString()})</option>
                  <option>5% (${(property.price * 0.05).toLocaleString()})</option>
                </select>
              </div>
              
              <div>
                <label className="block text-amber-800 mb-1">Loan Term</label>
                <select className="w-full p-2 border border-amber-300 rounded-lg bg-amber-50">
                  <option>30 years</option>
                  <option>15 years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-amber-800 mb-1">Interest Rate</label>
                <input 
                  type="text" 
                  value="5.5%"
                  className="w-full p-2 border border-amber-300 rounded-lg bg-amber-50"
                />
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-amber-800">Monthly Payment</span>
                  <span className="font-bold text-amber-900">$2,248</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Principal & Interest</span>
                  <span>$2,048</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Property Tax</span>
                  <span>$120</span>
                </div>
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Home Insurance</span>
                  <span>$80</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Virtual Tour */}
          <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-amber-900 mb-4">Virtual Tour</h2>
            <div className="aspect-w-16 aspect-h-9 bg-amber-100 rounded-xl overflow-hidden">
              <div className="w-full h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-amber-600 mb-2">
                    <FiCamera size={48} className="mx-auto" />
                  </div>
                  <p className="text-amber-800">Virtual tour available</p>
                  <button className="mt-3 bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-4 rounded-lg transition">
                    Launch Tour
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
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 1000);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Contact Form */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Contact Us</h1>
        
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Message Sent Successfully!</h2>
            <p className="text-amber-700 mb-6">
              Thank you for contacting us. We'll get back to you as soon as possible.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-6 rounded-lg transition"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-amber-800 font-medium mb-2">Full Name</label>
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
              <label className="block text-amber-800 font-medium mb-2">Email Address</label>
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
              <label className="block text-amber-800 font-medium mb-2">Message</label>
              <textarea 
                rows="5" 
                name="message"
                className="w-full p-3 border border-amber-300 rounded-lg bg-amber-50"
                placeholder="Your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-amber-50 py-3 rounded-lg text-lg font-semibold transition"
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
          Have questions about our properties or services? Our team is ready to help you find 
          your dream home or answer any real estate questions you may have.
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <FiMail className="text-amber-700" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">Email Us</h3>
              <p className="text-amber-700">info@estatepro.com</p>
              <p className="text-amber-700">support@estatepro.com</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <FiHome className="text-amber-700" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">Visit Us</h3>
              <p className="text-amber-700">123 Real Estate Avenue</p>
              <p className="text-amber-700">New York, NY 10001</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <FiUser className="text-amber-700" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">Call Us</h3>
              <p className="text-amber-700">+1 (555) 123-4567</p>
              <p className="text-amber-700">Mon-Fri, 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64" />
      </div>
    </div>
  );
};

// About Page Component
const AboutPage = () => {
  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">About EstatePro</h1>
        <p className="text-xl text-amber-700 max-w-3xl mx-auto">
          We're dedicated to helping you find the perfect property and making the buying or selling process seamless.
        </p>
      </div>
      
      {/* Our Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-6">Our Story</h2>
          <p className="text-amber-700 mb-4">
            Founded in 2010, EstatePro began with a simple mission: to transform the real estate experience 
            for buyers and sellers. What started as a small team of passionate agents has grown into one of 
            the most respected real estate agencies in the country.
          </p>
          <p className="text-amber-700 mb-4">
            Our founder, Michael Anderson, recognized the need for a more personalized approach to real estate. 
            Frustrated with the impersonal nature of traditional agencies, he built EstatePro on the principles 
            of integrity, expertise, and exceptional client service.
          </p>
          <p className="text-amber-700">
            Today, we serve thousands of clients each year, helping them navigate the complexities of the real 
            estate market with confidence and ease.
          </p>
        </div>
        
        <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-96" />
      </div>
      
      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Meet Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Michael Anderson", role: "Founder & CEO" },
            { name: "Sarah Johnson", role: "Lead Agent" },
            { name: "David Chen", role: "Property Manager" }
          ].map((person, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gray-200 border-2 border-dashed w-full h-64" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-amber-900 mb-1">{person.name}</h3>
                <p className="text-amber-700 mb-4">{person.role}</p>
                <button className="text-amber-600 hover:text-amber-800 font-medium">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Our Values */}
      <div className="bg-amber-100 rounded-2xl p-12">
        <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-amber-700 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart size={28} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Client Focused</h3>
            <p className="text-amber-700">
              We prioritize your needs and goals above all else, ensuring a personalized experience.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-700 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHome size={28} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Expert Guidance</h3>
            <p className="text-amber-700">
              Our experienced agents provide valuable insights to help you make informed decisions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-700 text-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser size={28} />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Integrity</h3>
            <p className="text-amber-700">
              We conduct business with honesty, transparency, and the highest ethical standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ toggleAdminPanel }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    // Simulate API call to backend
    setTimeout(() => {
      setProperties([
        {
          id: 1,
          title: "Modern Apartment",
          price: 350000,
          status: "available",
          views: 124,
          inquiries: 8
        },
        {
          id: 2,
          title: "Luxury Villa",
          price: 495000,
          status: "pending",
          views: 89,
          inquiries: 5
        },
        {
          id: 3,
          title: "Urban Townhouse",
          price: 275000,
          status: "sold",
          views: 210,
          inquiries: 12
        }
      ]);
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
            className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-4 rounded-lg transition"
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
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                activeTab === 'dashboard' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaChartLine />
              <span>Dashboard</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                activeTab === 'properties' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('properties')}
            >
              <FaBuilding />
              <span>Properties</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                activeTab === 'users' ? 'bg-amber-700' : 'hover:bg-amber-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers />
              <span>Users</span>
            </button>
            <button 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">{properties.length}</div>
                  <div className="text-amber-700">Total Properties</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">
                    {properties.filter(p => p.status === 'available').length}
                  </div>
                  <div className="text-amber-700">Active Listings</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-900 mb-2">
                    {properties.filter(p => p.status === 'sold').length}
                  </div>
                  <div className="text-amber-700">Sold Properties</div>
                </div>
              </div>
              
              <div className="bg-white border border-amber-200 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-amber-900 mb-4">Recent Activities</h2>
                
                <div className="space-y-4">
                  {[
                    { action: "Added new property", time: "2 hours ago" },
                    { action: "Updated property listing", time: "5 hours ago" },
                    { action: "User signed up", time: "1 day ago" },
                    { action: "Property sold", time: "2 days ago" }
                  ].map((activity, index) => (
                    <div key={index} className="flex justify-between border-b border-amber-100 pb-3">
                      <div className="text-amber-800">{activity.action}</div>
                      <div className="text-amber-600 text-sm">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'properties' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-amber-900">Property Listings</h2>
                <button className="bg-amber-600 hover:bg-amber-700 text-amber-50 py-2 px-4 rounded-lg transition">
                  Add New Property
                </button>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-amber-600 hover:text-amber-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
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
              <span className="font-bold text-xl">EstatePro</span>
            </div>
            <p className="text-amber-300 mb-4">
              Your trusted partner in finding the perfect property for your lifestyle and budget.
            </p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="bg-amber-800 hover:bg-amber-700 text-amber-100 w-10 h-10 rounded-full flex items-center justify-center transition"
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Properties', 'About', 'Contact'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-amber-300 hover:text-amber-50 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-amber-300">
              <li className="flex items-start">
                <FiHome className="mr-2 mt-1" />
                <span>123 Real Estate Avenue, NY 10001</span>
              </li>
              <li className="flex items-start">
                <FiMail className="mr-2 mt-1" />
                <span>info@estatepro.com</span>
              </li>
              <li className="flex items-start">
                <FiUser className="mr-2 mt-1" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-amber-300 mb-4">
              Subscribe to our newsletter for the latest listings and market updates.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email"
                className="bg-amber-800 text-amber-50 px-4 py-2 rounded-l-lg w-full focus:outline-none"
              />
              <button className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-amber-800 mt-12 pt-6 text-center text-amber-500">
          <p>&copy; {new Date().getFullYear()} EstatePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

