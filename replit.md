# Deal or No Deal Game

## Overview

This is a modern web-based "Deal or No Deal" anniversary gift game built with React, TypeScript, and Node.js. The application features a complete game flow: welcome screen with prize preview, randomized envelope selection, cash-out decisions, and automatic final prize assignment. Designed specifically for anniversary gifts, it includes an admin panel for game configuration and envelope management with a beautiful pastel UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components with Radix UI primitives for consistent, accessible components
- **Styling**: Tailwind CSS with custom pastel color palette (coral, mint, sky, sage, warm-yellow, blush)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Animations**: Framer Motion for envelope flip animations and transitions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Design**: RESTful API endpoints with proper error handling and validation
- **Development**: Vite middleware integration for seamless full-stack development
- **Build System**: ESBuild for production server bundling

### Database Design
The schema includes four main entities:
- **gameConfigs**: Stores game settings (envelope count, max tries)
- **envelopes**: Contains prize information with position, text, and color
- **gameStates**: Enhanced to track game progress, selected envelopes, game start status, cash-out status, final prize, and shuffled order
- **users**: Legacy table maintained for compatibility

### Authentication & Authorization
Currently implements a basic system without complex authentication. The application assumes single-user access with admin panel access control managed at the route level.

### Component Architecture
- **Modular Design**: Reusable UI components following atomic design principles
- **Shared Components**: Envelope cards, confirmation modals, and navigation header
- **Page Components**: Separate pages for player mode, admin panel, and 404 handling
- **Custom Hooks**: Mobile detection and toast notifications for enhanced UX

### Game Logic
- **Welcome Screen**: Interactive welcome screen with prize preview and game name "Anniversary Surprise"
- **Prize Randomization**: Shuffles envelope positions when game starts to randomize prize distribution
- **State Management**: Server-side game state persistence with client-side optimistic updates
- **Envelope Selection**: Mutation-based envelope selection with immediate UI feedback
- **Cash-Out System**: "Deal or No Deal" decision after each envelope selection (except final)
- **Automatic Final Prize**: When all tries are exhausted, automatically assigns remaining prize
- **Game Completion**: Multiple completion paths - cash-out or final prize assignment
- **Reset Functionality**: Complete game reset returning to welcome screen

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database with WebSocket support
- **Drizzle ORM**: Type-safe database queries and migrations
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Radix UI**: Comprehensive primitive component library for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Framer Motion**: Animation library for smooth UI transitions

### State & Forms
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for runtime type safety

### Development Tools
- **Vite**: Fast build tool with HMR and development server
- **TypeScript**: Static type checking for enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment optimization for Replit platform