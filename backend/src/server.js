import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'

import {connectDB} from "./config/db.js"
import rateLimiter from "./middleware/ratelimiter.js"

//routes imports
import noteRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
}));
app.use(express.json());
app.use(rateLimiter);


//routes
app.use("/api/notes" , noteRoutes);


connectDB().then(()=> {
app.listen(5000 , () => {
    console.log(`Server Running on port ${PORT}`);
})});