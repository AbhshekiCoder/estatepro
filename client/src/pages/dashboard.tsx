import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Search, MessageCircle, User, Edit } from "lucide-react";
import { useEffect } from "react";
import type { Property, Inquiry, SearchHistory } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Property[]>({
    queryKey: ["/api/favorites"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries/user"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: searchHistory, isLoading: searchHistoryLoading } = useQuery<SearchHistory[]>({
    queryKey: ["/api/search-history"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const stats = [
    {
      title: "Saved Properties",
      value: favorites?.length || 0,
      icon: <Heart className="w-6 h-6 text-accent" />,
    },
    {
      title: "Property Inquiries",
      value: inquiries?.length || 0,
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
    },
    {
      title: "Recent Searches",
      value: searchHistory?.length || 0,
      icon: <Search className="w-6 h-6 text-secondary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || ""} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold font-['Poppins'] text-foreground">
                  Welcome, {user?.firstName || "User"}!
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList>
            <TabsTrigger value="favorites">Saved Properties</TabsTrigger>
            <TabsTrigger value="inquiries">My Inquiries</TabsTrigger>
            <TabsTrigger value="search-history">Search History</TabsTrigger>
          </TabsList>

          {/* Saved Properties */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-accent" />
                  Saved Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : favorites?.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
                    <p className="text-muted-foreground mb-4">
                      Start browsing properties and save the ones you like
                    </p>
                    <Button>Browse Properties</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites?.map((property) => (
                      <PropertyCard key={property.id} property={property} showFavorite />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries */}
          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  My Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ))}
                  </div>
                ) : inquiries?.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Inquiries</h3>
                    <p className="text-muted-foreground">
                      You haven't made any property inquiries yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries?.map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">Property Inquiry</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {inquiry.status?.charAt(0).toUpperCase() + inquiry.status?.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {inquiry.createdAt && new Date(inquiry.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{inquiry.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search History */}
          <TabsContent value="search-history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-secondary" />
                  Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchHistoryLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : searchHistory?.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Search History</h3>
                    <p className="text-muted-foreground">
                      Your search history will appear here once you start searching
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchHistory?.map((search) => (
                      <div key={search.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div>
                          <p className="font-medium">{search.query}</p>
                          {search.filters && (
                            <p className="text-sm text-muted-foreground">
                              {Object.keys(search.filters as any).length} filters applied
                            </p>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {search.createdAt && new Date(search.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
