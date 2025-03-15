const mongoose = require("mongoose");
const MathModel = require("../models/MathModel");

const mathController = {
  // Perform arithmetic operation via GET request
  performOperation: async (req, res) => {
    try {
      const { operation, a, b } = req.query;

      if (!operation || a === undefined || b === undefined) {
        return res.status(400).json({ error: "Provide operation, a, and b." });
      }

      const numA = parseFloat(a);
      const numB = parseFloat(b);

      if (isNaN(numA) || isNaN(numB)) {
        return res.status(400).json({ error: "Invalid numbers provided." });
      }

      let result;
      switch (operation) {
        case "add":
          result = numA + numB;
          break;
        case "subtract":
          result = numA - numB;
          break;
        case "multiply":
          result = numA * numB;
          break;
        case "divide":
          if (numB === 0) return res.status(400).json({ error: "Cannot divide by zero." });
          result = numA / numB;
          break;
        default:
          return res.status(400).json({ error: "Invalid operation." });
      }

      res.json({ operation, a: numA, b: numB, result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET all records
  getAll: async (req, res) => {
    try {
      const data = await MathModel.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET by ID
  getById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const data = await MathModel.findById(req.params.id);
      if (!data) return res.status(404).json({ message: "Not found" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // CREATE a new record
  create: async (req, res) => {
    try {
      const { operation, a, b } = req.body;

      if (!operation || a === undefined || b === undefined) {
        return res.status(400).json({ error: "Operation, a, and b are required." });
      }

      const numA = parseFloat(a);
      const numB = parseFloat(b);

      if (isNaN(numA) || isNaN(numB)) {
        return res.status(400).json({ error: "Invalid numbers provided." });
      }

      let result;
      switch (operation) {
        case "add":
          result = numA + numB;
          break;
        case "subtract":
          result = numA - numB;
          break;
        case "multiply":
          result = numA * numB;
          break;
        case "divide":
          if (numB === 0) return res.status(400).json({ error: "Cannot divide by zero." });
          result = numA / numB;
          break;
        default:
          return res.status(400).json({ error: "Invalid operation." });
      }

      const newItem = new MathModel({ operation, a: numA, b: numB, result });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // UPDATE by ID
  update: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const { operation, a, b } = req.body;

      const numA = parseFloat(a);
      const numB = parseFloat(b);

      if (isNaN(numA) || isNaN(numB)) {
        return res.status(400).json({ error: "Invalid numbers provided." });
      }

      let result;
      switch (operation) {
        case "add":
          result = numA + numB;
          break;
        case "subtract":
          result = numA - numB;
          break;
        case "multiply":
          result = numA * numB;
          break;
        case "divide":
          if (numB === 0) return res.status(400).json({ error: "Cannot divide by zero." });
          result = numA / numB;
          break;
        default:
          return res.status(400).json({ error: "Invalid operation." });
      }

      const updatedItem = await MathModel.findByIdAndUpdate(
        req.params.id,
        { operation, a: numA, b: numB, result },
        { new: true }
      );

      if (!updatedItem) return res.status(404).json({ message: "Not found" });
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE by ID
  delete: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const deletedItem = await MathModel.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: "Not found" });

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = mathController;
