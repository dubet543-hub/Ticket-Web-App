// WhatsApp Integration Module (Meta WhatsApp Cloud API)
// Required .env: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME
// Optional .env: WHATSAPP_TEMPLATE_LANG (default "en"), WHATSAPP_COUNTRY_CODE (default "91"),
//                WHATSAPP_API_VERSION (default "v23.0")

const getConfig = () => ({
  token: process.env.WHATSAPP_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  templateName: process.env.WHATSAPP_TEMPLATE_NAME,
  templateLang: process.env.WHATSAPP_TEMPLATE_LANG || "en",
  countryCode: process.env.WHATSAPP_COUNTRY_CODE || "91",
  apiVersion: process.env.WHATSAPP_API_VERSION || "v23.0",
});

// "98765 43210" -> "919876543210" (Cloud API wants digits only, with country code)
const formatPhone = (phone, countryCode) => {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length === 10 ? `${countryCode}${digits}` : digits;
};

const graphRequest = async (config, path, options = {}) => {
  const response = await fetch(
    `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}${path && !path.startsWith("?") ? `/${path}` : path}`,
    {
      ...options,
      headers: { Authorization: `Bearer ${config.token}`, ...options.headers },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    // Keep Meta's code/subcode: the message alone ("no permission") doesn't say why
    const err = data?.error || {};
    const codes = [err.code && `code ${err.code}`, err.error_subcode && `subcode ${err.error_subcode}`]
      .filter(Boolean)
      .join(", ");
    const detail = err.error_data?.details ? ` – ${err.error_data.details}` : "";
    throw new Error(
      `${err.message || `WhatsApp API error (${response.status})`}${codes ? ` (${codes})` : ""}${detail}`
    );
  }
  return data;
};

const isWhatsAppConfigured = () => {
  const config = getConfig();
  return Boolean(config.token && config.phoneNumberId && config.templateName);
};

// Upload a base64 image data URL (PNG or JPEG) and return its media id
const uploadImage = async (config, imageDataUrl) => {
  const match = imageDataUrl.match(/^data:(image\/(?:png|jpeg));base64,/);
  const mimeType = match ? match[1] : "image/png";
  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
  const fileName = mimeType === "image/jpeg" ? "ticket.jpg" : "ticket.png";
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", mimeType);
  form.append("file", new Blob([Buffer.from(base64, "base64")], { type: mimeType }), fileName);

  const data = await graphRequest(config, "media", { method: "POST", body: form });
  return data.id;
};

const sendWhatsAppTicket = async (
  attendeePhone,
  attendeeName,
  registrationNo,
  ticketImage,
  eventName = "Event"
) => {
  const config = getConfig();

  if (!isWhatsAppConfigured()) {
    console.warn("WhatsApp not configured: set WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME");
    return {
      success: false,
      message: "WhatsApp is not configured on the server",
      status: "not-sent",
    };
  }

  let step = "Uploading ticket image";
  try {
    const mediaId = await uploadImage(config, ticketImage);

    step = "Sending template message";

    // Template: Image header + body "Hello {{1}}, ... Registration No: {{2}} ..."
    const data = await graphRequest(config, "messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formatPhone(attendeePhone, config.countryCode),
        type: "template",
        template: {
          name: config.templateName,
          language: { code: config.templateLang },
          components: [
            {
              type: "header",
              parameters: [{ type: "image", image: { id: mediaId } }],
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: attendeeName },
                { type: "text", text: registrationNo },
              ],
            },
          ],
        },
      }),
    });

    console.log(`WhatsApp ticket sent for ${eventName}:`, data?.messages?.[0]?.id);
    return {
      success: true,
      message: "WhatsApp ticket sent successfully",
      status: "sent",
    };
  } catch (error) {
    console.error(`Error sending WhatsApp ticket (${step}):`, error.message);
    return {
      success: false,
      message: `${step} failed: ${error.message}`,
      status: "failed",
    };
  }
};

// Read-only check that the token can see the configured phone number
const diagnoseWhatsApp = async () => {
  const config = getConfig();
  if (!isWhatsAppConfigured()) return { configured: false };

  try {
    const phoneNumber = await graphRequest(config, "?fields=display_phone_number,verified_name,quality_rating,platform_type,status");
    return { configured: true, phoneNumber: { ok: true, ...phoneNumber } };
  } catch (error) {
    return { configured: true, phoneNumber: { ok: false, error: error.message } };
  }
};

module.exports = {
  diagnoseWhatsApp,
  isWhatsAppConfigured,
  sendWhatsAppTicket,
};
