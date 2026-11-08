import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_DATA } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
let pool = null;

export async function connectPostgres(connectionString) {
  if (pool) return pool;

  const config = connectionString 
    ? { connectionString }
    : {
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'temple_heritage',
        port: parseInt(process.env.PGPORT || '5432', 10),
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
      };

  console.log(`🐘 Initializing PostgreSQL client connection...`);
  pool = new Pool(config);

  // Test connection
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT NOW() as current_time');
    console.log('✅ PostgreSQL connected successfully at:', res.rows[0].current_time);

    // Initialize Schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('✅ PostgreSQL schema verified & synchronized.');

    // Auto-seed if empty
    await seedPostgresIfEmpty(client);
  } finally {
    client.release();
  }

  return pool;
}

export async function seedPostgresIfEmpty(client) {
  try {
    const templeCheck = await client.query('SELECT COUNT(*) FROM temples');
    if (parseInt(templeCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding PostgreSQL with 100 authentic temples...');
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
          t.id,
          t.slug || t.id,
          t.name,
          t.localName || null,
          t.regionalScript || null,
          t.featured || false,
          t.verificationStatus || 'verified',
          t.verifiedBy || null,
          t.imageUrl,
          JSON.stringify(t.gallery || []),
          t.location.state,
          t.location.city,
          t.location.district || null,
          t.location.region || null,
          t.location.coordinates?.lat || 0,
          t.location.coordinates?.lng || 0,
          t.location.elevationMeters || null,
          t.deity.primary,
          t.history?.architecturalStyle || null,
          JSON.stringify(t.location),
          JSON.stringify(t.deity),
          JSON.stringify(t.history),
          JSON.stringify(t.darshanTimings),
          JSON.stringify(t.festivals || []),
          JSON.stringify(t.visitorGuidelines),
          JSON.stringify(t.nearbyFacilities),
          JSON.stringify(t.circuits || []),
          JSON.stringify(t.themes || []),
          JSON.stringify(t.contactInfo || {})
        ]);
      }
      console.log(`✅ Seeded ${SEED_DATA.temples.length} temples in PostgreSQL.`);
    }

    const circuitCheck = await client.query('SELECT COUNT(*) FROM circuits');
    if (parseInt(circuitCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding PostgreSQL with pilgrimage circuits...');
      for (const c of SEED_DATA.circuits) {
        await client.query(`
          INSERT INTO circuits (
            id, name, sanskrit_name, overview, deity, total_stops, duration_days, best_season, key_stops, tag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          c.id,
          c.name,
          c.sanskritName || null,
          c.overview,
          c.deity || null,
          c.totalStops,
          c.durationDays || null,
          c.bestSeason || null,
          JSON.stringify(c.keyStops || []),
          c.tag || null
        ]);
      }
      console.log(`✅ Seeded ${SEED_DATA.circuits.length} circuits in PostgreSQL.`);
    }

    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding PostgreSQL with administrator account...');
      for (const u of SEED_DATA.users) {
        await client.query(`
          INSERT INTO users (id, username, email, password_hash, role, full_name, designation)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          u.id,
          u.username,
          u.email,
          u.passwordHash,
          u.role || 'SUPER_ADMIN',
          u.fullName || null,
          u.designation || null
        ]);
      }
      console.log('✅ Admin account seeded in PostgreSQL.');
    }

    const reviewCheck = await client.query('SELECT COUNT(*) FROM reviews');
    if (parseInt(reviewCheck.rows[0].count, 10) === 0 && SEED_DATA.verifiedTips?.length) {
      for (const r of SEED_DATA.verifiedTips) {
        await client.query(`
          INSERT INTO reviews (id, temple_id, author, rating, visit_date, content, status, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          r.id,
          r.templeId,
          r.author,
          r.rating || 5,
          r.visitDate || null,
          r.content,
          r.status || 'approved',
          r.date || new Date().toISOString().split('T')[0]
        ]);
      }
    }
  } catch (err) {
    console.error('Error auto-seeding PostgreSQL:', err);
  }
}

function mapRowToTemple(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    localName: row.local_name,
    regionalScript: row.regional_script,
    featured: row.featured,
    verificationStatus: row.verification_status,
    verifiedBy: row.verified_by,
    imageUrl: row.image_url,
    gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery,
    location: typeof row.location === 'string' ? JSON.parse(row.location) : row.location,
    deity: typeof row.deity === 'string' ? JSON.parse(row.deity) : row.deity,
    history: typeof row.history === 'string' ? JSON.parse(row.history) : row.history,
    darshanTimings: typeof row.darshan_timings === 'string' ? JSON.parse(row.darshan_timings) : row.darshan_timings,
    festivals: typeof row.festivals === 'string' ? JSON.parse(row.festivals) : row.festivals,
    visitorGuidelines: typeof row.visitor_guidelines === 'string' ? JSON.parse(row.visitor_guidelines) : row.visitor_guidelines,
    nearbyFacilities: typeof row.nearby_facilities === 'string' ? JSON.parse(row.nearby_facilities) : row.nearby_facilities,
    circuits: typeof row.circuits === 'string' ? JSON.parse(row.circuits) : row.circuits,
    themes: typeof row.themes === 'string' ? JSON.parse(row.themes) : row.themes,
    contactInfo: typeof row.contact_info === 'string' ? JSON.parse(row.contact_info) : row.contact_info
  };
}

export const postgresAdapter = {
  async getTemples(filters = {}) {
    let sql = 'SELECT * FROM temples WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (filters.search) {
      params.push(`%${filters.search.trim().toLowerCase()}%`);
      sql += ` AND (
        LOWER(name) LIKE $${pIdx} OR 
        LOWER(COALESCE(local_name, '')) LIKE $${pIdx} OR 
        LOWER(state) LIKE $${pIdx} OR 
        LOWER(city) LIKE $${pIdx} OR 
        LOWER(primary_deity) LIKE $${pIdx} OR
        LOWER(COALESCE(architectural_style, '')) LIKE $${pIdx}
      )`;
      pIdx++;
    }

    if (filters.state) {
      params.push(filters.state.trim().toLowerCase());
      sql += ` AND LOWER(state) = $${pIdx}`;
      pIdx++;
    }

    if (filters.region) {
      params.push(filters.region.trim().toLowerCase());
      sql += ` AND LOWER(region) = $${pIdx}`;
      pIdx++;
    }

    if (filters.city) {
      params.push(`%${filters.city.trim().toLowerCase()}%`);
      sql += ` AND LOWER(city) LIKE $${pIdx}`;
      pIdx++;
    }

    if (filters.deity) {
      params.push(`%${filters.deity.trim().toLowerCase()}%`);
      sql += ` AND LOWER(primary_deity) LIKE $${pIdx}`;
      pIdx++;
    }

    if (filters.circuit) {
      params.push(JSON.stringify([filters.circuit]));
      sql += ` AND circuits @> $${pIdx}::jsonb`;
      pIdx++;
    }

    if (filters.featured === 'true' || filters.featured === true) {
      sql += ` AND featured = TRUE`;
    }

    if (filters.verified === 'true' || filters.verified === true) {
      sql += ` AND verification_status = 'verified'`;
    }

    if (filters.sortBy === 'name') {
      sql += ` ORDER BY name ASC`;
    } else if (filters.sortBy === 'state') {
      sql += ` ORDER BY state ASC, name ASC`;
    } else {
      sql += ` ORDER BY featured DESC, name ASC`;
    }

    const res = await pool.query(sql, params);
    return res.rows.map(mapRowToTemple);
  },

  async getTempleById(idOrSlug) {
    const res = await pool.query('SELECT * FROM temples WHERE id = $1 OR slug = $1 LIMIT 1', [idOrSlug]);
    return res.rows.length ? mapRowToTemple(res.rows[0]) : null;
  },

  async createTemple(t) {
    const id = t.slug || t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const res = await pool.query(`
      INSERT INTO temples (
        id, slug, name, local_name, regional_script, featured, verification_status, verified_by,
        image_url, gallery, state, city, district, region, lat, lng, elevation_meters,
        primary_deity, architectural_style, location, deity, history, darshan_timings,
        festivals, visitor_guidelines, nearby_facilities, circuits, themes, contact_info
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27, $28, $29
      ) RETURNING *
    `, [
      id, id, t.name, t.localName || null, t.regionalScript || null, t.featured || false,
      t.verificationStatus || 'verified', t.verifiedBy || null, t.imageUrl,
      JSON.stringify(t.gallery || []), t.location.state, t.location.city, t.location.district || null,
      t.location.region || null, t.location.coordinates?.lat || 0, t.location.coordinates?.lng || 0,
      t.location.elevationMeters || null, t.deity.primary, t.history?.architecturalStyle || null,
      JSON.stringify(t.location), JSON.stringify(t.deity), JSON.stringify(t.history),
      JSON.stringify(t.darshanTimings), JSON.stringify(t.festivals || []),
      JSON.stringify(t.visitorGuidelines), JSON.stringify(t.nearbyFacilities),
      JSON.stringify(t.circuits || []), JSON.stringify(t.themes || []), JSON.stringify(t.contactInfo || {})
    ]);
    return mapRowToTemple(res.rows[0]);
  },

  async updateTemple(id, updates) {
    const existing = await this.getTempleById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updates };

    const res = await pool.query(`
      UPDATE temples SET
        name = $1, local_name = $2, regional_script = $3, featured = $4,
        verification_status = $5, verified_by = $6, image_url = $7, gallery = $8,
        state = $9, city = $10, district = $11, region = $12, lat = $13, lng = $14,
        elevation_meters = $15, primary_deity = $16, architectural_style = $17,
        location = $18, deity = $19, history = $20, darshan_timings = $21,
        festivals = $22, visitor_guidelines = $23, nearby_facilities = $24,
        circuits = $25, themes = $26, contact_info = $27, updated_at = NOW()
      WHERE id = $28 OR slug = $28
      RETURNING *
    `, [
      merged.name, merged.localName, merged.regionalScript, merged.featured,
      merged.verificationStatus, merged.verifiedBy, merged.imageUrl, JSON.stringify(merged.gallery),
      merged.location.state, merged.location.city, merged.location.district, merged.location.region,
      merged.location.coordinates.lat, merged.location.coordinates.lng, merged.location.elevationMeters,
      merged.deity.primary, merged.history.architecturalStyle, JSON.stringify(merged.location),
      JSON.stringify(merged.deity), JSON.stringify(merged.history), JSON.stringify(merged.darshanTimings),
      JSON.stringify(merged.festivals), JSON.stringify(merged.visitorGuidelines),
      JSON.stringify(merged.nearbyFacilities), JSON.stringify(merged.circuits),
      JSON.stringify(merged.themes), JSON.stringify(merged.contactInfo), id
    ]);
    return mapRowToTemple(res.rows[0]);
  },

  async deleteTemple(id) {
    const res = await pool.query('DELETE FROM temples WHERE id = $1 OR slug = $1', [id]);
    return res.rowCount > 0;
  },

  async getCircuits() {
    const res = await pool.query('SELECT * FROM circuits ORDER BY id ASC');
    return res.rows.map(r => ({
      ...r,
      sanskritName: r.sanskrit_name,
      totalStops: r.total_stops,
      durationDays: r.duration_days,
      bestSeason: r.best_season,
      keyStops: typeof r.key_stops === 'string' ? JSON.parse(r.key_stops) : r.key_stops
    }));
  },

  async getCircuitById(id) {
    const res = await pool.query('SELECT * FROM circuits WHERE id = $1 LIMIT 1', [id]);
    if (!res.rows.length) return null;
    const r = res.rows[0];
    return {
      ...r,
      sanskritName: r.sanskrit_name,
      totalStops: r.total_stops,
      durationDays: r.duration_days,
      bestSeason: r.best_season,
      keyStops: typeof r.key_stops === 'string' ? JSON.parse(r.key_stops) : r.key_stops
    };
  },

  async createCircuit(c) {
    const id = c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const res = await pool.query(`
      INSERT INTO circuits (
        id, name, sanskrit_name, overview, deity, total_stops, duration_days, best_season, key_stops, tag
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      id, c.name, c.sanskritName || null, c.overview, c.deity || null,
      c.totalStops, c.durationDays || null, c.bestSeason || null,
      JSON.stringify(c.keyStops || []), c.tag || null
    ]);
    return res.rows[0];
  },

  async getFilterMetadata() {
    const stateRes = await pool.query('SELECT DISTINCT state FROM temples ORDER BY state ASC');
    const cityRes = await pool.query('SELECT DISTINCT city FROM temples ORDER BY city ASC');
    const deityRes = await pool.query('SELECT DISTINCT primary_deity FROM temples ORDER BY primary_deity ASC');
    const archRes = await pool.query('SELECT DISTINCT architectural_style FROM temples WHERE architectural_style IS NOT NULL ORDER BY architectural_style ASC');
    const countRes = await pool.query('SELECT COUNT(*) FROM temples');
    const circuitRes = await pool.query('SELECT COUNT(*) FROM circuits');

    return {
      states: stateRes.rows.map(r => r.state),
      cities: cityRes.rows.map(r => r.city),
      deities: [...new Set(deityRes.rows.map(r => r.primary_deity.split('(')[0].trim()))].sort(),
      architectures: archRes.rows.map(r => r.architectural_style),
      regions: ['North', 'South', 'East', 'West', 'Central', 'North East'],
      themes: ['12 Jyotirlinga', 'Char Dham', 'Shakti Peetha', 'Pancha Bhoota', 'Divya Desam', 'UNESCO Heritage', 'Mountain Shrines'],
      totalTemples: parseInt(countRes.rows[0].count, 10),
      totalCircuits: parseInt(circuitRes.rows[0].count, 10)
    };
  },

  async getReviewsForTemple(templeId) {
    const res = await pool.query('SELECT * FROM reviews WHERE temple_id = $1 AND status = $2 ORDER BY created_at DESC', [templeId, 'approved']);
    return res.rows.map(r => ({ ...r, templeId: r.temple_id, visitDate: r.visit_date }));
  },

  async getAllReviews() {
    const res = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    return res.rows.map(r => ({ ...r, templeId: r.temple_id, visitDate: r.visit_date }));
  },

  async addReview(r) {
    const id = `tip_${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const res = await pool.query(`
      INSERT INTO reviews (id, temple_id, author, rating, visit_date, content, status, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [id, r.templeId, r.author, r.rating || 5, r.visitDate || null, r.content, r.status || 'approved', date]);
    return res.rows[0];
  },

  async moderateReview(id, status) {
    const res = await pool.query('UPDATE reviews SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    return res.rows[0] || null;
  },

  async getUserByUsername(username) {
    const res = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $1 LIMIT 1', [username]);
    if (!res.rows.length) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      username: r.username,
      email: r.email,
      passwordHash: r.password_hash,
      role: r.role,
      fullName: r.full_name,
      designation: r.designation
    };
  },

  async getStats() {
    const tCount = await pool.query('SELECT COUNT(*) FROM temples');
    const vCount = await pool.query("SELECT COUNT(*) FROM temples WHERE verification_status = 'verified'");
    const sCount = await pool.query('SELECT COUNT(DISTINCT state) FROM temples');
    const cCount = await pool.query('SELECT COUNT(*) FROM circuits');
    const rCount = await pool.query('SELECT COUNT(*) FROM reviews');

    const total = parseInt(tCount.rows[0].count, 10);
    const verified = parseInt(vCount.rows[0].count, 10);

    return {
      totalTemples: total,
      verifiedTemples: verified,
      verificationPercentage: total > 0 ? Math.round((verified / total) * 100) : 100,
      statesCovered: parseInt(sCount.rows[0].count, 10),
      circuitsCount: parseInt(cCount.rows[0].count, 10),
      totalPilgrimTips: parseInt(rCount.rows[0].count, 10),
      databaseEngine: 'PostgreSQL',
      lastUpdated: new Date().toISOString()
    };
  }
};

