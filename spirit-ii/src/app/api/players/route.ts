import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    // Connect to database
    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    try {
      // Fetch all players
      const players = await collection.find({}).toArray();
      
      // Convert MongoDB _id to id for frontend compatibility
      const formattedPlayers = players.map(player => ({
        ...player,
        id: player._id.toString()
      }));
      
      return NextResponse.json(formattedPlayers);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      
      // Return mock data as fallback
      return NextResponse.json(getMockPlayers());
    }
  } catch (error) {
    console.error('Error in players API route:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Mock player data for fallback
function getMockPlayers() {
  return [
    {
      id: "1",
      name: "Kasun Perera",
      university: "University of Moratuwa",
      role: "Batsman",
      budget: 10.5,
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
      budget: 9.2,
      image: "https://via.placeholder.com/150",
      matches: 20,
      runs: 120,
      wickets: 45,
    },
    {
      id: "3",
      name: "Nuwan Pradeep",
      university: "University of Peradeniya",
      role: "All-rounder",
      budget: 11.0,
      image: "https://via.placeholder.com/150",
      matches: 18,
      runs: 450,
      wickets: 30,
    },
    {
      id: "4",
      name: "Dinesh Chandimal",
      university: "University of Moratuwa",
      role: "Wicket Keeper",
      budget: 9.8,
      image: "https://via.placeholder.com/150",
      matches: 22,
      runs: 780,
      wickets: 0,
      stumping: 25,
      catches: 32,
    },
    {
      id: "5",
      name: "Lahiru Kumara",
      university: "University of Colombo",
      role: "Bowler",
      budget: 8.5,
      image: "https://via.placeholder.com/150",
      matches: 16,
      runs: 60,
      wickets: 38,
    },
    {
      id: "6",
      name: "Kusal Mendis",
      university: "University of Kelaniya",
      role: "Batsman",
      budget: 10.2,
      image: "https://via.placeholder.com/150",
      matches: 25,
      runs: 1150,
      wickets: 0,
    }
  ];
}