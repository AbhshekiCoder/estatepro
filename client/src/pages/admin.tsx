import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import PropertyForm from "@/components/property-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Home,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  MessageCircle,
  Search,
  User,
} from "lucide-react";
import type { Property, User as UserType, Inquiry } from "@shared/schema";

interface Analytics {
  totalProperties: number;
  totalUsers: number;
  totalViews: number;
  totalInquiries: number;
}

interface PropertiesResponse {
  properties: Property[];
  total: number;
}

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("properties");
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [propertySearch, setPropertySearch] = useState("");

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Unauthorized",
        description: "You need admin access to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,

  });

  // Fetch properties data
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery<PropertiesResponse>({
    queryKey: ["/api/properties", { query: propertySearch, limit: 50 }],
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (propertySearch) searchParams.append("query", propertySearch);
      searchParams.append("limit", "50");
      
      const response = await fetch(`/api/properties?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch properties");
      return response.json();
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      return await apiRequest("DELETE", `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Property deleted successfully.",
      });
      setDeletePropertyId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = (propertyId: string) => {
    setDeletePropertyId(propertyId);
  };

  const confirmDeleteProperty = () => {
    if (deletePropertyId) {
      deletePropertyMutation.mutate(deletePropertyId);
    }
  };

  const handlePropertyFormSuccess = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const handlePropertyFormCancel = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-['Poppins'] text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage properties, users, and site content</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {analyticsLoading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            [
              { icon: <Home className="w-8 h-8 text-primary" />, label: "Total Properties", value: analytics?.totalProperties || 0 },
              { icon: <Users className="w-8 h-8 text-secondary" />, label: "Active Users", value: analytics?.totalUsers || 0 },
              { icon: <Eye className="w-8 h-8 text-accent" />, label: "Property Views", value: analytics?.totalViews || 0 },
              { icon: <MessageCircle className="w-8 h-8 text-primary" />, label: "New Inquiries", value: analytics?.totalInquiries || 0 },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                    </div>
                    {stat.icon}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Properties Management */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Property Management
                  </CardTitle>
                  <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingProperty(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProperty ? "Edit Property" : "Add New Property"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProperty 
                            ? "Update the property information below."
                            : "Fill in the details to create a new property listing."
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <PropertyForm
                        property={editingProperty || undefined}
                        onSuccess={handlePropertyFormSuccess}
                        onCancel={handlePropertyFormCancel}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search properties..."
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Properties Table */}
                {propertiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Skeleton className="h-16 w-24" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    ))}
                  </div>
                ) : propertiesData?.properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                    <p className="text-muted-foreground">
                      {propertySearch ? "No properties match your search." : "Get started by adding your first property."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {propertiesData?.properties.map((property) => (
                      <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50">
                        {/* Property Image */}
                        <img
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80"}
                          alt={property.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        
                        {/* Property Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold truncate">{property.title}</h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {property.address}, {property.city}, {property.state}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm font-medium text-primary">
                                  {formatPrice(property.price)}
                                </span>
                                <Badge variant={property.status === "for-sale" ? "default" : "secondary"}>
                                  {property.status?.replace("-", " ").toUpperCase()}
                                </Badge>
                                {property.featured && (
                                  <Badge className="bg-accent">Featured</Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {property.views || 0} views
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProperty(property.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">User Management</h3>
                  <p className="text-muted-foreground">
                    User management features will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-32" />
                      <Skeleton className="h-32" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Chart Placeholder */}
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Analytics Charts</h3>
                        <p className="text-muted-foreground">
                          Detailed analytics charts will be available in a future update.
                        </p>
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-4">Property Performance</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Most Viewed</span>
                              <span className="font-medium">Modern Properties</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Average Views</span>
                              <span className="font-medium">
                                {analytics ? Math.round(analytics.totalViews / Math.max(analytics.totalProperties, 1)) : 0}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Featured Properties</span>
                              <span className="font-medium">
                                {propertiesData?.properties.filter(p => p.featured).length || 0}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-4">User Engagement</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Inquiries</span>
                              <span className="font-medium">{analytics?.totalInquiries || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Active Users</span>
                              <span className="font-medium">{analytics?.totalUsers || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg. Inquiries per Property</span>
                              <span className="font-medium">
                                {analytics ? (analytics.totalInquiries / Math.max(analytics.totalProperties, 1)).toFixed(1) : "0.0"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePropertyId} onOpenChange={() => setDeletePropertyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProperty}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
