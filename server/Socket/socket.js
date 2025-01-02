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
const userSocketMap = [];

// Helper function to get the receiver's socket ID(s)
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Handle socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Register the socket ID for the user
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
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
      }
    }
  });
});

module.exports = { app, server, io, getReceiverSocketId };
