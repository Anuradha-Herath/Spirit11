import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define player interface
interface Player {
  id?: string;
  _id?: string | ObjectId;
  name: string;
  university: string;
  role: string;
  budget?: number;
  image?: string;
  age?: number;
  matches?: number;
  runs?: number;
  wickets?: number;
  batting_average?: number;
  batting_strike_rate?: number;
  high_score?: number;
  centuries?: number;
  fifties?: number;
  bowling_average?: number;
  economy?: number;
  stumping?: number;
  catches?: number;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// GET handler for fetching all players
export async function GET(req: Request) {
  try {
    // Check authentication (simple for demo)
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Database connected, fetching players');
    
    const collection = db.collection('players');
    
    // Try to fetch from database
    try {
      const players = await collection.find({}).toArray();
      console.log(`Found ${players.length} players`);
      
      // Convert MongoDB _id to id for frontend compatibility
      const formattedPlayers = players.map(player => ({
        ...player,
        id: player._id.toString()
      }));
      
      return NextResponse.json(formattedPlayers);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      
      // Since we're in development and building the app,
      // return mock data as a fallback so the app can keep working
      console.log('Returning mock data as fallback');
      return NextResponse.json(getMockPlayers());
    }
  } catch (error) {
    console.error('Error in players API route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler for creating a new player
export async function POST(req: Request) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const playerData: Player = await req.json();
    
    // Validate required fields
    if (!playerData.name || !playerData.university || !playerData.role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Add timestamps
    playerData.createdAt = new Date();
    playerData.updatedAt = new Date();

    const { db } = await connectToDatabase();
    const collection = db.collection('players');

    // Insert player into database
    const playerDataToInsert = { ...playerData, _id: playerData._id ? new ObjectId(playerData._id) : undefined };
    const result = await collection.insertOne(playerDataToInsert);
    const insertedId = result.insertedId.toString();

    return NextResponse.json({
      ...playerData,
      _id: insertedId,
      id: insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to return mock data
function getMockPlayers() {
  return [
    {
      id: "1",
      name: "Kasun Perera",
      university: "University of Moratuwa",
      role: "Batsman",
      image: "https://via.placeholder.com/150",
      matches: 24,
      runs: 1200,
      wickets: 0,
    },
    {
      id: "2",
      name: "Amal Silva",
      university: "University of Colombo",
      role: "Bowler",
      image: "https://via.placeholder.com/150",
      matches: 20,
      runs: 120,
      wickets: 45,
    },
    // Add the other mock players here
  ];
}
