import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://wishper-wall.vercel.app",
  "https://wishper-wall-7vf8cropd-vishnudatta510s-projects.vercel.app"
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set("io", io);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
    console.log("✅ SERVER RESTARTED WITH LATEST CODE");
  });
});
