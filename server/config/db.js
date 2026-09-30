import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/yashwant_farm';

let isConnected = false;

// Disable command buffering so operations fail fast if DB is disconnected
mongoose.set('bufferCommands', false);

export const isDBConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async () => {
  if (isConnected || isDBConnected()) return;

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] Database offline (${error.message}). Using high-performance memory store fallback.`);
  }
};

export const getDBStatus = () => {
  return {
    connected: isDBConnected(),
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'memory-fallback',
    name: mongoose.connection.name || 'yashwant_farm'
  };
};

