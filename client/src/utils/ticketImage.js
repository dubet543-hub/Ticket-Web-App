const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export const getTicketFileName = (attendee) =>
  `ticket-${attendee?.registrationNo || "member"}.png`;

// Draws the ticket (details + QR) on a canvas and returns it as a PNG Blob
export const generateTicketImage = async (attendee) => {
  const W = 600;
  const H = 880;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const font = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

  // Card
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = "#3f8f86";
  ctx.fillRect(0, 0, W, 130);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = `700 34px ${font}`;
  ctx.fillText("CENTRE POINT", W / 2, 60);
  ctx.font = `500 16px ${font}`;
  ctx.fillText("HOTELS & RESORTS  ·  EVENT TICKET", W / 2, 95);

  // Name
  ctx.fillStyle = "#0f172a";
  ctx.font = `700 30px ${font}`;
  ctx.fillText(attendee.name || "Guest", W / 2, 190);

  // Details
  const rows = [
    ["Registration No", attendee.registrationNo || "-"],
    ["Category", attendee.category?.categoryName || "General"],
    ["Amount", `₹ ${attendee.amount || 0}`],
    ["Mobile", attendee.mobile || "-"],
  ];
  let y = 245;
  rows.forEach(([label, value]) => {
    ctx.textAlign = "left";
    ctx.fillStyle = "#64748b";
    ctx.font = `500 18px ${font}`;
    ctx.fillText(label, 60, y);
    ctx.textAlign = "right";
    ctx.fillStyle = "#0f172a";
    ctx.font = `600 18px ${font}`;
    ctx.fillText(String(value), W - 60, y);
    y += 38;
  });

  // Dashed divider
  ctx.strokeStyle = "#cbd5e1";
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(40, y);
  ctx.lineTo(W - 40, y);
  ctx.stroke();
  ctx.setLineDash([]);

  // QR (kept sharp when scaled up)
  if (attendee.qrCode) {
    const qr = await loadImage(attendee.qrCode);
    const size = 320;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qr, (W - size) / 2, y + 25, size, size);
  }

  // Footer
  ctx.textAlign = "center";
  ctx.fillStyle = "#475569";
  ctx.font = `500 16px ${font}`;
  ctx.fillText("Show this QR code at the event entry.", W / 2, H - 55);
  ctx.fillText("This ticket can be scanned only once.", W / 2, H - 30);

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
