const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const Attendee = require("../models/Attendee");
const Category = require("../models/Category");
const { sendWhatsAppTicket } = require("../utils/whatsappService");
const { generateAttendeeQRCode, REGISTRATION_PREFIX } = require("../utils/qrGenerator");
const { requireMemberDelete } = require("../middleware/auth");

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

// Helper: "+91 98765 43210" / "098765-43210" -> "9876543210"; anything else is kept as typed
const toMobile = (value) => {
  const typed = String(value ?? "").trim();
  const digits = typed.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.length === 10 ? digits : typed;
};

// Helper: price from the form, or the fallback when left blank
const toAmount = (value, fallback = 0) =>
  value === undefined || value === null || value === "" ? fallback : Number(value) || 0;

// Helper: generate ticket number (internal id, unique; the printed number is registrationNo)
// Not cut short: a shortened one repeated for members saved within the same 10 seconds
const generateTicketNo = () => `TICKET${Date.now()}${crypto.randomInt(10000).toString().padStart(4, "0")}`;



// Error with an HTTP status, for messages the form shows as they are
const httpError = (status, message) => Object.assign(new Error(message), { status });

// Saves one member with the next ticket number. Used by the form and by bulk add.
const createAttendee = async ({ name: rawName, email, mobile, gender, age, category, amount, coverAmount }, user) => {
  // Names are stored in capitals (as printed on the ticket and in the QR)
  const name = String(rawName || "").trim().toUpperCase();
  mobile = toMobile(mobile);

  if (!name || !mobile || !category) {
    throw httpError(400, "name, mobile, and category are required");
  }

  const foundCategory = await Category.findById(category);

  if (!foundCategory) {
    throw httpError(404, "Category not found");
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
    createdBy: user?._id,
  });

  // Two members saved at the same moment can get the same number; retry with the next one
  for (let attempt = 1; ; attempt++) {
    try {
      return await newAttendee.save();
    } catch (error) {
      if (error.code !== 11000 || attempt >= 5) throw error;
      if (error.keyPattern?.ticketNo) {
        newAttendee.ticketNo = generateTicketNo();
        continue;
      }
      if (!error.keyPattern?.registrationNo) throw error;
      registrationNo = await generateRegistrationNo();
      newAttendee.registrationNo = registrationNo;
      newAttendee.qrCode = await generateAttendeeQRCode(
        { registrationNo, name, mobile, gender, amount: ticketAmount, qrToken },
        foundCategory.categoryName
      );
    }
  }
};

// =====================
// CREATE ATTENDEE
// =====================
router.post("/", async (req, res) => {
  try {
    const savedAttendee = await createAttendee(req.body, req.user);
    const { mobile, name, registrationNo, qrCode } = savedAttendee;

    // Send WhatsApp ticket if requested
    if (req.body.sendWhatsApp && mobile) {
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
    if (error.status) return res.status(error.status).json({ message: error.message });
    res.status(500).json({
      message: "Error creating attendee",
      error: error.message,
    });
  }
});

// =====================
// BULK ADD ATTENDEES
// Body: { members: [{ name, mobile, category, amount, coverAmount }] }
// Saved one by one in list order, so ticket numbers follow the list. No tickets are sent.
// =====================
router.post("/bulk", async (req, res) => {
  const members = Array.isArray(req.body?.members) ? req.body.members : [];
  if (!members.length || members.length > 500) {
    return res.status(400).json({ message: "Send between 1 and 500 members" });
  }

  const added = [];
  const failed = [];
  for (const [index, member] of members.entries()) {
    try {
      const { registrationNo, name } = await createAttendee(member, req.user);
      added.push({ row: index + 1, registrationNo, name });
    } catch (error) {
      failed.push({ row: index + 1, name: member?.name || "", message: error.message });
    }
  }

  res.status(failed.length && !added.length ? 400 : 201).json({ added, failed });
});



// =====================
// GET ALL ATTENDEES
// =====================
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find()
      .populate("category")
      .sort({ registrationNo: 1, createdAt: 1 });

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
    attendee.mobile = mobile === undefined || mobile === null ? attendee.mobile : toMobile(mobile);
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
// DELETE ATTENDEE
// =====================
router.delete("/:id", requireMemberDelete, async (req, res) => {
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