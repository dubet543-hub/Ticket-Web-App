const express = require("express");
const router = express.Router();

const Attendee = require("../models/Attendee");

// Attendee report with status filter
router.get("/attendees", async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};

    if (status === "checked-in") {
      filter.isCheckedIn = true;
    } else if (status === "pending") {
      filter.isCheckedIn = false;
    }

    const attendees = await Attendee.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    const totalAttendees = attendees.length;
    const checkedInCount = attendees.filter((item) => item.isCheckedIn).length;
    const pendingCount = totalAttendees - checkedInCount;
    const totalTicketAmount = attendees.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    const totalCoverAmount = attendees.reduce(
      (sum, item) => sum + (item.coverAmount || 0),
      0
    );

    res.status(200).json({
      summary: {
        totalAttendees,
        checkedInCount,
        pendingCount,
        totalTicketAmount,
        totalCoverAmount,
      },
      attendees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendee report",
      error: error.message,
    });
  }
});

module.exports = router;