const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let inventory = [];
let nextId = 1;

// GET all items
app.get("/inventory", (req, res) => {
  res.json(inventory);
});

// POST add item
app.post("/inventory", (req, res) => {
  const { name, quantity, expiry } = req.body;

  if (!name || !quantity || !expiry) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const qty = Number(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number" });
  }

  const expDate = new Date(expiry);
  if (isNaN(expDate.getTime())) {
    return res.status(400).json({ message: "Invalid expiry date" });
  }

  const newItem = {
    id: nextId++,
    name,
    quantity: qty,
    expiry,
  };

  inventory.push(newItem);

  res.status(201).json(newItem);
});

// DELETE by ID
app.delete("/inventory/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = inventory.findIndex(item => item.id === id);
  if (index !== -1) {
    const removed = inventory.splice(index, 1);
    res.json({ message: "Item deleted", removed });
  } else {
    res.status(400).json({ message: "Invalid ID" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
