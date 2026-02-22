// MongoDB initialization script
db = db.getSiblingDatabase('naias');

// Create collections with validation schemas
db.createCollection('investigations');
db.createCollection('queries');
db.createCollection('timelines');
db.createCollection('users');
db.createCollection('organizations');
db.createCollection('sessions');

// Create indices
db.investigations.createIndex({ id: 1 }, { unique: true });
db.investigations.createIndex({ organizationId: 1, createdAt: -1 });
db.investigations.createIndex({ status: 1 });
db.investigations.createIndex({ severity: 1 });
db.investigations.createIndex({ deletedAt: 1 });

db.queries.createIndex({ id: 1 }, { unique: true });
db.queries.createIndex({ investigationId: 1 });

db.timelines.createIndex({ id: 1 }, { unique: true });
db.timelines.createIndex({ investigationId: 1, timestamp: -1 });

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ organizationId: 1 });

db.organizations.createIndex({ id: 1 }, { unique: true });

db.sessions.createIndex({ userId: 1 });
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print('✓ MongoDB initialized with collections and indices');
