import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the user has admin rights (implement proper auth middleware in production)
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid player ID format' });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('players');
    
    // Check if valid ObjectId
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }

    // GET - Fetch a single player
    if (req.method === 'GET') {
      const player = await collection.findOne({ _id: objectId });
      
      if (!player) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      return res.status(200).json(player);
    }

    // PUT - Update a player
    if (req.method === 'PUT') {
      const playerData = req.body;
      
      // Add updated timestamp
      playerData.updatedAt = new Date();
      
      const result = await collection.updateOne(
        { _id: objectId },
        { $set: playerData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      const updatedPlayer = await collection.findOne({ _id: objectId });
      return res.status(200).json(updatedPlayer);
    }

    // DELETE - Remove a player
    if (req.method === 'DELETE') {
      const result = await collection.deleteOne({ _id: objectId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Player not found' });
      }
      
      return res.status(200).json({ message: 'Player deleted successfully' });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Error handling player request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
