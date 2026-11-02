const TERMS = [
  "This pass admits 1.",
  "Digital pass shared on WhatsApp or email will be required for scanning at the entry.",
  "Management is not responsible for damage or loss of this pass.",
  "Items such as backpacks or huge handbags will not be allowed on the premises.",
  "No outside food or beverages allowed on the premises.",
  "The use of any illicit substance is prohibited in the premises of the event.",
  "All packages are final sale. Due to high volume of reservations, cancellations and package reductions will not be accepted.",
  "Once purchased, tickets cannot be exchanged, transferred or refunded unless there is a cancellation of the event.",
  "Alcohol will not be served to minors. Advised to carry ID proof.",
  "All consumables have to be purchased via coupons/cashless card, which will be exclusively available at the cash counters.",
  "The Management reserves the right to alter the program as necessary.",
  "In no event shall the organizers be responsible or liable for any failure or delay in the performance of its obligations hereunder arising out of or caused by, directly or indirectly, forces beyond its control, including, without limitation, strikes, work stoppages, accidents, acts of war or terrorism, civil or military disturbances, nuclear or natural catastrophes or acts of God, and interruptions, loss or malfunctions of utilities, communications or computer.",
  "Limited general admission tickets may be available at the door. Pricing is subject to change without notice.",
  "Kids are not allowed.",
  "Right to admission reserved. Misbehavior with any guest or employee will not be tolerated and such a person may be expelled at the discretion of Management.",
];

// Text sent with the ticket image in the manual WhatsApp flow (the automatic flow uses the Meta template)
export const generateTicketMessage = (attendee, { updated = false } = {}) => {
  if (!attendee) return "";

  const name = attendee.name || "Guest";
  const intro = updated
    ? "your Dhamaaka entry pass has been updated. Please use this latest pass."
    : "your Dhamaaka entry pass is attached.";

  return `Hello ${name}, ${intro}
Reg No: ${attendee.registrationNo || "-"} · ${attendee.category?.categoryName || "General"}
Show the QR code at the entry.

*Terms and Conditions*

${TERMS.map((term) => `• ${term}`).join("\n\n")}`;
};

// Normalise to an international number for wa.me (defaults to India +91)
const toWhatsAppNumber = (mobile) => {
  const digits = String(mobile || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits;
};

export const generateWhatsAppLink = (attendee, options) => {
  const number = toWhatsAppNumber(attendee?.mobile);
  if (!number) return "";

  const message = generateTicketMessage(attendee, options);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
