const express = require("express");
const crypto = require("crypto");
const User = require("../models/UserModel");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

// Define plan limits
const planLimits = {
  free: 5,
  normal: 10,
  pro: 15,
  premium: 20,
};

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user registration and plan management.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and generate API keys
 *     description: Registers a user with an API key and assigns a plan type.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               planType:
 *                 type: string
 *                 enum: [free, normal, pro, premium]
 *                 default: free
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration successful
 *                 apiKey:
 *                   type: string
 *                   example: "b7f39c24e5d1a3e1c2d9f3b6a1a2f6b9"
 *                 secretKey:
 *                   type: string
 *                   example: "fjdkslajfie98439dsaf"
 *                 planType:
 *                   type: string
 *                   example: free
 *                 planLimit:
 *                   type: integer
 *                   example: 5
 *                 timestamp:
 *                   type: integer
 *                   example: 1710487654
 *                 signature:
 *                   type: string
 *                   example: "a87c9e47b3d1e5d4a6f8e9b2c3d4a1f2"
 *       400:
 *         description: Missing required fields or invalid input.
 *       500:
 *         description: Internal server error.
 */

router.post("/register", async (req, res) => {
  const { name, email, planType = "free" } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required" });

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.json({
        message: "Already registered",
        apiKey: user.apiKey,
        planType: user.planType,
      });
    }

    const apiKey = crypto.randomBytes(16).toString("hex");
    user = new User({
      name,
      email,
      apiKey,
      planType,
      planLimit: planLimits[planType] || 5, 
    });

    const timestamp = Math.floor(Date.now() / 1000); 
    const secretKey = user.generateSecretKey(); 

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(`${apiKey}:${timestamp}`)
      .digest("hex");

    await user.save();

    res.json({
      message: "Registration successful",
      apiKey,
      secretKey,
      planType, 
      planLimit: user.planLimit, 
      timestamp,
      signature, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/upgrade-plan:
 *   patch:
 *     summary: Upgrade user plan
 *     description: Allows authenticated users to upgrade their subscription plan.
 *     tags: [Authentication]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planType
 *             properties:
 *               planType:
 *                 type: string
 *                 enum: [free, normal, pro, premium]
 *                 example: pro
 *     responses:
 *       200:
 *         description: Plan upgraded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Plan upgraded to pro
 *                 planLimit:
 *                   type: integer
 *                   example: 15
 *       400:
 *         description: Invalid plan type.
 *       401:
 *         description: Unauthorized - Missing or invalid API key.
 *       500:
 *         description: Server error while upgrading plan.
 */
router.patch("/upgrade-plan", authenticate, async (req, res) => {
  try {
    const { planType } = req.body;
    const validPlans = Object.keys(planLimits); // ✅ Get valid plan types

    if (!validPlans.includes(planType)) {
      return res.status(400).json({ error: "Invalid plan type." });
    }

    const user = req.user;
    user.planType = planType;
    user.planLimit = planLimits[planType]; // ✅ Auto-update limit
    user.usage = 0; // ✅ Reset usage after upgrade

    await user.save();
    res.json({
      message: `Plan upgraded to ${planType}`,
      planLimit: user.planLimit,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while upgrading plan." });
  }
});

module.exports = router;
