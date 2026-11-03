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
const { diagnoseWhatsApp, ensureWebhookSubscription, isWhatsAppConfigured } = require("./utils/whatsappService");
const whatsappWebhookRoutes = require("./routes/whatsappWebhookRoutes");
const { requireAuth, requireAdmin } = require("./middleware/auth");

const app = express();

// Connect DB
connectDB();

// Middleware
// CLIENT_URL: comma-separated list of allowed origins (e.g. your Vercel URL).
// If unset, all origins are allowed (local development).
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);
// Raised limit: the client uploads the rendered ticket image for WhatsApp
// rawBody is kept for verifying Meta's webhook signature
app.use(express.json({ limit: "10mb", verify: (req, res, buf) => { req.rawBody = buf; } }));

// Test route
app.get("/", (req, res) => {
  res.send("Ticket Generator API is running...");
});

// Meta calls the webhook itself; it is checked by signature, not by login
app.use("/api/whatsapp/webhook", whatsappWebhookRoutes);

// Every other API call needs a logged-in user, except logging in
app.use("/api", (req, res, next) =>
  req.method === "POST" && req.path === "/users/login" ? next() : requireAuth(req, res, next)
);

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/attendees", attendeeRoutes);
app.use("/api/checkin", checkInRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/users", userRoutes);

// Lets the client choose automatic (Cloud API) or manual WhatsApp sending.
// Manual unless WHATSAPP_AUTO_SEND=true, so tickets aren't lost while Meta can't deliver.
app.get("/api/whatsapp/status", (req, res) => {
  res.json({ configured: isWhatsAppConfigured() && process.env.WHATSAPP_AUTO_SEND === "true" });
});

app.get("/api/whatsapp/diagnose", requireAdmin, async (req, res) => {
  res.json(await diagnoseWhatsApp());
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  ensureWebhookSubscription();
});