import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('tournament');
    
    // Get tournament stats
    let tournamentStats = await collection.findOne({ type: 'stats' });
    
    if (!tournamentStats) {
      // Return mock data if none exists in database
      return NextResponse.json({
        type: 'stats',
        total_matches: 15,
        total_runs: 5430,
        total_wickets: 162,
        highest_score: 105,
        average_runs_per_match: 362,
        average_wickets_per_match: 10.8,
        completed_percentage: 60,
        upcoming_matches: 10,
        participating_universities: 8
      });
    }
    
    return NextResponse.json(tournamentStats);
  } catch (error) {
    console.error('Error fetching tournament stats:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      type: 'stats',
      total_matches: 15,
      total_runs: 5430,
      total_wickets: 162,
      highest_score: 105,
      average_runs_per_match: 362,
      average_wickets_per_match: 10.8,
      completed_percentage: 60,
      upcoming_matches: 10,
      participating_universities: 8
    });
  }
}
