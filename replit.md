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