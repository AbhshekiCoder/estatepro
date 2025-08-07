import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import PropertyCard from "@/components/property-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import type { Property, PropertySearch } from "@shared/schema";

interface PropertiesResponse {
  properties: Property[];
  total: number;
}

export default function Properties() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<Partial<PropertySearch>>({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data, isLoading, error } = useQuery<PropertiesResponse>({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "all" && value !== "any") {
          searchParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/properties?${searchParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });

  const handleFilterChange = (key: keyof PropertySearch, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to first page when changing filters
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const totalPages = data ? Math.ceil(data.total / (filters.limit || 12)) : 0;
  const activeFiltersCount = Object.keys(filters).filter(key => 
    key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' && 
    filters[key as keyof PropertySearch] !== undefined && 
    filters[key as keyof PropertySearch] !== null && 
    filters[key as keyof PropertySearch] !== "" &&
    filters[key as keyof PropertySearch] !== "all" &&
    filters[key as keyof PropertySearch] !== "any"
  ).length;

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Error Loading Properties</h2>
              <p className="text-muted-foreground">We couldn't load the properties. Please try again later.</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-['Poppins'] text-foreground mb-2">Browse Properties</h1>
          <p className="text-muted-foreground">
            {data ? `${data.total} properties found` : "Loading properties..."}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Enter city, neighborhood, or ZIP code"
                    value={filters.query || ""}
                    onChange={(e) => handleFilterChange("query", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select
                  value={filters.propertyType || ""}
                  onValueChange={(value) => handleFilterChange("propertyType", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhome">Townhome</SelectItem>
                    <SelectItem value="multi-family">Multi-family</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={filters.status || ""}
                  onValueChange={(value) => handleFilterChange("status", value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="for-sale">For Sale</SelectItem>
                    <SelectItem value="for-rent">For Rent</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Advanced Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  handleFilterChange("sortBy", sortBy);
                  handleFilterChange("sortOrder", sortOrder);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="sqft-desc">Largest First</SelectItem>
                  <SelectItem value="views-desc">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Min Price</label>
                    <Input
                      type="number"
                      placeholder="No Min"
                      value={filters.minPrice || ""}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Max Price</label>
                    <Input
                      type="number"
                      placeholder="No Max"
                      value={filters.maxPrice || ""}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Min Bedrooms</label>
                    <Select
                      value={filters.minBedrooms?.toString() || ""}
                      onValueChange={(value) => handleFilterChange("minBedrooms", value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Min Bathrooms</label>
                    <Select
                      value={filters.minBathrooms?.toString() || ""}
                      onValueChange={(value) => handleFilterChange("minBathrooms", value ? Number(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(12)].map((_, i) => (
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
        ) : data?.properties.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">No Properties Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find any properties matching your criteria. Try adjusting your filters.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data?.properties.map((property) => (
                <PropertyCard key={property.id} property={property} showFavorite />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange("page", (filters.page || 1) - 1)}
                >
                  Previous
                </Button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min((filters.page || 1) - 2 + i, totalPages - 4 + i));
                  return (
                    <Button
                      key={pageNum}
                      variant={filters.page === pageNum ? "default" : "outline"}
                      onClick={() => handleFilterChange("page", pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => handleFilterChange("page", (filters.page || 1) + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
