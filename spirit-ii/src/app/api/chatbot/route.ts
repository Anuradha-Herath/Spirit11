import { NextApiRequest, NextApiResponse } from 'next';
import { getPlayerStats, getTeamSuggestions } from '../../../lib/utils/chatbot';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        try {
            let response;

            if (query.toLowerCase().includes("average")) {
                response = await getPlayerStats(query);
            } else if (query.toLowerCase().includes("suggest team")) {
                response = await getTeamSuggestions();
            } else {
                response = "I don't have enough knowledge to answer that.";
            }

            return res.status(200).json({ response });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}