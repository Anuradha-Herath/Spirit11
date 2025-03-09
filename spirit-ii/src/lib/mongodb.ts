import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anuradhaanupamaherath:IZwWLlTR14eUUMMY@cluster0.wcqmx.mongodb.net/spiritii';
// Hardcode the database name for now to avoid URL parsing issues
const DB_NAME = 'spiritii';

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  // For debugging
  console.log('Attempting to connect to MongoDB...');
  try {
    // If we have the connection cached, use it
    if (cachedClient && cachedDb) {
      console.log('Using cached database connection');
      return { client: cachedClient, db: cachedDb };
    }

    // If no cached connection, create new connection
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    console.log('Creating new MongoDB client...');
    const client = new MongoClient(MONGODB_URI);
    
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    console.log(`Connected to MongoDB, accessing database: ${DB_NAME}`);
    const db = client.db(DB_NAME);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    console.log('MongoDB connection successful');
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error details:', error);
    throw error;
  }
}
