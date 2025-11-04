import mongoose from "mongoose";
import dotenv from "dotenv";

// Import Note model to ensure it's registered
import '../backend/src/models/Note.js';

// Import controllers directly
import { getAllNotes, createNote, updateNote, deleteNote, getNodeById } from '../backend/src/controllers/notesControllers.js';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

dotenv.config();

// Database connection with caching
let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    cachedDb = db;
    console.log("MongoDB Connected Successfully!");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Rate limiter
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60 s")
});

// Helper to apply rate limiting
async function applyRateLimit(req, res) {
  try {
    const {success} = await ratelimit.limit("userid");
    if (!success) {
      res.status(429).json({message: "Too many requests. Please try again later"});
      return false;
    }
    return true;
  } catch (error) {
    console.log("rate limit error", error);
    return true; // Allow on error
  }
}

// Helper to parse request body
async function parseBody(req) {
  if (req.body) return req.body;
  
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

// Main handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Connect to database
    await connectDB();

    // Apply rate limiting
    const allowed = await applyRateLimit(req, res);
    if (!allowed) return;

    // Parse URL and method
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.replace('/api', ''); // Remove /api prefix
    const method = req.method;

    // Route handling
    if (path === '/' || path === '') {
      return res.status(200).json({ 
        message: 'WishperWall API is running',
        timestamp: new Date().toISOString()
      });
    }

    // Notes routes
    if (path === '/notes' || path === '/notes/') {
      if (method === 'GET') {
        return await getAllNotes(req, res);
      } else if (method === 'POST') {
        req.body = await parseBody(req);
        return await createNote(req, res);
      }
    }

    // Notes by ID routes
    const noteIdMatch = path.match(/^\/notes\/([a-zA-Z0-9]+)\/?$/);
    if (noteIdMatch) {
      req.params = { id: noteIdMatch[1] };
      
      if (method === 'GET') {
        return await getNodeById(req, res);
      } else if (method === 'PUT') {
        req.body = await parseBody(req);
        return await updateNote(req, res);
      } else if (method === 'DELETE') {
        return await deleteNote(req, res);
      }
    }

    // 404 Not Found
    return res.status(404).json({ message: 'Route not found' });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
