const express = require("express");
const User = require("../models/User");
const Attendee = require("../models/Attendee");
const { issueToken, requireAdmin, canDeleteMembers, userLabel } = require("../middleware/auth");

const router = express.Router();

// True when `user` is the only active Admin left (removing it would lock everyone out of admin pages)
const isLastActiveAdmin = async (user) =>
  user.role === "Admin" &&
  user.status === "Active" &&
  (await User.countDocuments({ role: "Admin", status: "Active", _id: { $ne: user._id } })) === 0;

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get user by id, with how many members this login registered and scanned in
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check-ins store the login's label as it was then, so a renamed login counts under its new name only
    const [registeredCount, scannedCount] = await Promise.all([
      Attendee.countDocuments({ createdBy: user._id }),
      Attendee.countDocuments({ "checkInHistory.checkedInBy": userLabel(user) }),
    ]);
    res.json({ ...user.toObject(), registeredCount, scannedCount });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Create user
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, username, password, role, contact, email, status } = req.body;

    // Validation
    if (!name || !username || !password) {
      return res.status(400).json({
        message: "Name, username, and password are required",
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({
      name,
      username,
      password,
      role: role || "DataEntry",
      contact: contact || "",
      email: email || "",
      status: status || "Active",
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    // Shows the Delete button in Member Report for this login
    userResponse.canDeleteMembers = canDeleteMembers(user);

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update user
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, username, password, role, contact, email, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if new username already exists
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      user.username = username;
    }

    // Your own login and the last active Admin can't lose admin access or be made inactive
    const losesAdmin = (role && role !== "Admin") || (status && status !== "Active");
    if (losesAdmin && user.role === "Admin") {
      if (String(user._id) === String(req.user?._id)) {
        return res.status(400).json({ message: "You can't remove admin access from your own login" });
      }
      if (await isLastActiveAdmin(user)) {
        return res.status(400).json({ message: "This is the only active Admin, so it must stay an active Admin" });
      }
    }

    if (name) user.name = name;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (role) user.role = role;
    if (contact !== undefined) user.contact = contact;
    if (email !== undefined) user.email = email;
    if (status) user.status = status;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    // Shows the Delete button in Member Report for this login
    userResponse.canDeleteMembers = canDeleteMembers(user);

    res.json(userResponse);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Delete user
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    if (req.params.id === String(req.user?._id)) {
      return res.status(400).json({ message: "You can't delete your own login" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (await isLastActiveAdmin(user)) {
      return res.status(400).json({ message: "This is the only active Admin, so it can't be deleted" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;
    // Shows the Delete button in Member Report for this login
    userResponse.canDeleteMembers = canDeleteMembers(user);

    const token = issueToken(user);

    res.json({
      message: "Login successful",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
