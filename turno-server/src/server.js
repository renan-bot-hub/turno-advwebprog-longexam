import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { seedDatabase } from './seedData.js';
import { migrateLegacyData } from './utils/migrateLegacyData.js';

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulldogs_exchange';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add it to turno-server/.env before starting the API.');
  process.exit(1);
}

let mongoServer;

try {
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log('Connected to MongoDB');
  // Converts products saved with a text category (older versions) to category references
  await migrateLegacyData();
} catch (error) {
  if (process.env.USE_MEMORY_DB !== 'true') {
    console.error(`Could not connect to MongoDB (${error.message}).`);
    console.error('Start MongoDB or fix MONGODB_URI. To run with a temporary in-memory database instead, set USE_MEMORY_DB=true.');
    process.exit(1);
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await seedDatabase();
  console.warn('WARNING: Using a temporary in-memory MongoDB with sample data. All data is lost when the server stops.');
}

app.listen(port, () => console.log(`Bulldogs Exchange API running on port ${port}`));

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
  process.exit(0);
});
