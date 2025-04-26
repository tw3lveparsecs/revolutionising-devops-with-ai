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

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/collectibles", collectiblesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/orders", ordersRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
  });
}

// Add a test route to check if the API is working
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
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
