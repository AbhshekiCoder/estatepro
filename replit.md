# Overview

This is a full-stack real estate application built with React, Express.js, and PostgreSQL. The application provides a comprehensive property marketplace with user authentication, property search and filtering, favorites management, and inquiry handling. It features a modern responsive design using shadcn/ui components and Tailwind CSS, with separate interfaces for regular users and administrators.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a component-based architecture. The application uses Wouter for client-side routing, providing a lightweight alternative to React Router. State management is handled through TanStack Query (React Query) for server state and local React state for UI components. The UI is built with shadcn/ui components styled with Tailwind CSS, providing a consistent and modern design system.

## Backend Architecture
The server follows a RESTful API design pattern using Express.js with TypeScript. The application implements a clean separation of concerns with dedicated modules for database operations (storage layer), route handling, and authentication middleware. All API endpoints are organized under the `/api` prefix and include comprehensive error handling and request logging.

## Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, properties, favorites, inquiries, search history, and sessions. Property data includes comprehensive fields for real estate listings including images, features, and location details. The schema supports advanced search and filtering capabilities through indexed fields.

## Authentication System
Authentication is implemented using Replit's OpenID Connect (OIDC) integration with Passport.js. User sessions are stored in PostgreSQL using connect-pg-simple for persistence across server restarts. The system includes middleware for protecting authenticated routes and role-based access control for admin features.

## Property Management
Properties support multiple types (house, condo, townhome, etc.) with rich metadata including price, location, bedrooms, bathrooms, square footage, and custom features. Images are stored as URL arrays, and properties can be marked as featured. The system includes view tracking and comprehensive search capabilities with filters for price range, property type, size, and location.

## Search and Discovery
The application implements advanced search functionality with multiple filter options including price range, property type, size specifications, and text-based queries. Search results support pagination and sorting by various criteria. Users can save search history for easy access to previous queries.

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL database using `@neondatabase/serverless` driver
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication
- **Replit Auth**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware with OpenID Client strategy
- **Express Session**: Session management with PostgreSQL storage

## UI Framework
- **shadcn/ui**: Complete UI component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety and enhanced developer experience
- **ESBuild**: Fast bundling for production builds
- **TanStack Query**: Server state management and caching