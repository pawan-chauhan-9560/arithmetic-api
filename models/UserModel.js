const mongoose = require("mongoose");
const crypto = require("crypto");

const planLimits = {
  free: 5,
  normal: 10,
  pro: 15,
  premium: 20
};

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true, unique: true },
  secretKey: { type: String, required: true },
  usage: { type: Number, default: 0 },
  planType: { type: String, enum: ["free", "normal", "pro", "premium"], default: "free" },
  planLimit: { type: Number, default: function () { return planLimits[this.planType] || 5; } }
});

UserSchema.pre("save", function (next) {
  this.planLimit = planLimits[this.planType] || 5;
  next();
});

UserSchema.methods.generateSecretKey = function () {
  const secretKey = crypto.randomBytes(32).toString("hex");
  this.secretKey = secretKey;
  return secretKey;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
