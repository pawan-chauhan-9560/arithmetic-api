const mongoose = require("mongoose");

const crudController = (Model) => ({
  // GET all records
  getAll: async (req, res) => {
    try {
      const data = await Model.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET by ID with ObjectId validation
  getById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const data = await Model.findById(req.params.id);
      if (!data) return res.status(404).json({ message: "Not found" });

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // CREATE a new record with computed result
  create: async (req, res) => {
    try {
      const { operation, a, b } = req.body;

      // Ensure required fields are present
      if (!operation || a === undefined || b === undefined) {
        return res
          .status(400)
          .json({ error: "Operation, a, and b are required." });
      }

      let result;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0)
            return res.status(400).json({ error: "Cannot divide by zero." });
          result = a / b;
          break;
        default:
          return res
            .status(400)
            .json({
              error:
                "Invalid operation. Use add, subtract, multiply, or divide.",
            });
      }

      const newItem = new Model({ operation, a, b, result });
      await newItem.save();
      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // UPDATE by ID and recalculate result
  update: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const { operation, a, b } = req.body;

      let result;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0)
            return res.status(400).json({ error: "Cannot divide by zero." });
          result = a / b;
          break;
        default:
          return res
            .status(400)
            .json({
              error:
                "Invalid operation. Use add, subtract, multiply, or divide.",
            });
      }

      const updatedItem = await Model.findByIdAndUpdate(
        req.params.id,
        { operation, a, b, result },
        { new: true }
      );

      if (!updatedItem) return res.status(404).json({ message: "Not found" });
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE by ID with validation
  delete: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const deletedItem = await Model.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: "Not found" });

      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
});

module.exports = crudController;
