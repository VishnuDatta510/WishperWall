import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';

import {connectDB} from "./config/db.js";
import rateLimiter from "./middleware/ratelimiter.js";

//routes imports
import noteRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? true // Allow all origins in production (Vercel handles this)
        : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));
app.use(express.json());
app.use(rateLimiter);

//routes
app.use("/api/notes" , noteRoutes);

// Only start server in development (not in Vercel)
if(process.env.NODE_ENV !== "production"){
    connectDB().then(()=> {
        app.listen(PORT , () => {
            console.log(`Server Running on port ${PORT}`);
        });
    });
}

// Export for Vercel
export default app;