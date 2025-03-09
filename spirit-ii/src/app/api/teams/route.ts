import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/database';
import { Team } from '../../../models/Team';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const teams = await Team.find({});
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams' });
    }
  } else if (req.method === 'POST') {
    try {
      const newTeam = new Team(req.body);
      await newTeam.save();
      res.status(201).json(newTeam);
    } catch (error) {
      res.status(400).json({ message: 'Error creating team' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}