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

// Prefix for registration numbers: CPD0001, CPD0002, ...
// Override with the REGISTRATION_PREFIX env var for a different event.
const REGISTRATION_PREFIX = (process.env.REGISTRATION_PREFIX || "CPD").toUpperCase();

// Cleans up a typed registration number for manual check-in:
// "cpd0001", "CPD 0001", "CPD-1" -> "CPD0001"; a bare number like "1" or "0001" -> "CPD0001"
const normalizeRegistrationNo = (value = "") => {
  const compact = String(value).trim().toUpperCase().replace(/[\s-]+/g, "");
  const match = compact.match(/^([A-Z]*)0*(\d+)$/);
  if (!match) return compact;
  const [, letters, digits] = match;
  return `${letters || REGISTRATION_PREFIX}${digits.padStart(4, "0")}`;
};

// Rebuilds a qrToken (UUID) from scanned text; null unless all 32 hex digits arrived
const toToken = (text = "") => {
  const hex = String(text).replace(/[^0-9a-f]/gi, "").toLowerCase();
  if (hex.length !== 32) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// Reads a scan (full QR text, a bare token, or a typed registration number).
// Hardware scanners sometimes drop Shift or stop early, so "TKN;" / "reg:" are accepted and a
// scan cut off before its token still yields the registration number near the start of the QR.
const parseScanValue = (scanValue = "") => {
  const raw = String(scanValue).trim();
  const tokenMatch = raw.match(/TKN\s*[:;]\s*([0-9a-f-]+)/i);
  const regMatch = raw.match(/REG\s*[:;]\s*([A-Z]*\d+)/i);
  const isQr = Boolean(tokenMatch || regMatch || /DHAMAAKA/i.test(raw));

  return {
    isQr,
    token: tokenMatch ? toToken(tokenMatch[1]) : isQr ? null : toToken(raw),
    registrationNo: regMatch
      ? normalizeRegistrationNo(regMatch[1])
      : isQr ? null : normalizeRegistrationNo(raw),
  };
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
  parseScanValue,
  REGISTRATION_PREFIX,
  normalizeRegistrationNo,
  generateAttendeeQRCode,
  generateRegistrationNo,
  generateTicketNo,
};
