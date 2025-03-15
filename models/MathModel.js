const mongoose = require("mongoose");

const mathSchema = new mongoose.Schema({
  operation: { type: String, required: true },
  a: { type: Number, required: true },
  b: { type: Number, required: true },
  result: { type: Number, required: true },
});

module.exports = mongoose.model("Math", mathSchema);
