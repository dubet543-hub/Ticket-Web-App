const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const categoryRoutes = require("./routes/categoryRoutes");
const attendeeRoutes = require("./routes/attendeeRoutes");
const checkInRoutes = require("./routes/checkInRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Ticket Generator API is running...");
});

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/attendees", attendeeRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/users", userRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});