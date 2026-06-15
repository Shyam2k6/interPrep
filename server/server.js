const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
