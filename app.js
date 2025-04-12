const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const moviesRoutes = require("./routes/movies");
const trackerRoutes = require("./routes/tracker");
const apiKeyMiddleware = require("./middleware/apiKeyMiddleware");

require("dotenv").config();

const app = express();

// Apply CORS before any other middleware
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,POST,PATCH",
  })
);

// Apply express.json() middleware before any routes
app.use(express.json());

// Log the request body for tracking
app.use("/api/track", (req, res, next) => {
  console.log("Tracking request received:", req.body);
  next();
});

// Use routes for '/api/track'
app.use("/api/track", trackerRoutes);

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
});

app.use(helmet());
app.use(limiter);
app.use(morgan("tiny"));

app.use((req, res, next) => {
  res.setHeader("X-Content-Language", "en");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

app.use((req, res, next) => {
  if (!req.headers["dnt"]) {
    console.log(`Tracking: ${req.method} ${req.url}`);
  }
  next();
});

app.use("/api/movies", apiKeyMiddleware, moviesRoutes);

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
