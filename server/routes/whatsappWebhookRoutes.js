const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const Attendee = require("../models/Attendee");

// Meta WhatsApp webhook: reports whether each ticket was delivered, read or failed.
// Setup (Meta app → WhatsApp → Configuration):
//   Callback URL:  https://<render-service>/api/whatsapp/webhook
//   Verify token:  same value as WHATSAPP_WEBHOOK_VERIFY_TOKEN
//   Webhook field: messages
// Optional WHATSAPP_APP_SECRET (App settings → Basic) rejects requests not signed by Meta.

// One-time handshake when the callback URL is saved in Meta
router.get("/", (req, res) => {
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (
    verifyToken &&
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === verifyToken
  ) {
    return res.status(200).send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

const isSignedByMeta = (req) => {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return true;
  const signature = req.get("x-hub-signature-256") || "";
  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(req.rawBody || "").digest("hex")}`;
  return (
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  );
};

// An earlier status never overwrites a later one (Meta can send them out of order)
const STATUS_RANK = { sent: 1, delivered: 2, read: 3, failed: 4 };

const describeError = (error = {}) =>
  [
    error.code && `code ${error.code}`,
    error.title || error.message,
    error.error_data?.details,
  ]
    .filter(Boolean)
    .join(" – ");

router.post("/", async (req, res) => {
  if (!isSignedByMeta(req)) {
    console.warn("WhatsApp webhook rejected: signature doesn't match WHATSAPP_APP_SECRET");
    return res.sendStatus(401);
  }

  // Answer straight away; Meta retries if it doesn't get a 200 quickly
  res.sendStatus(200);

  try {
    const statuses = (req.body?.entry || [])
      .flatMap((entry) => entry.changes || [])
      .flatMap((change) => change.value?.statuses || []);

    for (const status of statuses) {
      if (!STATUS_RANK[status.status]) continue;

      const attendee = await Attendee.findOne({ whatsappMessageId: status.id });
      if (!attendee) continue;

      if (status.status === "failed") {
        const reason = describeError(status.errors?.[0]);
        console.error(`WhatsApp ticket to ${attendee.registrationNo} failed:`, reason);
        attendee.whatsappStatus = "failed";
        attendee.whatsappSent = false;
        attendee.whatsappError = reason || "Delivery failed";
      } else if ((STATUS_RANK[status.status] || 0) > (STATUS_RANK[attendee.whatsappStatus] || 0)) {
        attendee.whatsappStatus = status.status;
        attendee.whatsappError = undefined;
      } else {
        continue;
      }
      await attendee.save();
    }
  } catch (error) {
    console.error("WhatsApp webhook error:", error.message);
  }
});

module.exports = router;
