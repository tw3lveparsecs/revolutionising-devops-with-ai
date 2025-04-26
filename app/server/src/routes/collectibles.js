const express = require("express");
const router = express.Router();

// GET all collectibles
router.get("/", (req, res) => {
  res.json({ message: "GET all Star Wars collectibles" });
});

// GET a single collectible by ID
router.get("/:id", (req, res) => {
  res.json({ message: `GET collectible with ID ${req.params.id}` });
});

// POST new collectible
router.post("/", (req, res) => {
  res.json({ message: "POST new collectible", data: req.body });
});

// PUT update collectible
router.put("/:id", (req, res) => {
  res.json({
    message: `UPDATE collectible with ID ${req.params.id}`,
    data: req.body,
  });
});

// DELETE collectible
router.delete("/:id", (req, res) => {
  res.json({ message: `DELETE collectible with ID ${req.params.id}` });
});

module.exports = router;
