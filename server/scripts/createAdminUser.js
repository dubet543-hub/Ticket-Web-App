const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// Admin credentials
const ADMIN_CREDENTIALS = {
  name: "Admin User",
  username: "admin",
  password: "admin123",
  role: "Admin",
  email: "admin@ticketgenerator.com",
  contact: "+91-9999999999",
  status: "Active",
};

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ticket-generator");
    console.log("✓ MongoDB Connected");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("✓ Admin user already exists!");
      console.log(`
Username: admin
Password: admin123
      `);
    } else {
      // Create new admin user
      const adminUser = new User(ADMIN_CREDENTIALS);
      await adminUser.save();

      console.log("✓ Admin user created successfully!");
      console.log(`
╔════════════════════════════════════════╗
║      ADMIN USER CREDENTIALS            ║
╠════════════════════════════════════════╣
║ Username: admin                        ║
║ Password: admin123                     ║
║ Email:    admin@ticketgenerator.com   ║
║ Role:     Admin                        ║
╚════════════════════════════════════════╝

⚠️  IMPORTANT: Change the password after first login!
      `);
    }

    // Display all users (optional)
    const allUsers = await User.find({}, "-password");
    console.log("\nAll Users in Database:");
    console.log("━".repeat(50));
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.username}) - Role: ${user.role} - Status: ${user.status}`);
    });

  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\n✓ Database connection closed");
  }
};

// Run the script
createAdminUser();
