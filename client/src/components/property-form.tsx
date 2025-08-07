import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPropertySchema, type InsertProperty, type Property } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { z } from "zod";

const propertyFormSchema = insertPropertySchema.extend({
  price: z.string().min(1, "Price is required"),
  bathrooms: z.string().optional(),
  lotSize: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: Property;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PropertyForm({ property, onSuccess, onCancel }: PropertyFormProps) {
  const { toast } = useToast();
  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");
  
  const isEdit = !!property;

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      address: property?.address || "",
      city: property?.city || "",
      state: property?.state || "",
      zipCode: property?.zipCode || "",
      price: property?.price?.toString() || "",
      bedrooms: property?.bedrooms || undefined,
      bathrooms: property?.bathrooms?.toString() || "",
      sqft: property?.sqft || undefined,
      lotSize: property?.lotSize?.toString() || "",
      yearBuilt: property?.yearBuilt || undefined,
      propertyType: property?.propertyType || "house",
      status: property?.status || "for-sale",
      featured: property?.featured || false,
      images: property?.images || [],
      features: property?.features || [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      return await apiRequest("POST", "/api/properties", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Success",
        description: "Property created successfully.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertProperty>) => {
      return await apiRequest("PUT", `/api/properties/${property?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties", property?.id] });
      toast({
        title: "Success",
        description: "Property updated successfully.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PropertyFormData) => {
    const propertyData: InsertProperty = {
      ...data,
      price: data.price.toString(),
      bathrooms: data.bathrooms ? data.bathrooms.toString() : null,
      lotSize: data.lotSize ? data.lotSize.toString() : null,
    };

    if (isEdit) {
      updateMutation.mutate(propertyData);
    } else {
      createMutation.mutate(propertyData);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues("features") || [];
      form.setValue("features", [...currentFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", currentFeatures.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Property" : "Add New Property"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Modern Luxury Villa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the property features, location, and highlights..."
                        rows={4}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhome">Townhome</SelectItem>
                          <SelectItem value="multi-family">Multi-family</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="for-sale">For Sale</SelectItem>
                          <SelectItem value="for-rent">For Rent</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="off-market">Off Market</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 Main Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Los Angeles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="90210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1250000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="4" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" placeholder="3.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="3500" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lotSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lot Size (acres)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2020" 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Image URL"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
                <Button type="button" onClick={addImage} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.watch("images")?.map((image, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    Image {index + 1}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add feature (e.g., Swimming Pool)"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.watch("features")?.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured Property</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this property as featured to highlight it on the homepage
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : isEdit ? "Update Property" : "Create Property"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
