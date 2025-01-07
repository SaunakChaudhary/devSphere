const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173", // Development frontend
        "https://devsphere-97jl.onrender.com", // Production frontend
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        console.error(`CORS error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to store user IDs and associated socket IDs
const userSocketMap = {};

// Helper function to get online users
const getOnlineUsers = () => Object.keys(userSocketMap);

// Handle socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Add the user's socket ID
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
    io.emit("getOnlineUsers", getOnlineUsers());
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      // Remove the disconnected socket ID
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      // If no more sockets are associated with the user, remove the entry
      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
        // Update last seen for the user
        updateLastSeenInDatabase(userId);
      }

      io.emit("getOnlineUsers", getOnlineUsers());
    }
  });

  // Handle logout
  socket.on("logout", (userId) => {
    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", getOnlineUsers());
      updateLastSeenInDatabase(userId);
    }
  });
});

// Function to update last seen in the database
const updateLastSeenInDatabase = async (userId) => {
  try {
    // Replace with your database logic
    console.log(`Updating last seen for user: ${userId}`);
  } catch (err) {
    console.error("Failed to update last seen for user:", userId, err);
  }
};

module.exports = { app, server, io };
