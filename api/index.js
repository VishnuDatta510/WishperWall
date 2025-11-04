import app from '../backend/src/server.js';
import { connectDB } from '../backend/src/config/db.js';

// Connect to database once
let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  
  return app(req, res);
};

export default handler;
