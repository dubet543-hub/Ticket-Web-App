// Excel (.xlsx) download for the report pages. Mobile numbers are written as text so Excel
// doesn't turn them into 9.88E+09, and amounts/dates as real numbers/dates so they can be summed.

import { registeredBy, scannedBy } from "./staffLabel";

const WHATSAPP_LABEL = {
  pending: "Not sent",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
};

const text = (value) => ({ type: String, value: value ? String(value) : "-" });
const amount = (value) => ({ type: Number, value: Number(value) || 0, format: "#,##0" });
const date = (value) => {
  const parsed = value ? new Date(value) : null;
  // Excel has no time zones: shift so the cell shows local (IST) time, not UTC
  return parsed && !Number.isNaN(parsed.getTime())
    ? { type: Date, value: new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000), format: "dd/mm/yyyy hh:mm AM/PM" }
    : text("-");
};

// Gate of the latest check-in; the member list stores the gate's id only
const lastGate = (item, facilities) => {
  const facility = item.checkInHistory?.at(-1)?.facility;
  const id = facility?._id || facility;
  return facility?.facilityName || facilities.find((f) => f._id === id)?.facilityName || (item.isCheckedIn ? "All Gates" : "-");
};

const REPORTS = {
  member: {
    title: "Member Report",
    columns: [
      ["SN", 6], ["Reg No", 12], ["Name", 26], ["Category", 14], ["Mobile", 14], ["Ticket Price", 12], ["Cover Price", 12], ["Registered On", 20],
      ["Checked In", 11], ["Checked In At", 20], ["Registered By", 20], ["Scanned By", 20],
      ["WhatsApp", 11], ["WhatsApp Error", 40],
    ],
    row: (item, index) => [
      amount(index + 1), text(item.registrationNo), text(item.name?.toUpperCase()), text(item.category?.categoryName),
      text(item.mobile), amount(item.amount), amount(item.coverAmount),
      date(item.createdAt), text(item.isCheckedIn ? "Yes" : "No"), date(item.checkedInAt),
      text(registeredBy(item)), text(scannedBy(item)),
      text(WHATSAPP_LABEL[item.whatsappStatus] || "Not sent"),
      text(item.whatsappStatus === "failed" ? item.whatsappError : ""),
    ],
  },
  registration: {
    title: "Registration Report",
    columns: [
      ["SN", 6], ["Reg No", 12], ["Name", 26], ["Category", 14], ["Ticket Amount", 14], ["Cover Amount", 14],
      ["Mobile", 14], ["Entry By", 20], ["Date", 20],
    ],
    row: (item, index) => [
      amount(index + 1), text(item.registrationNo), text(item.name?.toUpperCase()), text(item.category?.categoryName),
      amount(item.amount), amount(item.coverAmount), text(item.mobile),
      text(registeredBy(item)), date(item.createdAt),
    ],
    // Total row under the Ticket Amount and Cover Amount columns
    total: (items) => [
      null, null, null, { value: "Total", fontWeight: "bold" },
      { ...amount(items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)), fontWeight: "bold" },
      { ...amount(items.reduce((sum, item) => sum + (Number(item.coverAmount) || 0), 0)), fontWeight: "bold" },
    ],
  },
  facility: {
    title: "Facility Report",
    columns: [
      ["SN", 6], ["Reg No", 12], ["Category", 14], ["Name", 26], ["Gate", 16], ["Checked In At", 20],
      ["Scanned By", 20], ["Mobile", 14],
    ],
    row: (item, index, facilities) => [
      amount(index + 1), text(item.registrationNo), text(item.category?.categoryName), text(item.name?.toUpperCase()),
      text(lastGate(item, facilities)), date(item.checkedInAt), text(scannedBy(item)), text(item.mobile),
    ],
  },
};

export const downloadReportExcel = async (type, items, facilities = []) => {
  const report = REPORTS[type];
  if (!report) return;

  // Loaded only when someone downloads, so the app itself stays small
  const { default: writeExcelFile } = await import("write-excel-file/browser");

  const heading = (value) => [{ value, fontWeight: "bold" }];
  const sheetData = [
    heading(`${report.title} – CENTRE POINT HOTELS & RESORTS`),
    [{ value: "Dhamaaka – The Karan Johar Edition · 7 Nov 2026 · Hotel Centre Point, Nagpur" }],
    [{ value: `Downloaded ${new Date().toLocaleString("en-IN")} · ${items.length} rows` }],
    [],
    report.columns.map(([label]) => ({ value: label, fontWeight: "bold", backgroundColor: "#E2E8F0" })),
    ...items.map((item, index) => report.row(item, index, facilities)),
    ...(report.total && items.length ? [report.total(items)] : []),
  ];

  const day = new Date().toISOString().slice(0, 10);
  await writeExcelFile(sheetData, {
    columns: report.columns.map(([, width]) => ({ width })),
    sheet: report.title,
  }).toFile(`${type}-report-${day}.xlsx`);
};
