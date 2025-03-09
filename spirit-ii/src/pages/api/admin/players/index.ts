import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Player {
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
    const collection = db.collection('players');

    // GET - Fetch all players
    if (req.method === 'GET') {
      const players = await collection.find({}).toArray();
      return res.status(200).json(players);
    }

    // POST - Create new player
    if (req.method === 'POST') {
      const player = req.body as Player;
      
      // Validate required fields
      if (!player.name || !player.university || !player.role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Add timestamps
      player.createdAt = new Date();
      player.updatedAt = new Date();

      const result = await collection.insertOne(player);
      return res.status(201).json({ 
        ...player,
        _id: result.insertedId 
      });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error handling player request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
