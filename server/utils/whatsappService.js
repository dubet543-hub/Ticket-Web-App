// WhatsApp Integration Module
// Note: You'll need to set up WhatsApp Business API credentials in .env

const sendWhatsAppTicket = async (
  attendeePhone,
  attendeeName,
  registrationNo,
  qrImage,
  eventName = "Event"
) => {
  try {
    // This is a template structure. Implement with actual WhatsApp API provider
    // Popular options: Twilio, MessageBird, WhatsApp Business API, etc.

    // Example using Twilio (replace with your actual implementation)
    const message = {
      to: attendeePhone,
      from: process.env.WHATSAPP_FROM_NUMBER, // Format: +country_code_number
      body: `Hello ${attendeeName},\n\nYour ticket for ${eventName} is confirmed!\n\nRegistration No: ${registrationNo}\n\nPlease show this QR code at the event entry.\n\nThank you!`,
      mediaUrl: qrImage, // QR code image
    };

    // TODO: Implement actual API call to WhatsApp provider
    // Example with Twilio:
    /*
    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
      from: message.from,
      to: `whatsapp:${message.to}`,
      body: message.body,
      mediaUrl: [message.mediaUrl],
    });
    */

    console.log("WhatsApp message template prepared:", message);
    return {
      success: true,
      message: "WhatsApp ticket sent successfully",
      status: "delivered",
    };
  } catch (error) {
    console.error("Error sending WhatsApp ticket:", error);
    return {
      success: false,
      message: error.message,
      status: "failed",
    };
  }
};

module.exports = {
  sendWhatsAppTicket,
};
