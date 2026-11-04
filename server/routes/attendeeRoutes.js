const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const Attendee = require("../models/Attendee");
const Category = require("../models/Category");
const { sendWhatsAppTicket } = require("../utils/whatsappService");
const { generateAttendeeQRCode, REGISTRATION_PREFIX } = require("../utils/qrGenerator");
const { requireAdmin } = require("../middleware/auth");

// Helper: next registration number after the highest one in use
// (not a count, so deleted members never cause a repeated number)
const generateRegistrationNo = async () => {
  const pattern = new RegExp(`^${REGISTRATION_PREFIX}(\\d+)$`);
  const existing = await Attendee.find({ registrationNo: pattern }, { registrationNo: 1 }).lean();
  const highest = existing.reduce(
    (max, { registrationNo }) => Math.max(max, Number(registrationNo.match(pattern)[1])),
    0
  );
  return `${REGISTRATION_PREFIX}${String(highest + 1).padStart(4, "0")}`;
};

// Helper: price from the form, or the fallback when left blank
const toAmount = (value, fallback = 0) =>
  value === undefined || value === null || value === "" ? fallback : Number(value) || 0;

// Helper: generate ticket number
const generateTicketNo = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TICKET${timestamp}${random}`.substring(0, 15);
};



// =====================
// CREATE ATTENDEE
// =====================
router.post("/", async (req, res) => {
  try {
    const { name: rawName, email, mobile, gender, age, category, amount, coverAmount, sendWhatsApp } = req.body;
    // Names are stored in capitals (as printed on the ticket and in the QR)
    const name = String(rawName || "").trim().toUpperCase();

    if (!name || !mobile || !category) {
      return res.status(400).json({
        message: "name, mobile, and category are required",
      });
    }

    const foundCategory = await Category.findById(category);

    if (!foundCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    let registrationNo = await generateRegistrationNo();
    const ticketNo = generateTicketNo();
    const ticketAmount = toAmount(amount, foundCategory.price);
    const ticketCoverAmount = toAmount(coverAmount, foundCategory.coverPrice);
    const qrToken = crypto.randomUUID();
    const qrCode = await generateAttendeeQRCode(
      { registrationNo, name, mobile, gender, amount: ticketAmount, qrToken },
      foundCategory.categoryName
    );

    const newAttendee = new Attendee({
      registrationNo,
      ticketNo,
      name,
      email,
      mobile,
      gender,
      age,
      category: foundCategory._id,
      amount: ticketAmount,
      coverAmount: ticketCoverAmount,
      qrToken,
      qrCode,
      whatsappNo: mobile,
      whatsappStatus: "pending",
      // The login that registered this member (shown as "Entry By" in reports)
      createdBy: req.user?._id,
    });

    // Two members saved at the same moment can get the same number; retry with the next one
    let savedAttendee;
    for (let attempt = 1; ; attempt++) {
      try {
        savedAttendee = await newAttendee.save();
        break;
      } catch (error) {
        if (error.code !== 11000 || !error.keyPattern?.registrationNo || attempt >= 5) throw error;
        registrationNo = await generateRegistrationNo();
        newAttendee.registrationNo = registrationNo;
        newAttendee.qrCode = await generateAttendeeQRCode(
          { registrationNo, name, mobile, gender, amount: ticketAmount, qrToken },
          foundCategory.categoryName
        );
      }
    }

    // Send WhatsApp ticket if requested
    if (sendWhatsApp && mobile) {
      const whatsappResult = await sendWhatsAppTicket(
        mobile,
        name,
        registrationNo,
        qrCode,
        "Dhamaaka"
      );

      savedAttendee.whatsappStatus = whatsappResult.status;
      savedAttendee.whatsappSent = whatsappResult.success;
      savedAttendee.whatsappSentAt = whatsappResult.success ? new Date() : null;
      savedAttendee.whatsappMessageId = whatsappResult.messageId;
      savedAttendee.whatsappError = whatsappResult.success ? undefined : whatsappResult.message;

      await savedAttendee.save();
    }

    const populatedAttendee = await Attendee.findById(savedAttendee._id).populate("category");
    res.status(201).json(populatedAttendee);
  } catch (error) {
    res.status(500).json({
      message: "Error creating attendee",
      error: error.message,
    });
  }
});



// =====================
// GET ALL ATTENDEES
// =====================
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendees",
      error: error.message,
    });
  }
});



// =====================
// GET SINGLE ATTENDEE
// =====================
// Ticket number the next new member will get (shown on the Register Member form).
// A preview only: if two people save at the same moment, the second gets the one after.
router.get("/next-registration-no", async (req, res) => {
  try {
    res.json({ registrationNo: await generateRegistrationNo() });
  } catch (error) {
    res.status(500).json({ message: "Error reading next ticket number", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id).populate("category");

    if (!attendee) {
      return res.status(404).json({
        message: "Attendee not found",
      });
    }

    res.status(200).json(attendee);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendee",
      error: error.message,
    });
  }
});



// =====================
// UPDATE ATTENDEE
// =====================
router.put("/:id", async (req, res) => {
  try {
    const { name, email, mobile, gender, age, category, amount, coverAmount } = req.body;

    const attendee = await Attendee.findById(req.params.id);

    if (!attendee) {
      return res.status(404).json({
        message: "Attendee not found",
      });
    }

    let foundCategory = null;

    if (category) {
      foundCategory = await Category.findById(category);

      if (!foundCategory) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    }

    // Update fields (QR token + registration stay SAME 🔒; QR image is redrawn with the new details)
    attendee.name = name ?? attendee.name;
    attendee.email = email ?? attendee.email;
    attendee.mobile = mobile ?? attendee.mobile;
    attendee.whatsappNo = attendee.mobile;
    attendee.gender = gender ?? attendee.gender;
    attendee.age = age ?? attendee.age;

    if (foundCategory) {
      attendee.category = foundCategory._id;
    }

    attendee.amount = toAmount(amount, attendee.amount);
    attendee.coverAmount = toAmount(coverAmount, attendee.coverAmount);
    attendee.lastModifiedBy = req.user?._id;

    const currentCategory = foundCategory || (await Category.findById(attendee.category));
    attendee.qrCode = await generateAttendeeQRCode(attendee, currentCategory?.categoryName);

    const updatedAttendee = await attendee.save();

    const populatedAttendee = await Attendee.findById(updatedAttendee._id).populate(
      "category"
    );

    res.status(200).json(populatedAttendee);
  } catch (error) {
    res.status(500).json({
      message: "Error updating attendee",
      error: error.message,
    });
  }
});



// =====================
// DELETE ALL ATTENDEES (admin only)
// =====================
// Clears test data so ticket numbers restart at CPD0001; categories, gates and logins stay.
// The phrase guards against a stray request wiping real bookings.
router.delete("/", requireAdmin, async (req, res) => {
  try {
    if (req.body?.confirm !== "DELETE ALL") {
      return res.status(400).json({ message: 'Type "DELETE ALL" to confirm' });
    }
    const { deletedCount } = await Attendee.deleteMany({});
    console.log(`All members deleted by ${req.user?.username}: ${deletedCount}`);
    res.status(200).json({ message: `Deleted ${deletedCount} members`, deletedCount });
  } catch (error) {
    res.status(500).json({ message: "Error deleting members", error: error.message });
  }
});

// =====================
// DELETE ATTENDEE
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);

    if (!attendee) {
      return res.status(404).json({
        message: "Attendee not found",
      });
    }

    await attendee.deleteOne();

    res.status(200).json({
      message: "Attendee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting attendee",
      error: error.message,
    });
  }
});

// =====================
// RESEND WHATSAPP TICKET
// Body (optional): { ticketImage } — the rendered ticket as a data URL; falls back to the QR code
// =====================
router.post("/:id/resend-whatsapp", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id).populate("category");

    if (!attendee) {
      return res.status(404).json({
        message: "Attendee not found",
      });
    }

    if (!attendee.mobile) {
      return res.status(400).json({
        message: "Mobile number not found for this attendee",
      });
    }

    const { ticketImage } = req.body || {};
    const image = typeof ticketImage === "string" && ticketImage.startsWith("data:image/")
      ? ticketImage
      : attendee.qrCode;

    const whatsappResult = await sendWhatsAppTicket(
      attendee.mobile,
      attendee.name,
      attendee.registrationNo,
      image,
      "Dhamaaka"
    );

    attendee.whatsappStatus = whatsappResult.status;
    attendee.whatsappSent = whatsappResult.success;
    attendee.whatsappSentAt = whatsappResult.success ? new Date() : attendee.whatsappSentAt;
    if (whatsappResult.success) attendee.whatsappMessageId = whatsappResult.messageId;
    attendee.whatsappError = whatsappResult.success ? undefined : whatsappResult.message;

    await attendee.save();

    res.status(whatsappResult.success ? 200 : 502).json({
      success: whatsappResult.success,
      message: whatsappResult.message,
      attendee,
      whatsappStatus: attendee.whatsappStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error resending WhatsApp ticket",
      error: error.message,
    });
  }
});

module.exports = router;