# Spirit11 - Fantasy Cricket Platform

## Overview
Spirit11 is a fantasy cricket platform designed for university cricket tournaments. It allows users to create their dream team of university cricket players, compete with friends, and track performance through leaderboards.

![Spirit11 Logo](https://via.placeholder.com/300?text=Spirit11+Logo)

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup & Installation](#setup--installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Assumptions Made During Development](#assumptions-made-during-development)
- [Additional Features](#additional-features)
- [API Documentation](#api-documentation)
- [Known Issues](#known-issues)
- [License](#license)

## Features

### User Features
- **User Authentication**: Sign up, login, and profile management
- **Team Selection**: Build your fantasy team with a fixed budget
- **Real-time Scores**: Track player and team performance during matches
- **Leaderboards**: Compare your performance with other users
- **Responsive Design**: Fully optimized for both mobile and desktop views

### Admin Panel
- **Player Management**: Add, edit, and manage player profiles and statistics
- **Tournament Control**: Set up and manage tournaments, matches, and statistics
- **Real-time Updates**: Push live updates for player performance and match results

## Technology Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Authentication**: Custom JWT implementation
- **Deployment**: Vercel (recommended)

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/your-username/spirit11.git
cd spirit11
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables (see Environment Variables section below)

## Database Setup

### Option 1: Use provided database dump (Recommended)
1. Ensure MongoDB is installed and running on your machine
2. Import the database dump:
```bash
mongorestore --db spirit11 ./database_dump/spirit11
```

### Option 2: Automatic setup
The application includes an automatic setup script that will populate the database with essential data:

1. Start the application
2. Visit the following URL in your browser:
