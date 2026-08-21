const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
if (!process.env.VERCEL) require("dotenv").config();

const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure database is authenticated in serverless environments
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await sequelize.authenticate();
      dbInitialized = true;
    } catch (err) {
      console.error("Database connection error:", err);
    }
  }
  next();
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.use(express.json( { limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/cart", cartRoutes);

app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.get(["/api/health", "/health"], (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error("Express error handler:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

if (require.main === module) {
  const start = async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connected.");
      await sequelize.sync({ alter: true });
      console.log("Models synchronized.");
      app.listen(PORT, () => {
        console.log("Server running on port " + PORT);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };
  start();
}

module.exports = app;
