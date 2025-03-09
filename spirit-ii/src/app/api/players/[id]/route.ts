import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Connect to database
    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    // Handle different ID formats
    let query;
    
    // Try to treat as MongoDB ObjectId
    try {
      const objectId = new ObjectId(id);
      query = { _id: objectId };
    } catch (error) {
      // If not a valid ObjectId, try as a string ID
      query = { id: id };
    }
    
    // Find player by ID
    const player = await collection.findOne(query);
    
    if (!player) {
      // Fall back to searching by any ID field
      const fallbackPlayer = await collection.findOne({
        $or: [
          { _id: id.length === 24 ? new ObjectId(id) : id },
          { id: id }
        ]
      });
      
      if (!fallbackPlayer) {
        return NextResponse.json({ message: 'Player not found' }, { status: 404 });
      }
      
      // Convert MongoDB _id to id for frontend compatibility
      const formattedPlayer = {
        ...fallbackPlayer,
        id: fallbackPlayer._id.toString()
      };
      
      return NextResponse.json(formattedPlayer);
    }
    
    // Convert MongoDB _id to id for frontend compatibility
    const formattedPlayer = {
      ...player,
      id: player._id.toString()
    };
    
    return NextResponse.json(formattedPlayer);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
