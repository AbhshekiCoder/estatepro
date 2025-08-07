import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search-bar";
import { Heart, Home, Users, Shield, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const featuredProperties = [
    {
      id: "1",
      title: "Modern Luxury Villa",
      price: 1250000,
      address: "1234 Oak Tree Lane, Beverly Hills, CA",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3500,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      status: "Featured"
    },
    {
      id: "2", 
      title: "Contemporary Family Home",
      price: 875000,
      address: "5678 Maple Street, Austin, TX",
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 2800,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      status: "Hot"
    },
    {
      id: "3",
      title: "Historic Victorian Home", 
      price: 650000,
      address: "910 Heritage Ave, Portland, OR",
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2600,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      status: "New"
    }
  ];

  const features = [
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: "Extensive Property Database",
      description: "Access thousands of verified properties with detailed information and high-quality photos."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Expert Real Estate Agents",
      description: "Work with certified professionals who know the local market inside and out."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure Transactions",
      description: "Every transaction is protected with industry-leading security and verification processes."
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Premium Experience",
      description: "Enjoy a seamless, modern interface designed to make property hunting effortless."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold font-['Poppins'] text-primary">PropertyHub</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium">Buy</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium">Rent</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium">Sell</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2 text-sm font-medium">Agents</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogin}>
                Sign In
              </Button>
              <Button onClick={handleLogin}>
                Sign Up
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div 
          className="h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center relative hero-gradient"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold font-['Poppins'] mb-6">Find Your Dream Home</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">Discover premium properties with expert guidance and cutting-edge technology</p>
            
            <div className="search-bar-shadow">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-foreground mb-4">Featured Properties</h2>
            <p className="text-muted-foreground text-lg">Handpicked premium properties from our exclusive collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="property-card-hover overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.image}
                    alt={property.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                    property.status === 'Featured' ? 'bg-secondary' :
                    property.status === 'Hot' ? 'bg-accent' : 'bg-primary'
                  }`}>
                    {property.status}
                  </div>
                  <button className="absolute top-4 left-4 text-white hover:text-accent transition-colors">
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">For Sale</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-muted-foreground mb-4">{property.address}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center">
                      <span>{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center">
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleLogin}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" onClick={handleLogin}>
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-foreground mb-4">Why Choose PropertyHub?</h2>
            <p className="text-muted-foreground text-lg">Experience the future of real estate with our innovative platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers who found their dream properties with PropertyHub</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleLogin}>
              Start Searching Now
            </Button>
            <Button size="lg" variant="outline" className="text-primary bg-white hover:bg-gray-100" onClick={handleLogin}>
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold font-['Poppins'] mb-4">PropertyHub</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Your trusted partner in finding the perfect property. We combine cutting-edge technology 
                with expert knowledge to make your real estate journey seamless.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Buy Properties</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Rent Properties</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sell Property</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Find Agents</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📧 info@propertyhub.com</li>
                <li>📞 (555) 123-4567</li>
                <li>📍 123 Real Estate Ave<br/>Suite 100, New York, NY 10001</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 PropertyHub. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
