const express = require("express");
const router = express.Router();

const Attendee = require("../models/Attendee");
const Facility = require("../models/Facility");

// Scan / check-in by qrToken or registrationNo
router.post("/", async (req, res) => {
  try {
    const { scanValue, facility, notes, checkedInBy } = req.body;

    if (!scanValue) {
      return res.status(400).json({
        message: "scanValue is required",
      });
    }

    const attendee = await Attendee.findOne({
      $or: [{ qrToken: scanValue }, { registrationNo: scanValue }],
    }).populate("category");

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket",
      });
    }

    // Check if already checked in (prevent duplicate scan)
    if (attendee.isCheckedIn) {
      return res.status(400).json({
        success: false,
        message: "Ticket already checked in",
        attendee,
      });
    }

    // Validate facility if provided
    let facilityId = null;
    if (facility) {
      const facilityObj = await Facility.findById(facility);
      if (!facilityObj) {
        return res.status(404).json({
          message: "Facility not found",
        });
      }
      facilityId = facility;
    }

    // Record check-in
    attendee.isCheckedIn = true;
    attendee.checkedInAt = new Date();

    // Add to check-in history
    if (!attendee.checkInHistory) {
      attendee.checkInHistory = [];
    }

    attendee.checkInHistory.push({
      facility: facilityId,
      checkedInAt: new Date(),
      notes: notes || "",
      checkedInBy: checkedInBy || "system",
    });

    await attendee.save();

    // Return populated attendee with category
    const populatedAttendee = await Attendee.findById(attendee._id)
      .populate("category")
      .populate("checkInHistory.facility");

    res.status(200).json({
      success: true,
      message: "Check-in successful",
      attendee: populatedAttendee,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during check-in",
      error: error.message,
    });
  }
});

// Get check-in history for an attendee
router.get("/:attendeeId/history", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.attendeeId)
      .populate("checkInHistory.facility");

    if (!attendee) {
      return res.status(404).json({
        message: "Attendee not found",
      });
    }

    res.json({
      attendee: {
        registrationNo: attendee.registrationNo,
        name: attendee.name,
        isCheckedIn: attendee.isCheckedIn,
      },
      checkInHistory: attendee.checkInHistory || [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching check-in history",
      error: error.message,
    });
  }
});

module.exports = router;