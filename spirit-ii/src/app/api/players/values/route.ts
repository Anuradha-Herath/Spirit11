import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { calculatePlayerValue } from '@/utils/playerCalculations';

export async function POST(req: Request) {
  try {
    // Get request body containing player IDs
    const body = await req.json();
    const { playerIds } = body;
    
    if (!playerIds || !Array.isArray(playerIds)) {
      return NextResponse.json(
        { message: 'Invalid request. Expected array of playerIds.' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    // Create queries for each player ID
    const queries = playerIds.map(id => {
      try {
        return { _id: new ObjectId(id) };
      } catch (e) {
        return { id: id };
      }
    });
    
    // Fetch all requested players
    const players = await collection.find({
      $or: queries
    }).toArray();
    
    // Calculate values for each player
    const values: Record<string, number> = {};
    
    players.forEach(player => {
      const id = player._id.toString();
      // Use the player's budget value if available, otherwise calculate it
      const value = player.budget 
        ? player.budget * 100000000 
        : calculatePlayerValue(player);
      
      values[id] = value;
      // Also store using the string ID if it exists
      if (player.id && player.id !== id) {
        values[player.id] = value;
      }
    });
    
    // Return the values
    return NextResponse.json({ values });
  } catch (error) {
    console.error('Error fetching player values:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
