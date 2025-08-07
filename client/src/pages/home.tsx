import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import SearchBar from "@/components/search-bar";
import PropertyCard from "@/components/property-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, TrendingUp, Heart, Search } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();

  const { data: featuredProperties, isLoading: featuredLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Property[]>({
    queryKey: ["/api/favorites"],
  });

  const stats = [
    { icon: <Home className="w-8 h-8 text-primary" />, label: "Properties Available", value: "2,500+" },
    { icon: <TrendingUp className="w-8 h-8 text-secondary" />, label: "Properties Sold", value: "1,200+" },
    { icon: <Heart className="w-8 h-8 text-accent" />, label: "Happy Clients", value: "5,000+" },
    { icon: <Search className="w-8 h-8 text-primary" />, label: "Daily Searches", value: "10,000+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative">
        <div 
          className="h-[60vh] bg-cover bg-center bg-no-repeat flex items-center justify-center relative hero-gradient"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold font-['Poppins'] mb-6">
              Welcome back, {user?.firstName || 'there'}!
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Continue your property search or explore new listings
            </p>
            
            <div className="search-bar-shadow">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-3">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Your Favorites */}
      {favorites && favorites.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-['Poppins'] text-foreground">Your Favorites</h2>
              <Link href="/dashboard">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            {favoritesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-64 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} showFavorite />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-['Poppins'] text-foreground mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked premium properties from our exclusive collection</p>
            </div>
            <Link href="/properties">
              <Button variant="outline">View All Properties</Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties?.map((property) => (
                <PropertyCard key={property.id} property={property} showFavorite />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-['Poppins'] mb-6">What would you like to do today?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/properties">
              <Button size="lg" variant="secondary" className="w-full">
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="w-full">
                <Heart className="w-5 h-5 mr-2" />
                View Favorites
              </Button>
            </Link>
            <a href="#contact">
              <Button size="lg" variant="secondary" className="w-full">
                <Home className="w-5 h-5 mr-2" />
                Sell Property
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
