import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

interface TournamentStats {
  type: string;
  total_matches: number;
  total_runs: number;
  total_wickets: number;
  highest_score: number;
  average_runs_per_match: number;
  average_wickets_per_match: number;
  completed_percentage: number;
  upcoming_matches: number;
  participating_universities: number;
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the user has admin rights (implement proper auth middleware in production)
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('tournament');

    // GET - Fetch tournament stats
    if (req.method === 'GET') {
      // Get the single tournament document (or create default if none exists)
      let tournamentStats = await collection.findOne({ type: 'stats' });
      
      if (!tournamentStats) {
        // Create default stats if none exist
        const defaultStats: TournamentStats = {
          type: 'stats',
          total_matches: 0,
          total_runs: 0,
          total_wickets: 0,
          highest_score: 0,
          average_runs_per_match: 0,
          average_wickets_per_match: 0,
          completed_percentage: 0,
          upcoming_matches: 0,
          participating_universities: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await collection.insertOne(defaultStats);
        tournamentStats = defaultStats;
      }
      
      return res.status(200).json(tournamentStats);
    }

    // PUT - Update tournament stats
    if (req.method === 'PUT') {
      const updateData = req.body;
      
      // Add updated timestamp
      updateData.updatedAt = new Date();
      
      const result = await collection.updateOne(
        { type: 'stats' },
        { 
          $set: updateData,
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
      
      const updatedStats = await collection.findOne({ type: 'stats' });
      return res.status(200).json(updatedStats);
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error handling tournament request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
