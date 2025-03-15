const trackUsage = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    
    const planLimits = { free: 5, normal: 10, pro: 15, premium: 20 };
    const userLimit = planLimits[user.planType] || 5;

    if (user.usage >= userLimit) {
      return res
        .status(429)
        .json({ error: "API limit reached. Upgrade your plan." });
    }

    user.usage += 1;
    await user.save();

    next();
  } catch (error) {
    res.status(500).json({ error: "Server error while tracking usage." });
  }
};

module.exports = trackUsage;
