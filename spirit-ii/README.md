# SpiritII - Fantasy Cricket Platform

## Overview
SpiritII is a fantasy cricket platform designed to provide an engaging experience for cricket enthusiasts. The platform includes an Admin Panel for managing players and tournaments, a User Interface for team selection and leaderboard tracking, and an AI Chatbot named Spiriter to assist users with queries and suggestions.

## Features

### Admin Panel
- **Players View**: Manage player data with CRUD operations for new players while ensuring existing players remain immutable.
- **Player Stats View**: Dynamically calculate and display player statistics, including points and values based on performance metrics.
- **Tournament Summary**: Aggregate statistics such as total runs, wickets, top scorers, and top wicket-takers.
- **Real-Time Sync**: Utilize WebSockets or SWR/React Query for instant UI updates without page refreshes.

### User Interface
- **Authentication**: Secure signup and login processes using JWT stored in HTTP-only cookies.
- **Team Selection**: Users can draft a team of 11 players within a budget of Rs. 9,000,000, with real-time budget tracking.
- **Leaderboard**: Display user rankings based on total team points, highlighting the logged-in user.
- **Responsive Design**: Fully optimized for both mobile and desktop views using Tailwind CSS.

### AI Chatbot (Spiriter)
- **Player Queries**: Answer user questions about player statistics while maintaining data privacy for sensitive information.
- **Team Suggestions**: Provide recommendations for the highest-point team of 11 players based on available data.
- **Fallback Responses**: Handle unknown queries gracefully with appropriate fallback messages.

## Backend & Database
- **MongoDB Schemas**: Define models for players and users, ensuring data integrity and security.
- **Security**: Implement role-based access control for admin routes and JWT middleware for protected API endpoints.

## Dataset Integration
- **Preprocessing Script**: A script to convert and import player data from CSV files into MongoDB, ensuring all necessary calculations are performed.
- **Test Account**: 
  - Username: spiritx_2025
  - Password: SpiritX@2025
  - Team: [Danushka Kumara, Jeewan Thirimanne, ...]

## Getting Started
1. Clone the repository:
   ```
   git clone <repository-url>
   cd spirit-ii
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` and configure your MongoDB connection.
4. Run the development server:
   ```
   npm run dev
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.