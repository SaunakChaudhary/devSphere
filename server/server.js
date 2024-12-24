require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const DB = require("./database/Db");

// Import Routes
const authRouter = require("./routes/auth.routes");
const hashtagaRouter = require("./routes/hashtag.routes");

const corseOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corseOption));

app.use("/auth", authRouter);
app.use("/hashtag", hashtagaRouter);

DB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening to the PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
