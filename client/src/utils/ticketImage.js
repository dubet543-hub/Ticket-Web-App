const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const getTicketFileName = (attendee) =>
  `ticket-${attendee?.registrationNo || "member"}.png`;

// Event artwork in /public/tickets (1080 x 1919), with the arena colour of each design
const TEMPLATES = {
  female: { src: "/tickets/female.jpg", accent: "#a3123f" },
  male: { src: "/tickets/male.jpg", accent: "#2f8f8c" },
  enclosure: { src: "/tickets/enclosure.jpg", accent: "#c9a34a" },
};

// Enclosure/VIP categories get the VIP design; otherwise pick by category name, then gender
export const getTicketTemplate = (attendee) => {
  const category = (attendee?.category?.categoryName || "").toLowerCase();
  if (/enclosure|enclousre|vip/.test(category)) return TEMPLATES.enclosure;
  if (/female|women|lady|ladies|girl/.test(category)) return TEMPLATES.female;
  if (/male|men|gent|boy/.test(category)) return TEMPLATES.male;
  return attendee?.gender === "Female" ? TEMPLATES.female : TEMPLATES.male;
};

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

// Draws the event artwork with a details + QR panel underneath and returns it as a PNG Blob
export const generateTicketImage = async (attendee) => {
  const template = getTicketTemplate(attendee);
  const art = await loadImage(template.src);

  const W = art.naturalWidth;
  const ART_H = art.naturalHeight;
  const PANEL_H = 800;
  const H = ART_H + PANEL_H;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const gold = "#d9b56a";

  // Artwork
  ctx.drawImage(art, 0, 0, W, ART_H);

  // Panel
  const panel = ctx.createLinearGradient(0, ART_H, 0, H);
  panel.addColorStop(0, "#120a0c");
  panel.addColorStop(1, "#050304");
  ctx.fillStyle = panel;
  ctx.fillRect(0, ART_H, W, PANEL_H);
  ctx.fillStyle = template.accent;
  ctx.fillRect(0, ART_H, W, 10);

  // Gold frame
  ctx.strokeStyle = gold;
  ctx.lineWidth = 3;
  roundRect(ctx, 50, ART_H + 45, W - 100, PANEL_H - 90, 24);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = gold;
  ctx.font = `600 24px ${sans}`;
  ctx.letterSpacing = "8px";
  ctx.fillText("ADMIT ONE", W / 2, ART_H + 110);
  ctx.letterSpacing = "0px";

  // Name
  ctx.fillStyle = "#ffffff";
  fitText(ctx, attendee.name || "Guest", 700, 58, serif, W - 200);
  ctx.fillText(attendee.name || "Guest", W / 2, ART_H + 180);

  // Details
  const cols = [
    ["REG NO", attendee.registrationNo || "-"],
    ["CATEGORY", attendee.category?.categoryName || "General"],
    ["AMOUNT", `₹ ${attendee.amount || 0}`],
  ];
  const colW = (W - 160) / cols.length;
  cols.forEach(([label, value], i) => {
    const x = 80 + colW * i + colW / 2;
    ctx.fillStyle = gold;
    ctx.font = `600 20px ${sans}`;
    ctx.fillText(label, x, ART_H + 240);
    ctx.fillStyle = "#ffffff";
    fitText(ctx, String(value), 600, 30, sans, colW - 20);
    ctx.fillText(String(value), x, ART_H + 282);
  });

  // QR on a white card so scanners read it against the dark panel (kept sharp when scaled up)
  const box = 380;
  const boxX = (W - box) / 2;
  const boxY = ART_H + 315;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, boxX, boxY, box, box, 20);
  ctx.fill();
  if (attendee.qrCode) {
    const qr = await loadImage(attendee.qrCode);
    const size = box - 40;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qr, boxX + 20, boxY + 20, size, size);
    ctx.imageSmoothingEnabled = true;
  }

  // Footer
  ctx.fillStyle = "#bfb3a0";
  ctx.font = `500 22px ${sans}`;
  ctx.fillText("Show this QR code at the entry  ·  Valid for one scan only", W / 2, H - 70);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
};

export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
