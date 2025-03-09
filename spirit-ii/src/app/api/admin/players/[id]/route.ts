import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler for fetching a specific player
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    console.log('Fetching player with ID:', id);
    
    // Handle different ID formats
    let query;
    
    // Try to treat as MongoDB ObjectId
    try {
      const objectId = new ObjectId(id);
      query = { _id: objectId };
      console.log('Using ObjectId query:', query);
    } catch (error) {
      // If not a valid ObjectId, try as a string ID
      console.log('Not a valid ObjectId, using string ID');
      query = { id: id };
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    // Find player by ID
    console.log('Running database query:', query);
    const player = await collection.findOne(query);
    
    if (!player) {
      console.log('Player not found for query:', query);
      // Fall back to searching by any ID field
      console.log('Trying alternative query with $or');
      const fallbackPlayer = await collection.findOne({
        $or: [
          { _id: id.length === 24 ? new ObjectId(id) : id },
          { id: id }
        ]
      });
      
      if (!fallbackPlayer) {
        console.log('Player not found after fallback query');
        return NextResponse.json({ message: 'Player not found' }, { status: 404 });
      }
      
      console.log('Player found with fallback query');
      
      // Convert MongoDB _id to id for frontend compatibility
      const formattedPlayer = {
        ...fallbackPlayer,
        id: fallbackPlayer._id.toString()
      };
      
      return NextResponse.json(formattedPlayer);
    }
    
    console.log('Player found:', player._id);
    
    // Convert MongoDB _id to id for frontend compatibility
    const formattedPlayer = {
      ...player,
      id: player._id.toString()
    };
    
    return NextResponse.json(formattedPlayer);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT handler for updating a player
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    console.log('Updating player with ID:', id);
    
    // Handle different ID formats
    let query;
    let objectId;
    
    // Try to treat as MongoDB ObjectId
    try {
      objectId = new ObjectId(id);
      query = { _id: objectId };
      console.log('Using ObjectId query:', query);
    } catch (error) {
      // If not a valid ObjectId, try as a string ID
      console.log('Not a valid ObjectId, using string ID');
      query = { id: id };
    }

    // Get request body
    const playerData = await req.json();
    console.log('Update data received:', playerData);
    
    // Remove id and _id fields from the update data to prevent conflicts
    const updateData = { ...playerData };
    delete updateData._id;
    delete updateData.id;
    
    // Add updated timestamp
    updateData.updatedAt = new Date();

    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    // First, find the player to make sure it exists
    const existingPlayer = await collection.findOne(query);
    
    if (!existingPlayer) {
      // Try alternative query if initial query fails
      console.log('Player not found with primary query, trying fallback');
      const fallbackQuery = {
        $or: [
          { _id: id.length === 24 ? new ObjectId(id) : id },
          { id: id }
        ]
      };
      
      const fallbackPlayer = await collection.findOne(fallbackQuery);
      
      if (!fallbackPlayer) {
        console.log('Player not found after fallback query');
        return NextResponse.json({ message: 'Player not found' }, { status: 404 });
      }
      
      // Update using the fallback ID
      console.log('Using fallback ID for update');
      objectId = fallbackPlayer._id;
      query = { _id: objectId };
    } else {
      console.log('Player found, proceeding with update');
    }
    
    // Update player
    const result = await collection.updateOne(
      query,
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      console.log('Update failed: no matching document');
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }
    
    console.log('Update successful, fetching updated player');
    
    // Get updated player
    const updatedPlayer = await collection.findOne(query);
    
    if (!updatedPlayer) {
      console.log('Could not retrieve updated player');
      return NextResponse.json({ message: 'Player updated but could not retrieve' }, { status: 500 });
    }
    
    // Convert MongoDB _id to id for frontend compatibility
    const formattedPlayer = {
      ...updatedPlayer,
      id: updatedPlayer._id.toString()
    };
    
    return NextResponse.json(formattedPlayer);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'  
    }, { status: 500 });
  }
}

// DELETE handler for removing a player
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Check if valid ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid player ID' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    // Delete player
    const result = await collection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Player not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
