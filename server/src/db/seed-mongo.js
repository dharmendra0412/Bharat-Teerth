import dotenv from 'dotenv';
import dns from 'dns';
import { connectMongo, seedMongoIfEmpty } from './mongo.js';
import { Temple } from '../models/Temple.js';
import { Circuit } from '../models/Circuit.js';
import { User } from '../models/User.js';
import { Review } from '../models/Review.js';
import { SEED_DATA } from './seedData.js';
import mongoose from 'mongoose';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback if environment restricts setting dns servers
}

async function runSeed() {
  const uri = process.env.MONGODB_URI;
  console.log(`🚀 Starting MongoDB Seeding against: ${uri.replace(/:[^:]*@/, ':****@')}`);
  
  await connectMongo(uri);

  console.log('🧹 Purging existing collections for clean seed...');
  await Temple.deleteMany({});
  await Circuit.deleteMany({});
  await User.deleteMany({});
  await Review.deleteMany({});

  console.log(`📥 Inserting ${SEED_DATA.temples.length} verified Indian temples...`);
  await Temple.insertMany(SEED_DATA.temples);

  console.log(`📥 Inserting ${SEED_DATA.circuits.length} sacred pilgrimage circuits...`);
  await Circuit.insertMany(SEED_DATA.circuits);

  console.log(`📥 Inserting ${SEED_DATA.users.length} admin accounts...`);
  await User.insertMany(SEED_DATA.users);

  if (SEED_DATA.verifiedTips?.length) {
    console.log(`📥 Inserting ${SEED_DATA.verifiedTips.length} pilgrim reviews & tips...`);
    await Review.insertMany(SEED_DATA.verifiedTips);
  }

  console.log('✨ MongoDB Atlas seeding completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

runSeed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
