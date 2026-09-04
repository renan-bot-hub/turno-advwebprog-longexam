import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bulldogs_exchange';

try {
  await mongoose.connect(mongoUri);
  app.listen(port, () => console.log(`Bulldogs Exchange API running on port ${port}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
