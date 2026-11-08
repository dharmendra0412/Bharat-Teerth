import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { db } from './db/index.js';
import templesRouter from './routes/temples.js';
import circuitsRouter from './routes/circuits.js';
import regionsRouter from './routes/regions.js';
import reviewsRouter from './routes/reviews.js';
import authRouter from './routes/auth.js';
import statsRouter from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database connection (MongoDB, PostgreSQL, or verified document store)
await db.initialize();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'India Temple Heritage & Pilgrimage Information Portal API',
    databaseEngine: db.providerName,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/temples', templesRouter);
app.use('/api/circuits', circuitsRouter);
app.use('/api/regions', regionsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/auth', authRouter);
app.use('/api/stats', statsRouter);

// Serve frontend build from client/dist if available
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Fallback for SPA routing: any non-API route serves index.html
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('India Temple Heritage API is live. Client building or running on port 3000.');
    }
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.originalUrl} not found.` });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error occurred.' });
});

if (!process.env.VERCEL) {
  const server = app.listen(CONFIG.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛕 India Temple Heritage & Pilgrimage API Server`);
    console.log(`🌐 Live on http://localhost:${CONFIG.PORT}`);
    console.log(`🗄️ Database Engine: ${db.providerName}`);
    console.log(`📜 Serving API and Web Portal Application`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️ Port ${CONFIG.PORT} is already in use by another process.`);
      console.error(`💡 To free port ${CONFIG.PORT} in PowerShell, run:`);
      console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${CONFIG.PORT}).OwningProcess -Force\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

export default app;
