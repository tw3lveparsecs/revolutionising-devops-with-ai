const express = require("express");
const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  res.json({ message: "GET all users" });
});

// GET user by ID
router.get("/:id", (req, res) => {
  res.json({ message: `GET user with ID ${req.params.id}` });
});

// Register new user
router.post("/register", (req, res) => {
  res.json({ message: "Register new user", data: req.body });
});

// Login user
router.post("/login", (req, res) => {
  res.json({ message: "Login user", data: req.body });
});

// Update user
router.put("/:id", (req, res) => {
  res.json({ message: `Update user with ID ${req.params.id}`, data: req.body });
});

// Delete user
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete user with ID ${req.params.id}` });
});

module.exports = router;
