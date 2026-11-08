import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'bharat_teerth_sacred_heritage_portal_jwt_secret_2026',
  DB_PATH: path.join(__dirname, '../data/database.json'),
  ADMIN_DEFAULT: {
    username: 'admin',
    email: 'admin@templesofindia.gov.in',
    // Default pass: TempleAdmin#2026 (stored as bcrypt hash in seedData)
    role: 'SUPER_ADMIN'
  }
};

