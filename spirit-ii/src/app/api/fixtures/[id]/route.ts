import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler to fetch a specific fixture
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Connect to database
    const { db } = await connectToDatabase();
    const fixtures = db.collection('fixtures');
    
    // Check if valid ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid fixture ID' }, { status: 400 });
    }
    
    // Find fixture by ID
    const fixture = await fixtures.findOne({ _id: objectId });
    
    if (!fixture) {
      return NextResponse.json({ message: 'Fixture not found' }, { status: 404 });
    }
    
    // Fetch player statistics for this fixture if available
    if (fixture.player_stats && fixture.player_stats.length > 0) {
      const playerIds = fixture.player_stats.map((stat: any) => {
        try {
          return new ObjectId(stat.player_id);
        } catch (e) {
          return stat.player_id;
        }
      });
      
      // Get player details
      const players = db.collection('players');
      const playerDetails = await players.find({
        _id: { $in: playerIds }
      }).toArray();
      
      // Map player details
      const playerMap = playerDetails.reduce((acc: any, player: any) => {
        acc[player._id.toString()] = player;
        return acc;
      }, {});
      
      // Add player details to stats
      fixture.player_stats = fixture.player_stats.map((stat: any) => {
        const player = playerMap[stat.player_id.toString()];
        return {
          ...stat,
          player_name: player ? player.name : 'Unknown Player',
          player_team: player ? player.university : 'Unknown Team'
        };
      });
    }
    
    return NextResponse.json(fixture);
  } catch (error) {
    console.error('Error fetching fixture:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT handler to update a fixture (admin only)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    // Get request body
    const updateData = await req.json();
    
    // Add updated timestamp
    updateData.updatedAt = new Date();
    
    // Convert match_date string to Date object if present
    if (updateData.match_date) {
      updateData.match_date = new Date(updateData.match_date);
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const fixtures = db.collection('fixtures');
    
    // Check if valid ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid fixture ID' }, { status: 400 });
    }
    
    // Update fixture
    const result = await fixtures.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Fixture not found' }, { status: 404 });
    }
    
    // Get updated fixture
    const updatedFixture = await fixtures.findOne({ _id: objectId });
    
    return NextResponse.json(updatedFixture);
  } catch (error) {
    console.error('Error updating fixture:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a fixture (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authorization
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
      return NextResponse.json({ message: 'Invalid fixture ID' }, { status: 400 });
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const fixtures = db.collection('fixtures');
    
    // Delete fixture
    const result = await fixtures.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Fixture not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Fixture deleted successfully' });
  } catch (error) {
    console.error('Error deleting fixture:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
