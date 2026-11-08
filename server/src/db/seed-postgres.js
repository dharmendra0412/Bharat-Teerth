import dotenv from 'dotenv';
import { connectPostgres, seedPostgresIfEmpty } from './postgres.js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_DATA } from './seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const connStr = process.env.DATABASE_URL;
  console.log(`🚀 Starting PostgreSQL Seeding...`);

  const pool = await connectPostgres(connStr);
  const client = await pool.connect();

  try {
    console.log('🧹 Purging existing tables for clean seed...');
    await client.query('TRUNCATE TABLE reviews, temples, circuits, users RESTART IDENTITY CASCADE;');

    console.log(`📥 Inserting ${SEED_DATA.temples.length} temples...`);
    for (const t of SEED_DATA.temples) {
      await client.query(`
        INSERT INTO temples (
          id, slug, name, local_name, regional_script, featured, verification_status, verified_by,
          image_url, gallery, state, city, district, region, lat, lng, elevation_meters,
          primary_deity, architectural_style, location, deity, history, darshan_timings,
          festivals, visitor_guidelines, nearby_facilities, circuits, themes, contact_info
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
        )
      `, [
        t.id, t.slug || t.id, t.name, t.localName || null, t.regionalScript || null,
        t.featured || false, t.verificationStatus || 'verified', t.verifiedBy || null,
        t.imageUrl, JSON.stringify(t.gallery || []), t.location.state, t.location.city,
        t.location.district || null, t.location.region || null, t.location.coordinates?.lat || 0,
        t.location.coordinates?.lng || 0, t.location.elevationMeters || null, t.deity.primary,
        t.history?.architecturalStyle || null, JSON.stringify(t.location), JSON.stringify(t.deity),
        JSON.stringify(t.history), JSON.stringify(t.darshanTimings), JSON.stringify(t.festivals || []),
        JSON.stringify(t.visitorGuidelines), JSON.stringify(t.nearbyFacilities),
        JSON.stringify(t.circuits || []), JSON.stringify(t.themes || []), JSON.stringify(t.contactInfo || {})
      ]);
    }

    console.log(`📥 Inserting ${SEED_DATA.circuits.length} circuits...`);
    for (const c of SEED_DATA.circuits) {
      await client.query(`
        INSERT INTO circuits (
          id, name, sanskrit_name, overview, deity, total_stops, duration_days, best_season, key_stops, tag
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        c.id, c.name, c.sanskritName || null, c.overview, c.deity || null,
        c.totalStops, c.durationDays || null, c.bestSeason || null,
        JSON.stringify(c.keyStops || []), c.tag || null
      ]);
    }

    console.log(`📥 Inserting admin user...`);
    for (const u of SEED_DATA.users) {
      await client.query(`
        INSERT INTO users (id, username, email, password_hash, role, full_name, designation)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [u.id, u.username, u.email, u.passwordHash, u.role || 'SUPER_ADMIN', u.fullName || null, u.designation || null]);
    }

    if (SEED_DATA.verifiedTips?.length) {
      console.log(`📥 Inserting ${SEED_DATA.verifiedTips.length} pilgrim tips...`);
      for (const r of SEED_DATA.verifiedTips) {
        await client.query(`
          INSERT INTO reviews (id, temple_id, author, rating, visit_date, content, status, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [r.id, r.templeId, r.author, r.rating || 5, r.visitDate || null, r.content, r.status || 'approved', r.date || new Date().toISOString().split('T')[0]]);
      }
    }

    console.log('✨ PostgreSQL seeding completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
  process.exit(0);
}

runSeed().catch(err => {
  console.error('❌ PostgreSQL Seeding failed:', err);
  process.exit(1);
});

