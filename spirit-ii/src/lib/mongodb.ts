import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'spiritii';

// Connection cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface ConnectToDBResult {
  client: MongoClient;
  db: Db;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let globalWithMongo = global as typeof globalThis & {
  mongo: {
    conn: ConnectToDBResult | null;
    promise: Promise<ConnectToDBResult> | null;
  };
};

if (!globalWithMongo.mongo) {
  globalWithMongo.mongo = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase(): Promise<ConnectToDBResult> {
  if (globalWithMongo.mongo.conn) {
    console.log('Using cached MongoDB connection');
    return globalWithMongo.mongo.conn;
  }

  if (!globalWithMongo.mongo.promise) {
    console.log('Creating new MongoDB connection');
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    globalWithMongo.mongo.promise = MongoClient.connect(MONGODB_URI)
      .then((client) => {
        const db = client.db(MONGODB_DB);
        return { client, db };
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    globalWithMongo.mongo.conn = await globalWithMongo.mongo.promise;
  } catch (e) {
    globalWithMongo.mongo.promise = null;
    throw e;
  }

  return globalWithMongo.mongo.conn;
}
