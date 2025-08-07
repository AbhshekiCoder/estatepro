import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Home, Bath, Square, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

interface PropertyCardProps {
  property: Property;
  showFavorite?: boolean;
  compact?: boolean;
}

export default function PropertyCard({ property, showFavorite = false, compact = false }: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  const favoritesMutation = useMutation({
    mutationFn: async ({ action }: { action: "add" | "remove" }) => {
      if (action === "add") {
        return await apiRequest("POST", "/api/favorites", { propertyId: property.id });
      } else {
        return await apiRequest("DELETE", `/api/favorites/${property.id}`);
      }
    },
    onSuccess: (_, { action }) => {
      setIsFavorited(action === "add");
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", property.id, "check"] });
      toast({
        title: action === "add" ? "Added to Favorites" : "Removed from Favorites",
        description: `Property ${action === "add" ? "added to" : "removed from"} your favorites list.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to save properties to your favorites.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    const action = isFavorited ? "remove" : "add";
    favoritesMutation.mutate({ action });
  };

  const getStatusBadge = () => {
    switch (property.status) {
      case "for-sale":
        return <Badge className="bg-secondary">For Sale</Badge>;
      case "for-rent":
        return <Badge className="bg-primary">For Rent</Badge>;
      case "sold":
        return <Badge variant="secondary">Sold</Badge>;
      case "rented":
        return <Badge variant="secondary">Rented</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{property.status}</Badge>;
    }
  };

  const getFeaturedBadge = () => {
    if (property.featured) {
      return <Badge className="bg-accent">Featured</Badge>;
    }
    return null;
  };

  // Default image if no images provided
  const propertyImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <Link href={`/property/${property.id}`}>
      <Card className={`property-card-hover overflow-hidden cursor-pointer ${compact ? "h-auto" : ""}`}>
        <div className="relative">
          <img 
            src={propertyImage}
            alt={property.title}
            className={`w-full object-cover ${compact ? "h-48" : "h-64"}`}
          />
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {getFeaturedBadge()}
            {getStatusBadge()}
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <button 
              className="absolute top-4 left-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
              onClick={handleFavoriteToggle}
              disabled={favoritesMutation.isPending}
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent"
                }`} 
              />
            </button>
          )}

          {/* Views Badge */}
          {property.views && property.views > 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {property.views} views
              </Badge>
            </div>
          )}
        </div>

        <CardContent className={`${compact ? "p-4" : "p-6"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-primary ${compact ? "text-xl" : "text-2xl"}`}>
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-muted-foreground capitalize">
              {property.propertyType}
            </span>
          </div>

          <h3 className={`font-semibold mb-2 line-clamp-1 ${compact ? "text-base" : "text-lg"}`}>
            {property.title}
          </h3>
          
          <div className="flex items-start text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
            <p className="text-sm line-clamp-2">
              {property.address}, {property.city}, {property.state}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
            {property.bedrooms && (
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
            )}
            {property.sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span>{property.sqft.toLocaleString()} sqft</span>
              </div>
            )}
          </div>

          <Button className="w-full" size={compact ? "sm" : "default"}>
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
