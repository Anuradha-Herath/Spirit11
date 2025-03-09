import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spiritii';
const MONGODB_DB = process.env.MONGODB_DB || 'spiritii';

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  // Check the cached client and database connection
  if (cachedClient && cachedDb) {
    // Load from cache if available
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Connect to the MongoDB server
  const client = await MongoClient.connect(MONGODB_URI);

  // Get reference to the database
  const db = await client.db(MONGODB_DB);

  // Cache the client and db references
  cachedClient = client;
  cachedDb = db;

  return {
    client,
    db,
  };
}
