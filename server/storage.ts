import {
  users,
  properties,
  favorites,
  inquiries,
  searchHistory,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Favorite,
  type InsertFavorite,
  type Inquiry,
  type InsertInquiry,
  type SearchHistory,
  type InsertSearchHistory,
  type PropertySearch,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, gte, lte, ilike, desc, asc, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Property operations
  getProperties(search: PropertySearch): Promise<{ properties: Property[]; total: number }>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  incrementPropertyViews(id: string): Promise<void>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  
  // Favorites operations
  getUserFavorites(userId: string): Promise<Property[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, propertyId: string): Promise<boolean>;
  isFavorite(userId: string, propertyId: string): Promise<boolean>;
  
  // Inquiry operations
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getPropertyInquiries(propertyId: string): Promise<Inquiry[]>;
  getUserInquiries(userId: string): Promise<Inquiry[]>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined>;
  
  // Search history operations
  addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getUserSearchHistory(userId: string, limit?: number): Promise<SearchHistory[]>;
  
  // Analytics operations
  getAnalytics(): Promise<{
    totalProperties: number;
    totalUsers: number;
    totalViews: number;
    totalInquiries: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Property operations
  async getProperties(search: PropertySearch): Promise<{ properties: Property[]; total: number }> {
    const {
      query,
      city,
      state,
      zipCode,
      propertyType,
      status,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minSqft,
      maxSqft,
      featured,
      page,
      limit,
      sortBy,
      sortOrder,
    } = search;

    // Build where conditions
    const conditions = [];
    
    if (query) {
      conditions.push(
        or(
          ilike(properties.title, `%${query}%`),
          ilike(properties.description, `%${query}%`),
          ilike(properties.address, `%${query}%`),
        )
      );
    }
    
    if (city) conditions.push(ilike(properties.city, `%${city}%`));
    if (state) conditions.push(ilike(properties.state, `%${state}%`));
    if (zipCode) conditions.push(eq(properties.zipCode, zipCode));
    if (propertyType) conditions.push(eq(properties.propertyType, propertyType));
    if (status) conditions.push(eq(properties.status, status));
    if (minPrice) conditions.push(gte(properties.price, minPrice.toString()));
    if (maxPrice) conditions.push(lte(properties.price, maxPrice.toString()));
    if (minBedrooms) conditions.push(gte(properties.bedrooms, minBedrooms));
    if (maxBedrooms) conditions.push(lte(properties.bedrooms, maxBedrooms));
    if (minBathrooms) conditions.push(gte(properties.bathrooms, minBathrooms.toString()));
    if (maxBathrooms) conditions.push(lte(properties.bathrooms, maxBathrooms.toString()));
    if (minSqft) conditions.push(gte(properties.sqft, minSqft));
    if (maxSqft) conditions.push(lte(properties.sqft, maxSqft));
    if (featured !== undefined) conditions.push(eq(properties.featured, featured));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(properties)
      .where(whereClause);

    // Get properties with pagination and sorting
    const sortColumn = sortBy === "price" ? properties.price :
                      sortBy === "views" ? properties.views :
                      sortBy === "sqft" ? properties.sqft :
                      properties.createdAt;
    
    const orderBy = sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

    const propertiesResult = await db
      .select()
      .from(properties)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset((page - 1) * limit);

    return { properties: propertiesResult, total };
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db
      .delete(properties)
      .where(eq(properties.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementPropertyViews(id: string): Promise<void> {
    await db
      .update(properties)
      .set({ views: sql`${properties.views} + 1` })
      .where(eq(properties.id, id));
  }

  async getFeaturedProperties(limit = 6): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.featured, true))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
  }

  // Favorites operations
  async getUserFavorites(userId: string): Promise<Property[]> {
    const result = await db
      .select({ property: properties })
      .from(favorites)
      .innerJoin(properties, eq(favorites.propertyId, properties.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
    
    return result.map(r => r.property);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeFavorite(userId: string, propertyId: string): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId)
      ));
    return (result.rowCount ?? 0) > 0;
  }

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId)
      ));
    return !!favorite;
  }

  // Inquiry operations
  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  async getPropertyInquiries(propertyId: string): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.propertyId, propertyId))
      .orderBy(desc(inquiries.createdAt));
  }

  async getUserInquiries(userId: string): Promise<Inquiry[]> {
    return await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.userId, userId))
      .orderBy(desc(inquiries.createdAt));
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined> {
    const [updatedInquiry] = await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return updatedInquiry;
  }

  // Search history operations
  async addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory> {
    const [newSearch] = await db
      .insert(searchHistory)
      .values(search)
      .returning();
    return newSearch;
  }

  async getUserSearchHistory(userId: string, limit = 10): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
  }

  // Analytics operations
  async getAnalytics(): Promise<{
    totalProperties: number;
    totalUsers: number;
    totalViews: number;
    totalInquiries: number;
  }> {
    const [propertiesCount] = await db.select({ count: count() }).from(properties);
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [viewsSum] = await db.select({ sum: sql<number>`sum(${properties.views})` }).from(properties);
    const [inquiriesCount] = await db.select({ count: count() }).from(inquiries);

    return {
      totalProperties: propertiesCount.count,
      totalUsers: usersCount.count,
      totalViews: viewsSum.sum || 0,
      totalInquiries: inquiriesCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
