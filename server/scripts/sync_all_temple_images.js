import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import { Temple } from '../src/models/Temple.js';

dotenv.config({ path: 'server/.env' });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const customMap = {
  'mundeshwari-devi-bihar': '/images/temples/mundeshwari-devi-bihar.jpg',
  'sheetla-mata-gurugram': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Sheetla_mata_mandir.jpg',
  'gnana-saraswathi-basar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Basara_Saraswathi_Temple_India.jpg/1280px-Basara_Saraswathi_Temple_India.jpg',
  'dilwara-temples-mountabu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Dilwara_temple_at_mount_abu.jpg/1280px-Dilwara_temple_at_mount_abu.jpg'
};

async function run() {
  console.log('Reading seedData.js...');
  let seedContent = fs.readFileSync('server/src/db/seedData.js', 'utf8');

  // Load the seed module to get structured data
  const { SEED_DATA } = await import('../src/db/seedData.js');

  const updates = [];

  SEED_DATA.temples.forEach((t) => {
    const hasUnsplash = t.imageUrl?.includes('unsplash.com') || (t.gallery && t.gallery.some(g => g.includes('unsplash.com')));
    if (!hasUnsplash && !customMap[t.id]) return;

    let newImageUrl = customMap[t.id];
    let filteredGallery = (t.gallery || []).filter(g => !g.includes('unsplash.com'));

    if (!newImageUrl) {
      if (filteredGallery.length > 0) {
        newImageUrl = filteredGallery[0];
      }
    }

    if (newImageUrl) {
      if (!filteredGallery.includes(newImageUrl)) {
        filteredGallery.unshift(newImageUrl);
      }
      updates.push({
        id: t.id,
        name: t.name,
        oldImageUrl: t.imageUrl,
        newImageUrl,
        newGallery: filteredGallery
      });
    }
  });

  console.log(`Applying ${updates.length} updates to seedData.js and MongoDB...`);

  // Update seedData.js file content
  for (const u of updates) {
    // Replace old imageUrl in seedContent for this temple
    // We look for "id": "...", and then "imageUrl": "..."
    const idRegex = new RegExp(`("id":\\s*"${u.id}"[\\s\\S]*?"imageUrl":\\s*")[^"]*(")`);
    if (idRegex.test(seedContent)) {
      seedContent = seedContent.replace(idRegex, `$1${u.newImageUrl}$2`);
    } else {
      console.warn(`Could not find idRegex for ${u.id}`);
    }
  }

  // Also replace any remaining generic photo-1544717305 in gallery
  seedContent = seedContent.replace(/"https:\/\/images\.unsplash\.com\/photo-1544717305-2782549b5136[^"]*",?\s*/g, '');
  seedContent = seedContent.replace(/"https:\/\/images\.unsplash\.com\/photo-1596178065887-1198b6148b2b[^"]*",?\s*/g, '');
  seedContent = seedContent.replace(/"https:\/\/images\.unsplash\.com\/photo-1590766940554-634a7ed41450[^"]*",?\s*/g, '');
  seedContent = seedContent.replace(/"https:\/\/images\.unsplash\.com\/photo-1621847468516-1ed5d0df56fe[^"]*",?\s*/g, '');
  seedContent = seedContent.replace(/"https:\/\/images\.unsplash\.com\/photo-1582510003544-4d00b7f74220[^"]*",?\s*/g, '');

  fs.writeFileSync('server/src/db/seedData.js', seedContent, 'utf8');
  console.log('✅ seedData.js updated successfully!');

  // Now connect to MongoDB Atlas and update documents
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('No MONGODB_URI found');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected! Updating temple collection...');

  let dbUpdatedCount = 0;
  for (const u of updates) {
    const res = await Temple.updateOne(
      { id: u.id },
      { 
        $set: { 
          imageUrl: u.newImageUrl,
          gallery: u.newGallery 
        } 
      }
    );
    if (res.matchedCount > 0) {
      dbUpdatedCount++;
    } else {
      console.log(`Temple not found in DB by id=${u.id}, trying slug...`);
      await Temple.updateOne(
        { slug: u.id },
        { 
          $set: { 
            imageUrl: u.newImageUrl,
            gallery: u.newGallery 
          } 
        }
      );
    }
  }

  console.log(`✅ Updated ${dbUpdatedCount} temples in MongoDB Atlas!`);
  await mongoose.disconnect();
  console.log('Done!');
}

run().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
