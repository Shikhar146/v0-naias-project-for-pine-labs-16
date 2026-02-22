import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'naias';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

async function connectToDatabase() {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
    });

    await client.connect();
    const db = client.db(MONGODB_DB);

    // Verify connection
    await db.admin().ping();

    cachedClient = client;
    cachedDb = db;

    console.log('✓ MongoDB connected successfully');

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export async function getDb() {
  const { db } = await connectToDatabase();
  return db;
}

export async function getClient() {
  const { client } = await connectToDatabase();
  return client;
}

export type Database = Awaited<ReturnType<typeof getDb>>;
