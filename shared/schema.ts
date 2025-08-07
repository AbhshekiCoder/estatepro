import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Property types enum
export const propertyTypeEnum = pgEnum("property_type", [
  "house",
  "condo",
  "townhome",
  "multi-family",
  "land",
  "commercial"
]);

// Property status enum
export const propertyStatusEnum = pgEnum("property_status", [
  "for-sale",
  "for-rent",
  "sold",
  "rented",
  "pending",
  "off-market"
]);

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  address: varchar("address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
  sqft: integer("sqft"),
  lotSize: decimal("lot_size", { precision: 8, scale: 2 }),
  yearBuilt: integer("year_built"),
  propertyType: propertyTypeEnum("property_type").notNull(),
  status: propertyStatusEnum("status").default("for-sale"),
  featured: boolean("featured").default(false),
  images: text("images").array().default([]),
  features: text("features").array().default([]),
  agentId: varchar("agent_id").references(() => users.id),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorites table
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  propertyId: varchar("property_id").references(() => properties.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property inquiries table
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  message: text("message").notNull(),
  inquiryType: varchar("inquiry_type").default("general"), // general, viewing, more-info
  status: varchar("status").default("new"), // new, contacted, closed
  createdAt: timestamp("created_at").defaultNow(),
});

// Search history table
export const searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  query: varchar("query").notNull(),
  filters: jsonb("filters"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  favorites: many(favorites),
  inquiries: many(inquiries),
  searchHistory: many(searchHistory),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(users, {
    fields: [properties.agentId],
    references: [users.id],
  }),
  favorites: many(favorites),
  inquiries: many(inquiries),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [favorites.propertyId],
    references: [properties.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  property: one(properties, {
    fields: [inquiries.propertyId],
    references: [properties.id],
  }),
  user: one(users, {
    fields: [inquiries.userId],
    references: [users.id],
  }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  views: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true,
});

// Property search schema
export const propertySearchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  propertyType: z.enum(["house", "condo", "townhome", "multi-family", "land", "commercial"]).optional(),
  status: z.enum(["for-sale", "for-rent", "sold", "rented", "pending", "off-market"]).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minBedrooms: z.number().optional(),
  maxBedrooms: z.number().optional(),
  minBathrooms: z.number().optional(),
  maxBathrooms: z.number().optional(),
  minSqft: z.number().optional(),
  maxSqft: z.number().optional(),
  featured: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
  sortBy: z.enum(["price", "createdAt", "views", "sqft"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type PropertySearch = z.infer<typeof propertySearchSchema>;
