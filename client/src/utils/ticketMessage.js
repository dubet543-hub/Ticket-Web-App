export const generateTicketMessage = (attendee) => {
  if (!attendee) return "";

  const name = attendee.name || "Guest";
  const registrationNo = attendee.registrationNo || "";
  const mobile = attendee.mobile || "";
  const categoryName = attendee.category?.categoryName || "General";
  const amount = attendee.amount || 0;

  return `Hello ${name},

Your event ticket has been successfully generated.

Registration No: ${registrationNo}
Category: ${categoryName}
Ticket Amount: ₹ ${amount}
Mobile: ${mobile}

Please carry your QR ticket at the event entry.
This ticket can be scanned only once.

Thank you.`;
};

export const generateWhatsAppLink = (attendee) => {
  if (!attendee?.mobile) return "";

  const cleanMobile = attendee.mobile.replace(/\D/g, "");
  const message = generateTicketMessage(attendee);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/91${cleanMobile}?text=${encodedMessage}`;
};