import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import cityRoutes from "./routes/cityRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => {
  res.send("API is working!");
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.locals.io = io;

const connectedUsers = {};

const genUsername = () => `traveler${Math.floor(Math.random() * 9000 + 1000)}`;
const genAvatar = (id) => `https://i.pravatar.cc/150?u=${encodeURIComponent(id)}`;

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  const username = genUsername();
  const avatar = genAvatar(socket.id);
  connectedUsers[socket.id] = { username, avatar };

  // Emit updated user list to all clients
  io.emit(
    "userList",
    Object.keys(connectedUsers).map((sid) => ({
      socketId: sid,
      username: connectedUsers[sid].username,
      avatar: connectedUsers[sid].avatar,
    }))
  );

  // Notify others someone joined
  socket.broadcast.emit("systemMessage", {
    text: `${username} joined the chat`,
    time: new Date().toISOString(),
  });

  // Listen for chat messages
  socket.on("chatMessage", (payload) => {
    const text = typeof payload === "string" ? payload : payload.text;
    const message = {
      text,
      time: new Date().toISOString(),
      username: connectedUsers[socket.id].username,
      avatar: connectedUsers[socket.id].avatar,
      socketId: socket.id,
    };
    io.emit("chatMessage", message);
  });

  // Allow setting a custom display name
  socket.on("setDisplayName", (name) => {
    connectedUsers[socket.id].username = name || connectedUsers[socket.id].username;
    io.emit(
      "userList",
      Object.keys(connectedUsers).map((sid) => ({
        socketId: sid,
        username: connectedUsers[sid].username,
        avatar: connectedUsers[sid].avatar,
      }))
    );
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    const leftUser = connectedUsers[socket.id];
    delete connectedUsers[socket.id];

    io.emit(
      "userList",
      Object.keys(connectedUsers).map((sid) => ({
        socketId: sid,
        username: connectedUsers[sid].username,
        avatar: connectedUsers[sid].avatar,
      }))
    );

    if (leftUser) {
      socket.broadcast.emit("systemMessage", {
        text: `${leftUser.username} left the chat`,
        time: new Date().toISOString(),
      });
    }
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server & Socket.IO running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
