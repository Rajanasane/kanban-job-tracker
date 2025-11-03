// src/lib/mongodb.ts

import mongoose from 'mongoose';

// 1. Define the type for the cached connection structure
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// 2. Declaration merging to add the 'mongoose' property to the global object.
declare global {
  // It must be initialized here as undefined to allow the check below
  var mongoose: CachedConnection | undefined; 
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Use a variable that we can confidently assert is defined after the check below.
let cached: CachedConnection = global.mongoose as CachedConnection;

// Initialize the cached object if it doesn't exist
if (!cached) {
  // We explicitly assign to global.mongoose, and then also assign to the local 'cached' variable.
  global.mongoose = { conn: null, promise: null };
  cached = global.mongoose;
}

async function dbConnect() {
  if (cached.conn) {
    // Return the existing connection if available
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Recommended for serverless environments
    };

    // Start a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, reset the promise so we can try again
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;