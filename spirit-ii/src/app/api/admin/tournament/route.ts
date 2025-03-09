import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface TournamentStats {
  type: string;
  total_matches: number;
  total_runs: number;
  total_wickets: number;
  highest_score: number;
  average_runs_per_match: number;
  average_wickets_per_match: number;
  completed_percentage: number;
  upcoming_matches: number;
  participating_universities: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET handler for fetching tournament stats
export async function GET(req: Request) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('tournament');
    
    // Get tournament stats or create default if none exists
    let tournamentStats = await collection.findOne({ type: 'stats' });
    
    if (!tournamentStats) {
      // Create default stats
      const defaultStats: TournamentStats = {
        type: 'stats',
        total_matches: 15,
        total_runs: 5430,
        total_wickets: 162,
        highest_score: 105,
        average_runs_per_match: 362,
        average_wickets_per_match: 10.8,
        completed_percentage: 60,
        upcoming_matches: 10,
        participating_universities: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await collection.insertOne(defaultStats);
      tournamentStats = defaultStats as any;
    }
    
    return NextResponse.json(tournamentStats);
  } catch (error) {
    console.error('Error fetching tournament stats:', error);
    
    // Return mock data as fallback
    const mockStats = {
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
    };
    
    return NextResponse.json(mockStats);
  }
}

// PUT handler for updating tournament stats
export async function PUT(req: Request) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const updateData = await req.json();
    
    // Add updated timestamp
    updateData.updatedAt = new Date();

    const { db } = await connectToDatabase();
    const collection = db.collection('tournament');
    
    // Update tournament stats (or insert if not exists)
    await collection.updateOne(
      { type: 'stats' },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
    
    // Get updated tournament stats
    const updatedStats = await collection.findOne({ type: 'stats' });
    
    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error('Error updating tournament stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
