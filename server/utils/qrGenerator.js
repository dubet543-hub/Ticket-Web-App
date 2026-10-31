const QRCode = require("qrcode");
const crypto = require("crypto");

// Generate unique QR token
const generateQRToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Generate QR code image as data URL
const generateQRCode = async (qrToken) => {
  try {
    const qrImage = await QRCode.toDataURL(qrToken);
    return qrImage;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

// Entry type printed in the QR; mirrors getTicketTemplate in client/src/utils/ticketImage.js
const getEntryType = (categoryName = "", gender = "") => {
  const category = categoryName.toLowerCase();
  if (/enclosure|enclousre|vip/.test(category)) return "ENCLOSURE";
  if (/female|women|lady|ladies|girl/.test(category)) return "FEMALE";
  if (/male|men|gent|boy/.test(category)) return "MALE";
  return gender === "Female" ? "FEMALE" : "MALE";
};

// Single-line QR text (hardware scanners type it and press Enter, so no newlines).
// The qrToken (TKN) is what check-in looks up; the rest is readable by any phone scanner.
const buildQRPayload = (attendee, categoryName = "") => {
  const clean = (value) => String(value ?? "").replace(/\s*[|\r\n]+\s*/g, " ").trim();
  return [
    "DHAMAAKA",
    `REG:${clean(attendee.registrationNo)}`,
    `NAME:${clean(attendee.name)}`,
    `MOB:${clean(attendee.mobile)}`,
    `CAT:${clean(categoryName)}`,
    `ENTRY:${getEntryType(categoryName, attendee.gender)}`,
    `AMT:${clean(attendee.amount)}`,
    `TKN:${attendee.qrToken}`,
  ].join("|");
};

// Accepts a full QR payload or a bare token/registration number and returns the value to look up
const extractQRToken = (scanValue = "") => {
  const match = String(scanValue).match(/TKN:([A-Za-z0-9-]+)/);
  return match ? match[1] : String(scanValue).trim();
};

// Generate QR image (data URL) carrying the attendee's details
const generateAttendeeQRCode = (attendee, categoryName) =>
  QRCode.toDataURL(buildQRPayload(attendee, categoryName), {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 400,
  });

// Generate unique registration number
const generateRegistrationNo = (categoryName) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const prefix = categoryName.substring(0, 3).toUpperCase();
  return `${prefix}${timestamp}${random}`.substring(0, 12);
};

// Generate ticket number
const generateTicketNo = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TKT${timestamp}${random}`.substring(0, 15);
};

module.exports = {
  generateQRToken,
  generateQRCode,
  getEntryType,
  buildQRPayload,
  extractQRToken,
  generateAttendeeQRCode,
  generateRegistrationNo,
  generateTicketNo,
};
