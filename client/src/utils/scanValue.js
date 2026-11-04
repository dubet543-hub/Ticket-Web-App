// Ticket QR text looks like "DHAMAAKA|REG:CPD0001|NAME:TUSHAR|...|TKN:<token>".
// Hardware scanners can type "|" as "I" or drop Shift (":" -> ";", capitals -> small letters),
// and sometimes stop early, so fields are read loosely and each one is optional.
const readField = (raw, key, nextKey) => {
  const match = raw.match(new RegExp(`${key}\\s*[:;](.*?)(?:[|I\\\\]\\s*)?${nextKey}\\s*[:;]`, "i"));
  return match ? match[1].trim() : "";
};

// Short label shown in the scan box instead of the full QR text, e.g. "CPD0001 · TUSHAR"
export const describeScanValue = (raw = "") => {
  if (!/DHAMAAKA|TKN\s*[:;]|REG\s*[:;]/i.test(raw)) return raw;
  const regNo = (raw.match(/REG\s*[:;]\s*([A-Z]*\d+)/i)?.[1] || "").toUpperCase();
  const name = readField(raw, "NAME", "MOB").toUpperCase();
  return [regNo, name].filter(Boolean).join(" · ") || "Ticket scanned";
};
