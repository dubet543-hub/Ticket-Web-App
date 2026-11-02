const express = require("express");
const router = express.Router();

const Attendee = require("../models/Attendee");
const Facility = require("../models/Facility");
const { extractQRToken, normalizeRegistrationNo } = require("../utils/qrGenerator");

// Scan / check-in by qrToken (bare or inside the full QR payload) or a typed registrationNo
router.post("/", async (req, res) => {
  try {
    const { scanValue, facility, notes, checkedInBy } = req.body;

    if (!scanValue) {
      return res.status(400).json({
        message: "scanValue is required",
      });
    }

    const lookupValue = extractQRToken(scanValue);
    const registrationNo = normalizeRegistrationNo(lookupValue);
    const isQrScan = String(scanValue).includes("TKN:");

    const attendee = await Attendee.findOne({
      $or: [{ qrToken: lookupValue }, { registrationNo }],
    }).populate("category");

    if (!attendee) {
      return res.status(404).json({
        success: false,
        // For typed numbers, show what was searched so staff can spot a typo
        message: isQrScan || registrationNo.length > 12 ? "Invalid ticket" : `No ticket found for ${registrationNo}`,
      });
    }

    // A ticket works once, whether it was scanned or typed: any repeat is refused and counted
    const rejectDuplicate = async () => {
      const duplicate = await Attendee.findByIdAndUpdate(
        attendee._id,
        { $inc: { duplicateScanCount: 1 }, $set: { lastDuplicateScanAt: new Date() } },
        { new: true }
      )
        .populate("category")
        .populate("checkInHistory.facility");

      return res.status(409).json({
        success: false,
        duplicate: true,
        message: `Already scanned – ${duplicate.registrationNo} was already used for entry`,
        attendee: duplicate,
      });
    };

    if (attendee.isCheckedIn) return rejectDuplicate();

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

    // Check in only if still unused, in one atomic step, so two scans of the same
    // ticket arriving together (double Enter, two gates) can't both get through
    const now = new Date();
    const populatedAttendee = await Attendee.findOneAndUpdate(
      { _id: attendee._id, isCheckedIn: { $ne: true } },
      {
        $set: { isCheckedIn: true, checkedInAt: now },
        $push: {
          checkInHistory: {
            facility: facilityId,
            checkedInAt: now,
            notes: notes || "",
            checkedInBy: checkedInBy || "system",
          },
        },
      },
      { new: true }
    )
      .populate("category")
      .populate("checkInHistory.facility");

    if (!populatedAttendee) return rejectDuplicate();

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