# JEE Aspirant Task Management App

## Project Overview
A feature-rich, animated task management app designed specifically for JEE aspirants. The app helps students organize their study time with subject-wise task management, important links, and time tracking capabilities.

## Key Features
- Subject-wise task organization
- Time tracking and management
- Important links section
- Responsive design with animations
- Local storage for data persistence
- Modern UI with dark/light themes

## Project Architecture
- **Frontend**: React with Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with in-memory storage (MemStorage)
- **Data Storage**: Local storage for persistence
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations

## User Preferences
- Data should be stored in local storage
- Wants a stylish, animated, and responsive design
- Requires features for JEE aspirants specifically
- User name should be collected and stored locally
- Personalized experience with user's name throughout the app

## Recent Changes
- Initial project setup (August 26, 2025)
- Created comprehensive data model for tasks, subjects, and links
- Implemented local storage persistence
- Added tabbed interface with separate sections (August 26, 2025):
  - Dashboard: Overview with stats, subject progress, and quick actions
  - Tasks: Full task management with filtering and search
  - Subjects: Subject-wise progress tracking and task organization
  - Resources: Study material links and resource management
  - Timer: Study timer with presets and session tracking
- Added user profile system with welcome modal (August 26, 2025):
  - Collects user's real name on first visit
  - Stores user preferences in local storage
  - Personalizes dashboard and timer with user's name
  - User profile management with preferences
- Added theme system with dark/light mode toggle (August 26, 2025):
  - Theme provider with localStorage persistence
  - Theme toggle button in header
  - Full dark mode support with proper color schemes
  - Enhanced responsive design across all components
  - Improved styling with semantic color tokens
- Enhanced UI with icons and animations (August 26, 2025):
  - Replaced all emojis with proper Lucide React icons for better visual consistency
  - Added smooth hover animations and transitions throughout the app
  - Enhanced progress cards with gradient overlays and interactive effects
  - Improved header with backdrop blur and animated elements
  - Added comprehensive keyframe animations for better user experience
  - Enhanced tab navigation with scale and transform effects
- Fixed resources functionality with local storage and custom popups (August 26, 2025):
  - Implemented full CRUD operations for resources with local storage persistence
  - Created custom ConfirmationDialog component for deletion confirmations
  - Fixed popup/modal issues with proper state management
  - Enhanced resource management with user-friendly confirmation dialogs
  - Improved theme consistency throughout the resources section
  - Added proper toast notifications for user feedback