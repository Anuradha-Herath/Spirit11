import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface LeaderboardUpdate {
  username: string;
  points: number;
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const updateData: LeaderboardUpdate = await req.json();
    
    // Validate required fields
    if (!updateData.username || typeof updateData.points !== 'number') {
      return NextResponse.json({ message: 'Invalid update data' }, { status: 400 });
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const leaderboardCollection = db.collection('leaderboard');
    
    // Update or insert user score
    const result = await leaderboardCollection.updateOne(
      { username: updateData.username },
      { 
        $set: { 
          points: updateData.points,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
    
    // Get updated entry
    const updatedEntry = await leaderboardCollection.findOne({ username: updateData.username });
    
    return NextResponse.json({
      message: 'Leaderboard updated successfully',
      entry: updatedEntry
    });
    
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
