import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB, getDBStatus } from './config/db.js';
import { seedData } from './seed.js';

import authRoutes from './routes/auth.routes.js';
import publicRoutes from './routes/public.routes.js';
import pricesRoutes from './routes/prices.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import enquiriesRoutes from './routes/enquiries.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static file serving for images & uploads
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

app.use(express.static(publicDir));
app.use('/images', express.static(path.join(publicDir, 'images')));
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

// If dist exists, serve production frontend build
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Health & Status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Yashwant Farm API',
    version: '2.0.0',
    db: getDBStatus(),
    time: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/enquiries', enquiriesRoutes);

// Catch-all for API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// SPA catch-all fallback for client-side routing
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    res.sendFile(path.join(distDir, 'index.html'));
  } else {
    res.status(404).send('Frontend not built. Please run "npm run build" or start Vite dev server.');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start Server and Connect DB
const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  🌾 Yashwant Farm Backend Server Running      `);
      console.log(`  🚀 Port: http://localhost:${PORT}             `);
      console.log(`  🌿 Health: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
  }
};

startServer();

export default app;
