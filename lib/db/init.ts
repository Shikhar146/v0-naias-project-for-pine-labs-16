import { getDb } from './client';
import { COLLECTIONS } from './models';

export async function initializeDatabase() {
  try {
    const db = await getDb();

    // Create collections with indices
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Investigations Collection
    if (!collectionNames.includes(COLLECTIONS.INVESTIGATIONS)) {
      await db.createCollection(COLLECTIONS.INVESTIGATIONS);
      await db
        .collection(COLLECTIONS.INVESTIGATIONS)
        .createIndex({ organizationId: 1, createdAt: -1 });
      await db
        .collection(COLLECTIONS.INVESTIGATIONS)
        .createIndex({ id: 1 }, { unique: true });
      await db
        .collection(COLLECTIONS.INVESTIGATIONS)
        .createIndex({ status: 1 });
      await db
        .collection(COLLECTIONS.INVESTIGATIONS)
        .createIndex({ severity: 1 });
      console.log('✓ Created investigations collection with indices');
    }

    // Queries Collection
    if (!collectionNames.includes(COLLECTIONS.QUERIES)) {
      await db.createCollection(COLLECTIONS.QUERIES);
      await db
        .collection(COLLECTIONS.QUERIES)
        .createIndex({ investigationId: 1 });
      await db
        .collection(COLLECTIONS.QUERIES)
        .createIndex({ id: 1 }, { unique: true });
      console.log('✓ Created queries collection with indices');
    }

    // Timelines Collection
    if (!collectionNames.includes(COLLECTIONS.TIMELINES)) {
      await db.createCollection(COLLECTIONS.TIMELINES);
      await db
        .collection(COLLECTIONS.TIMELINES)
        .createIndex({ investigationId: 1, timestamp: -1 });
      await db
        .collection(COLLECTIONS.TIMELINES)
        .createIndex({ id: 1 }, { unique: true });
      console.log('✓ Created timelines collection with indices');
    }

    // Users Collection
    if (!collectionNames.includes(COLLECTIONS.USERS)) {
      await db.createCollection(COLLECTIONS.USERS);
      await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true });
      await db
        .collection(COLLECTIONS.USERS)
        .createIndex({ organizationId: 1 });
      console.log('✓ Created users collection with indices');
    }

    // Organizations Collection
    if (!collectionNames.includes(COLLECTIONS.ORGANIZATIONS)) {
      await db.createCollection(COLLECTIONS.ORGANIZATIONS);
      await db
        .collection(COLLECTIONS.ORGANIZATIONS)
        .createIndex({ id: 1 }, { unique: true });
      console.log('✓ Created organizations collection with indices');
    }

    // Sessions Collection
    if (!collectionNames.includes(COLLECTIONS.SESSIONS)) {
      await db.createCollection(COLLECTIONS.SESSIONS);
      await db
        .collection(COLLECTIONS.SESSIONS)
        .createIndex({ userId: 1 });
      // TTL index - auto-delete expired sessions after 7 days
      await db
        .collection(COLLECTIONS.SESSIONS)
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      console.log('✓ Created sessions collection with indices');
    }

    console.log('✓ Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
