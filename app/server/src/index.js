const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

// Import routes
const collectiblesRoutes = require("./routes/collectibles");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to validate route paths to prevent path-to-regexp errors
const originalUse = app.use;
app.use = function () {
  // Check if the first argument might be a URL instead of a path pattern
  if (arguments[0] && typeof arguments[0] === "string") {
    const path = arguments[0];
    if (path.includes("http://") || path.includes("https://")) {
      console.error(`ERROR: Attempted to use a URL as a route path: ${path}`);
      // Replace with a safe path to prevent app from crashing
      arguments[0] = "/invalid-path";
    }
  }
  return originalUse.apply(this, arguments);
};

// Parse CORS origins from environment variable or use defaults
function getAllowedOrigins() {
  // Get frontend URL from WEBSITE_CORS_ALLOWED_ORIGINS environment variable set by Azure
  const azureAllowedOrigins = process.env.WEBSITE_CORS_ALLOWED_ORIGINS
    ? process.env.WEBSITE_CORS_ALLOWED_ORIGINS.split(",")
    : [];

  // Get explicit frontend URL if set during deployment
  const frontendUrl = process.env.FRONTEND_URL;

  // Default development origins
  const developmentOrigins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
  ];

  // Combine all sources, removing duplicates and empty values
  const allOrigins = [
    ...azureAllowedOrigins,
    frontendUrl,
    // Keep previously allowed production origins for backward compatibility
    "https://gentle-coast-08c5cd800.6.azurestaticapps.net",
    "https://lively-tree-0be614900.6.azurestaticapps.net",
    "https://white-meadow-0d8004700.6.azurestaticapps.net",
    ...developmentOrigins,
  ].filter(Boolean); // Remove any undefined or empty values

  console.log("Configured CORS allowed origins:", allOrigins);
  return allOrigins;
}

// Enhanced CORS configuration for both local development and production
const corsOptions = {
  // Allow requests from these origins
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    // Log for debugging
    if (origin) {
      console.log(`Received request from origin: ${origin}`);
    }

    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      console.warn(
        `Origin ${origin} not allowed by CORS. Allowed origins: ${JSON.stringify(
          allowedOrigins
        )}`
      );
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware with our options
app.use(cors(corsOptions));

// Add a test route to check CORS configuration
app.get("/api/cors-test", (req, res) => {
  res.json({
    message: "CORS is properly configured",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || "No origin header",
    allowedOrigins: getAllowedOrigins(),
    frontendUrl: process.env.FRONTEND_URL,
    azureCorsOrigins: process.env.WEBSITE_CORS_ALLOWED_ORIGINS || "Not set",
  });
});

// Other middleware
app.use(express.json());
app.use(
  helmet({
    // Allow loading from same origin for development
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));

// Routes - Make sure we're using string literals for route paths, not URL objects
app.use("/api/collectibles", collectiblesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);

// Add a test route to check if the API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// Connect to MongoDB
try {
  // Try to connect to MongoDB if available
  mongoose
    .connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/starwars-collectibles"
    )
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.warn("MongoDB connection error:", error.message);
      console.log("Running server in test mode without database connection");
    });
} catch (error) {
  console.warn("MongoDB initialization error:", error.message);
  console.log("Running server in test mode without database connection");
}

// Start the server regardless of MongoDB connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
