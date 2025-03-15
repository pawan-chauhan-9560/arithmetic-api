const crypto = require("crypto");
const User = require("../models/UserModel");

const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const signature = req.headers["x-signature"];
    const timestamp = req.headers["x-timestamp"];

    if (!apiKey || !signature || !timestamp) {
      return res.status(401).json({ error: "API Key, Signature, and Timestamp required" });
    }

    const user = await User.findOne({ apiKey });
    if (!user) return res.status(403).json({ error: "Invalid API Key" });

    const requestTime = parseInt(timestamp);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - requestTime) > 3600) {
      return res.status(403).json({ error: "Request expired" });
    }

    if (!user.secretKey || typeof user.secretKey !== "string") {
      return res.status(500).json({ error: "Secret key is missing or invalid." });
    }

    const expectedSignature = crypto
      .createHmac("sha256", user.secretKey)
      .update(`${apiKey}:${timestamp}`)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(403).json({ error: "Invalid Signature" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error during authentication." });
  }
};

module.exports = authenticateApiKey;
