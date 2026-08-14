const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const occupationRoutes = require("./routes/occupationRoutes");
const careerRoutes = require("./routes/careerRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const { runMigration } = require("./utils/migration");

connectDB();
runMigration();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/study-sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/occupations", occupationRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/assessments", assessmentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
