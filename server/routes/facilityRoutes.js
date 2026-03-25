const express = require("express");
const Facility = require("../models/Facility");

const router = express.Router();

// Get all facilities
router.get("/", async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ facilityName: 1 });
    res.json(facilities);
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ message: "Error fetching facilities" });
  }
});

// Get facility by id
router.get("/:id", async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.json(facility);
  } catch (error) {
    console.error("Error fetching facility:", error);
    res.status(500).json({ message: "Error fetching facility" });
  }
});

// Create facility
router.post("/", async (req, res) => {
  try {
    const { facilityName, description, status } = req.body;

    if (!facilityName) {
      return res.status(400).json({ message: "Facility name is required" });
    }

    const existingFacility = await Facility.findOne({
      facilityName: { $regex: facilityName, $options: "i" },
    });

    if (existingFacility) {
      return res.status(400).json({ message: "Facility already exists" });
    }

    const facility = new Facility({
      facilityName,
      description: description || "",
      status: status || "Active",
    });

    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    console.error("Error creating facility:", error);
    res.status(500).json({ message: "Error creating facility" });
  }
});

// Update facility
router.put("/:id", async (req, res) => {
  try {
    const { facilityName, description, status } = req.body;

    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    if (facilityName) {
      const existingFacility = await Facility.findOne({
        _id: { $ne: req.params.id },
        facilityName: { $regex: facilityName, $options: "i" },
      });

      if (existingFacility) {
        return res.status(400).json({ message: "Facility name already exists" });
      }

      facility.facilityName = facilityName;
    }

    if (description !== undefined) facility.description = description;
    if (status) facility.status = status;

    await facility.save();
    res.json(facility);
  } catch (error) {
    console.error("Error updating facility:", error);
    res.status(500).json({ message: "Error updating facility" });
  }
});

// Delete facility
router.delete("/:id", async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    res.json({ message: "Facility deleted successfully" });
  } catch (error) {
    console.error("Error deleting facility:", error);
    res.status(500).json({ message: "Error deleting facility" });
  }
});

module.exports = router;
