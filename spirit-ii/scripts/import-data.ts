import fs from 'fs';
import csvParser from 'csv-parser';
import mongoose from 'mongoose';
import { Player } from '../src/models/Player';

const MONGODB_URI = process.env.MONGODB_URI || 'your_mongodb_connection_string';

async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
}

async function importData() {
    const players: any[] = [];

    fs.createReadStream('sample_data.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            const totalBallsBowled = row.OversBowled * 6;
            const readOnly = true; // All preloaded players are read-only

            players.push({
                name: row.Name,
                university: row.University,
                category: row.Category,
                totalRuns: parseInt(row.TotalRuns, 10),
                ballsFaced: parseInt(row.BallsFaced, 10),
                wickets: parseInt(row.Wickets, 10),
                oversBowled: totalBallsBowled,
                runsConceded: parseInt(row.RunsConceded, 10),
                points: 0, // Will be calculated later
                value: 0, // Will be calculated later
                readOnly,
            });
        })
        .on('end', async () => {
            await connectToDatabase();
            await Player.insertMany(players);
            console.log('Data imported successfully!');
            mongoose.connection.close();
        })
        .on('error', (error) => {
            console.error('Error reading the CSV file:', error);
        });
}

importData();