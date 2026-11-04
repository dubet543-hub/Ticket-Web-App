import API from "../api";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const getTicketFileName = (attendee) =>
  `ticket-${attendee?.registrationNo || "member"}.png`;

// Event artwork in /public/tickets (1080 x 1919)
const TEMPLATES = {
  female: { src: "/tickets/female.jpg" },
  male: { src: "/tickets/male.jpg" },
  enclosure: { src: "/tickets/enclosure.jpg" },
};

// Enclosure/VIP categories get the VIP design; otherwise pick by category name, then gender
export const getEntryType = (attendee) => {
  const category = (attendee?.category?.categoryName || "").toLowerCase();
  if (/enclosure|enclousre|vip/.test(category)) return "enclosure";
  if (/female|women|lady|ladies|girl/.test(category)) return "female";
  if (/male|men|gent|boy/.test(category)) return "male";
  return attendee?.gender === "Female" ? "female" : "male";
};

export const getTicketTemplate = (attendee) => TEMPLATES[getEntryType(attendee)];

const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

// Shrinks the font until the text fits in maxWidth
const fitText = (ctx, text, weight, size, family, maxWidth) => {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    s -= 2;
  } while (ctx.measureText(text).width > maxWidth && s > 16);
};

// Ticket = the event poster with name, category, reg. no. and QR printed over the open
// staircase area (between the Centre Point logo and the "Male/Female Entry" lettering).
// Positions are for the 1080 x 1919 artwork in /public/tickets.
export const generateTicketImage = async (attendee, type = "image/png") => {
  const template = getTicketTemplate(attendee);
  const art = await loadImage(template.src);

  const W = art.naturalWidth;
  const H = art.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const gold = "#e8c67a";

  ctx.drawImage(art, 0, 0, W, H);

  // Dark card so the text stays readable over the candles and stairs
  const card = { x: 235, y: 658, w: W - 470, h: 508 };
  ctx.fillStyle = "rgba(12, 4, 6, 0.72)";
  roundRect(ctx, card.x, card.y, card.w, card.h, 26);
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  ctx.stroke();

  const name = (attendee.name || "Guest").toUpperCase();
  const category = (attendee.category?.categoryName || "General").toUpperCase();
  const regNo = attendee.registrationNo || "-";

  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 8;

  ctx.fillStyle = "#ffffff";
  fitText(ctx, name, 700, 52, serif, card.w - 60);
  ctx.fillText(name, W / 2, card.y + 70);

  ctx.fillStyle = gold;
  ctx.letterSpacing = "4px";
  fitText(ctx, category, 600, 30, sans, card.w - 60);
  ctx.fillText(category, W / 2, card.y + 118);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = "#ffffff";
  ctx.font = `700 36px ${sans}`;
  ctx.fillText(regNo, W / 2, card.y + 166);
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  // QR on a white square so scanners read it against the dark poster (kept sharp when scaled up)
  const box = 300;
  const boxX = (W - box) / 2;
  const boxY = card.y + 186;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, boxX, boxY, box, box, 14);
  ctx.fill();
  // Member lists arrive without the QR image, so fetch it for this one ticket
  const qrCode = attendee.qrCode ||
    (attendee._id ? (await API.get(`/attendees/${attendee._id}`)).data?.qrCode : null);
  if (qrCode) {
    const qr = await loadImage(qrCode);
    const size = box - 28;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qr, boxX + 14, boxY + 14, size, size);
    ctx.imageSmoothingEnabled = true;
  }

  return new Promise((resolve) => canvas.toBlob(resolve, type, 0.92));
};

export const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
