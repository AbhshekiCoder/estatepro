import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  Share2, 
  Home, 
  Bath, 
  Square, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle,
  ArrowLeft 
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import type { Property, InsertInquiry } from "@shared/schema";

export default function PropertyDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Redirect to login if accessing protected features while not authenticated
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      // Only show toast if explicitly trying to access authenticated features
    }
  }, [isAuthenticated, user]);

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    enabled: !!id,
  });

  const { data: favoriteStatus } = useQuery<{ isFavorite: boolean }>({
    queryKey: ["/api/favorites", id, "check"],
    enabled: !!id && isAuthenticated,
    retry: false,
  });

  const favoritesMutation = useMutation({
    mutationFn: async ({ action }: { action: "add" | "remove" }) => {
      if (action === "add") {
        return await apiRequest("POST", "/api/favorites", { propertyId: id });
      } else {
        return await apiRequest("DELETE", `/api/favorites/${id}`);
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", id, "check"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
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

  const inquiryMutation = useMutation({
    mutationFn: async (inquiryData: InsertInquiry) => {
      return await apiRequest("POST", "/api/inquiries", inquiryData);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent successfully. We'll get back to you soon!",
      });
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteToggle = () => {
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

    const action = favoriteStatus?.isFavorite ? "remove" : "add";
    favoritesMutation.mutate({ action });
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    const inquiryData: InsertInquiry = {
      propertyId: property.id,
      userId: user?.id,
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone || undefined,
      message: inquiryForm.message,
      inquiryType: "general",
    };

    inquiryMutation.mutate(inquiryData);
  };

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Property link copied to clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied", 
        description: "Property link copied to clipboard.",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The property you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/properties">
                <Button>Browse All Properties</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-80 w-full mb-4" />
              <div className="grid grid-cols-4 gap-2 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : [
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
      ];

  const features = property.features && property.features.length > 0 
    ? property.features 
    : [
        "Hardwood Floors",
        "Central Air/Heat", 
        "Swimming Pool",
        "3-Car Garage",
        "Modern Kitchen",
        "Smart Home Features"
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation("/properties")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold font-['Poppins'] text-foreground mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavoriteToggle}
                disabled={favoritesMutation.isPending}
                className={favoriteStatus?.isFavorite ? "text-accent border-accent" : ""}
              >
                <Heart className={`w-4 h-4 mr-2 ${favoriteStatus?.isFavorite ? "fill-current" : ""}`} />
                {favoriteStatus?.isFavorite ? "Favorited" : "Save"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-primary">
              ${Number(property.price).toLocaleString()}
            </div>
            <Badge variant={property.status === "for-sale" ? "default" : "secondary"}>
              {property.status?.replace("-", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <img 
                src={propertyImages[selectedImageIndex]}
                alt={property.title}
                className="w-full h-80 object-cover rounded-xl mb-4"
              />
              
              <div className="grid grid-cols-4 gap-2">
                {propertyImages.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} - View ${index + 1}`}
                    className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-opacity ${
                      selectedImageIndex === index ? "opacity-100 ring-2 ring-primary" : "opacity-75 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-foreground">{property.bedrooms || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-foreground">{property.bathrooms || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-foreground">
                    {property.sqft ? property.sqft.toLocaleString() : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">Sq Ft</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-foreground">{property.yearBuilt || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">Year Built</div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">About This Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || 
                  `This stunning ${property.propertyType} offers the perfect blend of modern design and comfortable living. 
                  Located in ${property.city}, ${property.state}, this property features premium finishes throughout. 
                  With ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms in ${property.sqft?.toLocaleString()} square feet, 
                  there's plenty of space for comfortable living.`
                }
              </p>
            </div>

            {/* Features & Amenities */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                
                {/* Agent Info */}
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                    alt="Real estate agent"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Senior Real Estate Agent</div>
                  </div>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <Input
                    placeholder="Your Name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Textarea
                    placeholder="I'm interested in this property..."
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={inquiryMutation.isPending}
                  >
                    {inquiryMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
