import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'
import path from "path";

import {connectDB} from "./config/db.js"
import rateLimiter from "./middleware/ratelimiter.js"

//routes imports
import noteRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


// middleware
if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
    }));
}
app.use(express.json());
app.use(rateLimiter);


//routes
app.use("/api/notes" , noteRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "/frontend/dist")))
    app.get("/*" , (req , res) => {
    res.sendFile(path.join(__dirname, "/frontend" , "dist" , "index.html"));
})
}

// For local development
if(process.env.NODE_ENV !== "production"){
    connectDB().then(()=> {
        app.listen(PORT , () => {
            console.log(`Server Running on port ${PORT}`);
        })
    });
}

// Export for Vercel
export default app;