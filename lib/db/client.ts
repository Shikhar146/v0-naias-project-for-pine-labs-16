import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// For development without a database, we can use a mock connection
let db: any;

if (!process.env.DATABASE_URL) {
  // Development mode without database - log warning but don't crash
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'WARNING: DATABASE_URL not set. Database features will be unavailable. Set DATABASE_URL in .env.local to enable.'
    );
    // Create a mock db object for development
    db = {} as any;
  } else {
    throw new Error('DATABASE_URL environment variable is required in production');
  }
} else {
  const sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
}

export { db };
export type Database = typeof db;
