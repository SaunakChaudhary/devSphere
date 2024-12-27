require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DB = require("./database/Db");
const { server, app } = require("./Socket/socket");

// Import Routes
const authRouter = require("./routes/auth.routes");
const hashtagaRouter = require("./routes/hashtag.routes");
const userRouter = require("./routes/user.routes");
const searchRouter = require("./routes/search.routes");
const NotificationRouter = require("./routes/notification.routes");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173", // Development frontend
      "https://devsphere-97jl.onrender.com", // Production frontend
    ];

    // Check if the request's origin is in the list of allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you're using cookies or sessions
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/hashtag", hashtagaRouter);
app.use("/user", userRouter);
app.use("/search", searchRouter);
app.use("/notification", NotificationRouter);

DB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Listening to the PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
