import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/yashwant_farm';

let cachedPromise = null;

// Disable command buffering so operations fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

export const isDBConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
  if (isDBConnected()) return mongoose.connection;
  if (cachedPromise) return cachedPromise;

  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/yashwant_farm';
  const timeoutMs = process.env.MONGODB_URI ? 10000 : 2500;

  cachedPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: timeoutMs,
    connectTimeoutMS: timeoutMs
  }).then((conn) => {
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  }).catch((error) => {
    cachedPromise = null;
    console.warn(`[MongoDB] Database offline (${error.message}). Using high-performance memory store fallback.`);
  });

  return cachedPromise;
};

export const getDBStatus = () => {
  return {
    connected: isDBConnected(),
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'memory-fallback',
    name: mongoose.connection.name || 'yashwant_farm'
  };
};

