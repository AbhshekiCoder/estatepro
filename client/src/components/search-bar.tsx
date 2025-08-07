import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal } from "lucide-react";
import type { PropertySearch } from "@shared/schema";

interface SearchBarProps {
  onSearch?: (params: Partial<PropertySearch>) => void;
  compact?: boolean;
}

export default function SearchBar({ onSearch, compact = false }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchParams, setSearchParams] = useState<Partial<PropertySearch>>({
    query: "",
    propertyType: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minBedrooms: undefined,
    minBathrooms: undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values and non-filter options
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => 
        value !== undefined && value !== null && value !== "" && 
        value !== "all" && value !== "any" && value !== "no-min" && value !== "no-max"
      )
    );

    if (onSearch) {
      onSearch(filteredParams);
    } else {
      // Navigate to properties page with search params
      const searchQuery = new URLSearchParams();
      Object.entries(filteredParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && 
            value !== "all" && value !== "any" && value !== "no-min" && value !== "no-max") {
          searchQuery.append(key, value.toString());
        }
      });
      
      setLocation(`/properties${searchQuery.toString() ? `?${searchQuery.toString()}` : ""}`);
    }
  };

  const updateSearchParam = (key: keyof PropertySearch, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: (value === "all" || value === "any" || value === "no-min" || value === "no-max") ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setSearchParams({
      query: "",
      propertyType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minBedrooms: undefined,
      minBathrooms: undefined,
    });
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search properties..."
            value={searchParams.query || ""}
            onChange={(e) => updateSearchParam("query", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>
    );
  }

  return (
    <Card className="bg-card rounded-xl search-bar-shadow max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Enter city, neighborhood, or ZIP code"
                  value={searchParams.query || ""}
                  onChange={(e) => updateSearchParam("query", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select
                value={searchParams.propertyType || ""}
                onValueChange={(value) => updateSearchParam("propertyType", value || undefined)}
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
              <Button type="submit" className="w-full">
                Search Properties
              </Button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-primary hover:text-primary/80"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Advanced Filters {showAdvancedFilters ? "▲" : "▼"}
            </Button>
            
            {Object.values(searchParams).some(val => 
              val !== undefined && val !== "" && val !== null && 
              val !== "all" && val !== "any" && val !== "no-min" && val !== "no-max"
            ) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Min Price</label>
                  <Select
                    value={searchParams.minPrice?.toString() || ""}
                    onValueChange={(value) => updateSearchParam("minPrice", value ? Number(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No Min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-min">No Min</SelectItem>
                      <SelectItem value="100000">$100,000</SelectItem>
                      <SelectItem value="250000">$250,000</SelectItem>
                      <SelectItem value="500000">$500,000</SelectItem>
                      <SelectItem value="750000">$750,000</SelectItem>
                      <SelectItem value="1000000">$1,000,000</SelectItem>
                      <SelectItem value="1500000">$1,500,000</SelectItem>
                      <SelectItem value="2000000">$2,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Max Price</label>
                  <Select
                    value={searchParams.maxPrice?.toString() || ""}
                    onValueChange={(value) => updateSearchParam("maxPrice", value ? Number(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No Max" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-max">No Max</SelectItem>
                      <SelectItem value="500000">$500,000</SelectItem>
                      <SelectItem value="750000">$750,000</SelectItem>
                      <SelectItem value="1000000">$1,000,000</SelectItem>
                      <SelectItem value="1500000">$1,500,000</SelectItem>
                      <SelectItem value="2000000">$2,000,000</SelectItem>
                      <SelectItem value="3000000">$3,000,000</SelectItem>
                      <SelectItem value="5000000">$5,000,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Bedrooms</label>
                  <Select
                    value={searchParams.minBedrooms?.toString() || ""}
                    onValueChange={(value) => updateSearchParam("minBedrooms", value ? Number(value) : undefined)}
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
                  <label className="block text-sm font-medium text-foreground mb-1">Bathrooms</label>
                  <Select
                    value={searchParams.minBathrooms?.toString() || ""}
                    onValueChange={(value) => updateSearchParam("minBathrooms", value ? Number(value) : undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="1.5">1.5+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="2.5">2.5+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
