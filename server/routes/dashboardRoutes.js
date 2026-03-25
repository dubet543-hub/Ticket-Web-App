const express = require("express");
const router = express.Router();

const Attendee = require("../models/Attendee");

// GET Dashboard Summary
router.get("/summary", async (req, res) => {
  try {
    const totalAttendees = await Attendee.countDocuments();

    const checkedInCount = await Attendee.countDocuments({
      isCheckedIn: true,
    });

    const pendingCount = await Attendee.countDocuments({
      isCheckedIn: false,
    });

    const whatsappSentCount = await Attendee.countDocuments({
      whatsappSent: true,
    });

    const whatsappFailedCount = await Attendee.countDocuments({
      whatsappStatus: "failed",
    });

    const duplicateScanCount = await Attendee.countDocuments({
      "checkInHistory.1": { $exists: true }, // Has multiple check-in entries
    });

    const revenueData = await Attendee.aggregate([
      {
        $group: {
          _id: null,
          totalTicketAmount: { $sum: "$amount" },
          totalCoverAmount: { $sum: "$coverAmount" },
        },
      },
    ]);

    const totalTicketAmount =
      revenueData.length > 0 ? revenueData[0].totalTicketAmount : 0;
    const totalCoverAmount =
      revenueData.length > 0 ? revenueData[0].totalCoverAmount : 0;

    // Category-wise count
    const categoryWiseCount = await Attendee.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $project: {
          categoryName: { $arrayElemAt: ["$categoryInfo.categoryName", 0] },
          count: 1,
        },
      },
    ]);

    res.json({
      totalAttendees,
      checkedInCount,
      pendingCount,
      whatsappSentCount,
      whatsappFailedCount,
      duplicateScanCount,
      totalTicketAmount,
      totalCoverAmount,
      categoryWiseCount,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;