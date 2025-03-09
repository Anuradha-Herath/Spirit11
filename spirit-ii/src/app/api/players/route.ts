import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/database';
import Player from '../../../models/Player';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const players = await Player.find({ readOnly: false });
      res.status(200).json(players);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching players' });
    }
  } else if (req.method === 'POST') {
    try {
      const newPlayer = new Player(req.body);
      await newPlayer.save();
      res.status(201).json(newPlayer);
    } catch (error) {
      res.status(400).json({ message: 'Error creating player' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}