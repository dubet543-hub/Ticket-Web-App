// Ticket QR text looks like "DHAMAAKA|REG:MA0001|NAME:tushar|...|TKN:<token>".
// Some hardware scanners type "|" as "I", so each field allows either separator.
const readField = (raw, key, nextKey) => {
  const match = raw.match(new RegExp(`${key}:(.*?)\\|?I?${nextKey}:`));
  return match ? match[1].trim() : "";
};

// Short label shown in the scan box instead of the full QR text, e.g. "MA0001 · tushar"
export const describeScanValue = (raw = "") => {
  if (!raw.includes("TKN:")) return raw;
  const regNo = readField(raw, "REG", "NAME");
  const name = readField(raw, "NAME", "MOB");
  return [regNo, name].filter(Boolean).join(" · ") || "Ticket scanned";
};
