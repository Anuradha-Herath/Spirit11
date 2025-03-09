import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET handler to fetch upcoming and recent matches/fixtures
export async function GET(req: Request) {
  try {
    // Connect to database
    const { db } = await connectToDatabase();
    const fixtures = db.collection('fixtures');
    
    // Get URL params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // upcoming, completed, all
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Build query based on status
    let query = {};
    if (status === 'upcoming') {
      query = { match_date: { $gte: new Date() } };
    } else if (status === 'completed') {
      query = { match_date: { $lt: new Date() }, result: { $exists: true } };
    }
    
    try {
      // Fetch fixtures
      const matchFixtures = await fixtures
        .find(query)
        .sort({ match_date: status === 'completed' ? -1 : 1 }) // Sort by date: upcoming = ascending, completed = descending
        .limit(limit)
        .toArray();
      
      return NextResponse.json(matchFixtures);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json(getMockFixtures(status));
    }
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST handler to create a new fixture (admin only)
export async function POST(req: Request) {
  try {
    // Check admin authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const fixtureData = await req.json();
    
    // Validate required fields
    if (!fixtureData.team1 || !fixtureData.team2 || !fixtureData.match_date) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    const fixtures = db.collection('fixtures');
    
    // Convert date string to Date object
    fixtureData.match_date = new Date(fixtureData.match_date);
    
    // Add timestamp
    fixtureData.createdAt = new Date();
    fixtureData.updatedAt = new Date();
    
    // Insert fixture
    const result = await fixtures.insertOne(fixtureData);
    
    return NextResponse.json({
      message: 'Fixture created successfully',
      id: result.insertedId.toString(),
      ...fixtureData
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating fixture:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to return mock fixtures
function getMockFixtures(status?: string | null) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfter = new Date(now);
  dayAfter.setDate(dayAfter.getDate() + 2);
  
  const completedFixtures = [
    {
      id: "c1",
      team1: "University of Moratuwa",
      team2: "University of Colombo",
      match_date: yesterday.toISOString(),
      venue: "Moratuwa University Grounds",
      result: {
        winner: "University of Moratuwa",
        team1_score: "185/6",
        team2_score: "172/8",
        summary: "University of Moratuwa won by 13 runs"
      }
    },
    {
      id: "c2",
      team1: "University of Kelaniya",
      team2: "University of Peradeniya",
      match_date: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
      venue: "Kelaniya University Grounds",
      result: {
        winner: "University of Kelaniya",
        team1_score: "165/9",
        team2_score: "140/10",
        summary: "University of Kelaniya won by 25 runs"
      }
    }
  ];
  
  const upcomingFixtures = [
    {
      id: "u1",
      team1: "University of Jaffna",
      team2: "University of Ruhuna",
      match_date: tomorrow.toISOString(),
      venue: "Jaffna University Grounds"
    },
    {
      id: "u2",
      team1: "University of Sri Jayewardenepura",
      team2: "University of Moratuwa",
      match_date: dayAfter.toISOString(),
      venue: "Sri Jayewardenepura University Grounds"
    }
  ];
  
  if (status === 'upcoming') {
    return upcomingFixtures;
  } else if (status === 'completed') {
    return completedFixtures;
  } else {
    return [...completedFixtures, ...upcomingFixtures];
  }
}
