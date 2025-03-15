const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const mathRoutes = require("./routes/mathRoutes");
const authRoutes = require("./routes/authRoutes");
const setupSwagger = require("./swagger");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB(); 

const app = express();
setupSwagger(app);

app.use(cors());
app.use(express.json()); 


const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => (req.user && req.user.plan === "Pro" ? Infinity : 1000),
  message: "Rate limit exceeded, upgrade your plan.",
});

app.use("/api/math", limiter); 

// Routes
app.get("/", (req, res) => {
  res.send({ message: "Arithmetic API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/math", mathRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
