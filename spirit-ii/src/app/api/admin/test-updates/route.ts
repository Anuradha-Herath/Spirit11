import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET handler to fetch test updates
export async function GET(req: Request) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const collection = db.collection('test_updates');
    
    // Fetch updates from database
    const updates = await collection.find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
    
    // Return the actual database updates (even if empty)
    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error in test-updates API route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to create a new test update
export async function POST(req: Request) {
  try {
    // Check authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get request body
    const updateData = await req.json();
    
    // Validate required fields
    if (!updateData.title || !updateData.message) {
      return NextResponse.json(
        { message: 'Missing required fields (title, message)' },
        { status: 400 }
      );
    }
    
    // Add timestamps
    updateData.timestamp = new Date();
    updateData.createdAt = new Date();
    
    // Connect to database
    const { db } = await connectToDatabase();
    const collection = db.collection('test_updates');
    
    // Insert update
    const result = await collection.insertOne(updateData);
    
    return NextResponse.json({
      ...updateData,
      id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating test update:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Helper function to generate mock updates
function getMockUpdates() {
  const now = new Date();
  
  return [
    {
      id: "1",
      title: "Player Statistics Updated",
      message: "Several player statistics have been updated based on recent match performance.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
      type: "stats"
    },
    {
      id: "2",
      title: "Tournament Progress",
      message: "Tournament has reached the 65% completion mark.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "tournament"
    },
    {
      id: "3",
      title: "New Player Added",
      message: "A new bowler from University of Ruhuna has been added to the player database.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5), // 5 hours ago
      type: "player"
    },
    {
      id: "4",
      title: "Match Results Updated",
      message: "Results and statistics from yesterday's match have been processed.",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
      type: "match"
    }
  ];
}
