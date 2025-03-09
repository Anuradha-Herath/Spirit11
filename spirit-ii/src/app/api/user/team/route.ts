import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler to fetch user's team
export async function GET(req: Request) {
  try {
    // Get username from authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const username = authHeader.replace('Bearer ', '');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user's team
    const teams = db.collection('teams');
    const team = await teams.findOne({ username });
    
    if (!team) {
      // If no team exists yet, return an empty team
      return NextResponse.json({ 
        username,
        players: [],
        budget_remaining: 90000000
      });
    }
    
    // Populate player details if the team has players
    if (team.players && team.players.length > 0) {
      // Get player IDs
      const playerIds = team.players.map((playerId: string | ObjectId) => {
        try {
          return new ObjectId(playerId);
        } catch (e) {
          return playerId;
        }
      });
      
      // Fetch players
      const players = db.collection('players');
      const playerDetails = await players.find({
        _id: { $in: playerIds }
      }).toArray();
      
      // Map player details to include ID in consistent format
      const formattedPlayers = playerDetails.map(player => ({
        ...player,
        id: player._id.toString()
      }));
      
      // Return team with player details
      return NextResponse.json({
        ...team,
        players: formattedPlayers
      });
    }
    
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching user team:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST handler to save/update the entire team
export async function POST(req: Request) {
  try {
    // Get username from authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const username = authHeader.replace('Bearer ', '');
    
    // Get request body
    const body = await req.json();
    const { players, budget_remaining } = body;
    
    if (!players || !Array.isArray(players)) {
      return NextResponse.json(
        { message: 'Invalid team data. Players array required.' },
        { status: 400 }
      );
    }
    
    // Validate team size (maximum 11 players)
    if (players.length > 11) {
      return NextResponse.json(
        { message: 'Team cannot have more than 11 players' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const teams = db.collection('teams');
    
    // Update or create team
    const result = await teams.updateOne(
      { username },
      { 
        $set: {
          players: players.map((player: any) => player.id || player._id || player),
          budget_remaining: budget_remaining || 0,
          updatedAt: new Date()
        },
        $setOnInsert: {
          username,
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({
      message: 'Team updated successfully',
      players: players.length,
      budget_remaining
    });
  } catch (error) {
    console.error('Error updating user team:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
