// Which login registered or scanned a ticket, as shown in reports: "Gate 1 (gate1)"
export const userLabel = (user) =>
  user?.name ? (user.username && user.username !== user.name ? `${user.name} (${user.username})` : user.name) : "";

export const registeredBy = (item) => userLabel(item?.createdBy) || "-";

// The server stores the scanning login's label on each check-in
export const scannedBy = (item) => (item?.isCheckedIn && item.checkInHistory?.at(-1)?.checkedInBy) || "-";
