const express = require("express");
const router = express.Router();

// GET all orders
router.get("/", (req, res) => {
  res.json({ message: "GET all orders" });
});

// GET order by ID
router.get("/:id", (req, res) => {
  res.json({ message: `GET order with ID ${req.params.id}` });
});

// POST new order
router.post("/", (req, res) => {
  res.json({ message: "Create new order", data: req.body });
});

// PUT update order
router.put("/:id", (req, res) => {
  res.json({
    message: `Update order with ID ${req.params.id}`,
    data: req.body,
  });
});

// DELETE order
router.delete("/:id", (req, res) => {
  res.json({ message: `Delete order with ID ${req.params.id}` });
});

module.exports = router;
