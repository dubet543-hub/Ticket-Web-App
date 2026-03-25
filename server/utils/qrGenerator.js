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
  generateRegistrationNo,
  generateTicketNo,
};
