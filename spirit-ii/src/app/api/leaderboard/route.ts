import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface LeaderboardEntry {
  username: string;
  points: number;
  rank?: number;
}

export async function GET(req: Request) {
  try {
    // Check for authentication header (optional for leaderboard)
    const authHeader = req.headers.get('authorization');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    try {
      // Get leaderboard collection
      const leaderboardCollection = db.collection('leaderboard');
      
      // Query users sorted by points (descending)
      let leaderboardData = await leaderboardCollection.find({})
        .sort({ points: -1 })
        .toArray();
      
      // If no data found, return mock data or empty array
      if (!leaderboardData || leaderboardData.length === 0) {
        console.log('No leaderboard data found in database, returning mock data');
        return NextResponse.json(getMockLeaderboard());
      }
      
      // Add rank to each user based on position in sorted array
      const rankedLeaderboard = leaderboardData.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
      
      return NextResponse.json(rankedLeaderboard);
      
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      // Return mock data as fallback
      return NextResponse.json(getMockLeaderboard());
    }
    
  } catch (error) {
    console.error('Error in leaderboard API route:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Mock leaderboard data for fallback
function getMockLeaderboard(): LeaderboardEntry[] {
  const mockUsers = [
    { username: "spiritx_2025", points: 754, rank: 1 },
    { username: "cricket_master", points: 823, rank: 2 },
    { username: "fantasy_king", points: 711, rank: 3 },
    { username: "team_selector", points: 688, rank: 4 },
    { username: "game_player", points: 645, rank: 5 },
    { username: "runs_hunter", points: 912, rank: 6 },
    { username: "pitch_expert", points: 876, rank: 7 },
    { username: "boundary_hitter", points: 792, rank: 8 },
    { username: "bowling_wizard", points: 834, rank: 9 },
    { username: "wicket_taker", points: 745, rank: 10 }
  ];
  
  // Sort by points and add rank
  return mockUsers
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));
}
