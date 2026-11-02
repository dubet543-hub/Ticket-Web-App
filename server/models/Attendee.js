const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema(
  {
    registrationNo: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true, // printed on the ticket in capitals
    },

    email: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    age: {
      type: Number,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    coverAmount: {
      type: Number,
      default: 0,
    },

    qrCode: {
      type: String, // store QR image path or base64
    },

    qrToken: {
      type: String, // permanent unique scan value
      unique: true,
    },

    isCheckedIn: {
      type: Boolean,
      default: false,
    },

    checkedInAt: {
      type: Date,
    },

    // Times this ticket was scanned or typed again after entry (refused)
    duplicateScanCount: {
      type: Number,
      default: 0,
    },

    lastDuplicateScanAt: {
      type: Date,
    },

    whatsappSent: {
      type: Boolean,
      default: false,
    },

    whatsappStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "read", "failed", "not-sent"],
      default: "not-sent",
    },

    whatsappSentAt: {
      type: Date,
    },

    // Meta message id of the last ticket sent; delivery webhooks are matched on it
    whatsappMessageId: {
      type: String,
      index: true,
    },

    // Reason Meta gave when the last ticket could not be sent or delivered
    whatsappError: {
      type: String,
    },

    whatsappNo: {
      type: String,
      trim: true,
    },

    ticketNo: {
      type: String,
      unique: true,
    },

    checkInHistory: [
      {
        facility: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Facility",
        },
        checkedInAt: Date,
        notes: String,
        checkedInBy: String,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendee", attendeeSchema);