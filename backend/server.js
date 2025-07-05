const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://172.31.55.206:3000', // Your specific IP
    'http://127.0.0.1:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Apikey']
}));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://robertadag02:<db_password>@cluster0.ossvqxu.mongodb.net/mintro";
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your-super-secret-jwt-key-change-this-in-production";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log(
      "Please make sure MongoDB is running locally or set MONGODB_URI environment variable"
    );
    console.log(
      "To run MongoDB locally: brew install mongodb-community && brew services start mongodb-community"
    );
  });

// Import routes with error handling
let authRoutes, userRoutes, traderRoutes, followingRoutes, transactionRoutes;

try {
  authRoutes = require("./routes/auth");
  console.log("Auth routes loaded successfully");
} catch (error) {
  console.error("Error loading auth routes:", error.message);
}

try {
  userRoutes = require("./routes/users");
  console.log("User routes loaded successfully");
} catch (error) {
  console.error("Error loading user routes:", error.message);
}

try {
  traderRoutes = require("./routes/traders");
  console.log("Trader routes loaded successfully");
} catch (error) {
  console.error("Error loading trader routes:", error.message);
}

try {
  followingRoutes = require("./routes/following");
  console.log("Following routes loaded successfully");
} catch (error) {
  console.error("Error loading following routes:", error.message);
}

try {
  transactionRoutes = require("./routes/transactions");
  console.log("Transaction routes loaded successfully");
} catch (error) {
  console.error("Error loading transaction routes:", error.message);
}

// Routes - only add if they loaded successfully
if (authRoutes) {
  app.use("/api/auth", authRoutes);
}

if (userRoutes) {
  app.use("/api/users", userRoutes);
}

if (traderRoutes) {
  app.use("/api/traders", traderRoutes);
}

if (followingRoutes) {
  app.use("/api/following", followingRoutes);
}

if (transactionRoutes) {
  app.use("/api/transactions", transactionRoutes);
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend API is working!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler - catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`Transaction stats: http://localhost:${PORT}/api/transactions/stats`);
});
