# Pureza de Piel Spa Website

## Overview

This is a full-stack web application for Pureza de Piel, a spa business located in Quibdó, Colombia. The application serves as both a customer-facing website showcasing spa services and an administrative dashboard for managing business operations. Built with modern web technologies, it features a responsive design optimized for the spa industry with elegant styling and smooth user interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using React with TypeScript, leveraging Vite for development and build tooling. The architecture follows a component-based structure with the following key decisions:

- **React Router**: Uses Wouter for lightweight client-side routing with two main routes (home and admin)
- **State Management**: Utilizes TanStack Query for server state management and caching, eliminating the need for complex state management libraries
- **UI Framework**: Implements shadcn/ui components built on top of Radix UI primitives for accessibility and consistency
- **Styling**: Uses Tailwind CSS with custom CSS variables for theming, featuring a spa-specific color palette (greens and earth tones)
- **Form Handling**: Employs React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The server-side follows a RESTful API pattern built with Express.js and TypeScript:

- **API Design**: RESTful endpoints for all resources (services, appointments, testimonials, gallery, contact messages, newsletter)
- **Data Layer**: Implements an abstraction layer (IStorage interface) for database operations, allowing for easy switching between storage implementations
- **Validation**: Uses Zod schemas for runtime type validation of API requests
- **Development Setup**: Integrates Vite middleware for seamless development experience with hot module replacement

### Database Design
Uses Drizzle ORM with PostgreSQL for data persistence:

- **Schema Design**: Well-structured relational database with tables for services, appointments, testimonials, gallery images, contact messages, and newsletter subscribers
- **Type Safety**: Leverages Drizzle's TypeScript integration for compile-time type safety
- **Migrations**: Configured for database schema versioning and deployment

### Component Organization
The application is organized into logical component categories:

- **Page Components**: Home and Admin pages serving as route containers
- **Feature Components**: Services, Gallery, Testimonials, Contact, Newsletter sections
- **Admin Components**: Separate management interfaces for each business entity
- **UI Components**: Reusable shadcn/ui components for consistent design
- **Layout Components**: Navigation, Footer, and structural elements

### Authentication & Authorization
While not currently implemented, the architecture supports future authentication integration with the admin panel structure already in place.

### Responsive Design Strategy
The application uses a mobile-first approach with Tailwind's responsive utilities, ensuring optimal viewing across all device sizes. Special attention is paid to spa industry aesthetics with smooth animations and elegant typography.

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database using Neon Database service for cloud hosting
- **Drizzle ORM**: Type-safe database operations with automatic TypeScript integration
- **Drizzle Kit**: Database migration and schema management tools

### Frontend Libraries
- **React**: Core UI library with TypeScript support
- **TanStack Query**: Server state management and caching solution
- **Wouter**: Lightweight routing library for single-page application navigation
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Runtime type validation and schema definition

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Modern icon library for consistent iconography
- **Font Awesome**: Additional icons for social media and spa-specific elements

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking for improved code quality
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Fonts & Assets
- **Google Fonts**: Montserrat for body text and Playfair Display for headings
- **Unsplash**: High-quality stock images for spa services and ambiance

### Communication & Marketing
- **WhatsApp Business API**: Direct customer communication integration
- **Email Newsletter**: Subscription management for marketing campaigns

The architecture prioritizes performance, maintainability, and scalability while providing an elegant user experience appropriate for a premium spa business.