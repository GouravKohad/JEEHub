# Overview

This is a comprehensive study management application built with React and Express, designed to help students organize their academic work across Physics, Chemistry, and Mathematics subjects. The application provides task management, file storage, performance tracking, and study session timing capabilities in a modern, responsive interface.

The system follows a full-stack architecture with a React frontend using shadcn/ui components, an Express.js backend with REST API endpoints, and PostgreSQL database integration through Drizzle ORM for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with React and TypeScript, utilizing a component-based architecture with the following key patterns:

- **UI Framework**: shadcn/ui components built on Radix UI primitives for consistent, accessible interface elements
- **Styling**: Tailwind CSS with custom design tokens for theming and responsive design
- **State Management**: TanStack Query for server state management and caching, with React hooks for local state
- **Routing**: Wouter for lightweight client-side routing between dashboard, tasks, files, performance, and timer pages
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The application supports both light and dark themes with system preference detection, and includes a responsive sidebar navigation with subject-specific color coding.

## Backend Architecture

The server follows RESTful API principles with Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints organized by resource type (tasks, files, study sessions, performance)
- **File Handling**: Multer middleware for file uploads with size limits and validation
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Development Tools**: Vite integration for hot module replacement during development

The storage layer uses an interface-based approach, currently implemented with in-memory storage but designed for easy migration to database persistence.

## Data Storage Solutions

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in TypeScript with Zod validation
- **Migration System**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless PostgreSQL instance

**Data Models**:
- Users with authentication credentials
- Tasks with subject categorization, priority levels, and completion tracking
- Files with metadata and subject association
- Study sessions with duration tracking per subject
- Performance metrics aggregating task completion and study time

## Authentication and Authorization

Currently implements a basic user system with:
- User registration and login capabilities
- Session-based authentication (prepared for PostgreSQL session storage)
- User-specific data isolation

The system is prepared for more robust authentication mechanisms with session management infrastructure already in place.

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Backend web framework for Node.js
- **TypeScript**: Type safety across the entire application stack

## Database and ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with schema management
- **Neon Database**: Serverless PostgreSQL hosting for production deployment
- **Drizzle Kit**: Migration and schema management tools

## UI and Styling
- **shadcn/ui**: Pre-built React components based on Radix UI primitives
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for forms and API data

## Development and Build Tools
- **Vite**: Fast development server and build tool with HMR
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## File Handling and Utilities
- **Multer**: File upload middleware for Express
- **React Dropzone**: Drag-and-drop file upload interface
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing library for React

## Development Environment
- **Replit Integration**: Platform-specific tooling for cloud development
- **TSX**: TypeScript execution for development server
- **Connect-pg-simple**: PostgreSQL session store for Express sessions