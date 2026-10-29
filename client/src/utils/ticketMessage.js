export const generateTicketMessage = (attendee, { updated = false } = {}) => {
  if (!attendee) return "";

  const name = attendee.name || "Guest";
  const registrationNo = attendee.registrationNo || "";
  const mobile = attendee.mobile || "";
  const categoryName = attendee.category?.categoryName || "General";
  const amount = attendee.amount || 0;

  const intro = updated
    ? "Your event ticket details have been updated. Please refer to the latest details below."
    : "Your event ticket has been successfully generated.";

  return `Hello ${name},

${intro}

Registration No: ${registrationNo}
Name: ${name}
Category: ${categoryName}
Ticket Amount: ₹ ${amount}
Mobile: ${mobile}${attendee.email ? `\nEmail: ${attendee.email}` : ""}

Please carry your QR ticket at the event entry.
This ticket can be scanned only once.

Thank you.`;
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
