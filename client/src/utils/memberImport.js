// Reads names and mobile numbers from any member list (.xlsx or .csv) for Bulk Add.
// Columns are found by their heading (Name, Mobile, Phone, Contact…) or, without headings,
// by their contents: the column full of 10-digit numbers is the mobile, the text one the name.

const cellText = (value) => (value === null || value === undefined || value instanceof Date ? "" : String(value).trim());

// "+91 98765-43210", "098765 43210", 9876543210 -> "9876543210"; "" when there is no number
export const toMobile = (value) => {
  for (const part of cellText(value).split(/[/,;|]|\s{2,}/)) {
    let digits = part.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    if (digits.length === 10) return digits;
  }
  return "";
};

const toName = (value) => cellText(value).replace(/\d+/g, " ").replace(/\s+/g, " ").trim().toUpperCase();
const looksLikeName = (value) => /[a-z]/i.test(value) && !/\d{3,}/.test(value) && value.length <= 60;

const NAME_HEADING = /name/i;
const FIRST_NAME_HEADING = /first\s*name|^first$/i;
const LAST_NAME_HEADING = /last\s*name|surname|^last$/i;
const MOBILE_HEADING = /mob|phone|contact|whats\s*app|cell|number|^no\.?$/i;

// Index of the column with the highest score, or -1 when no column scores above 0
const bestColumn = (width, score) => {
  let best = -1;
  let bestScore = 0;
  for (let col = 0; col < width; col++) {
    const value = score(col);
    if (value > bestScore) { best = col; bestScore = value; }
  }
  return best;
};

const extractMembers = (rows) => {
  const table = rows.map((row) => (row || []).map(cellText));
  const width = Math.max(0, ...table.map((row) => row.length));

  // Heading row: one of the first 10 rows naming a name column (a mobile column is optional)
  let start = 0;
  let nameCols = [];
  let mobileCol = -1;
  for (let index = 0; index < Math.min(10, table.length); index++) {
    const row = table[index];
    const first = row.findIndex((cell) => FIRST_NAME_HEADING.test(cell));
    const last = row.findIndex((cell) => LAST_NAME_HEADING.test(cell));
    const name = row.findIndex((cell) => NAME_HEADING.test(cell) && !/father|company|user|file/i.test(cell));
    const names = first >= 0 ? [first, last].filter((col) => col >= 0) : name >= 0 ? [name] : [];
    if (names.length) {
      start = index + 1;
      nameCols = names;
      mobileCol = row.findIndex((cell, col) => !names.includes(col) && MOBILE_HEADING.test(cell) && !toMobile(cell));
      break;
    }
  }
  const body = table.slice(start);

  if (!nameCols.length) {
    // No headings: pick the columns by what is in them
    mobileCol = bestColumn(width, (col) => body.filter((row) => toMobile(row[col])).length);
    const nameCol = bestColumn(width, (col) => (col === mobileCol ? 0 : body.filter((row) => looksLikeName(row[col] || "")).length));
    if (nameCol < 0 && mobileCol < 0) return [];
    nameCols = nameCol >= 0 ? [nameCol] : [];
  } else if (mobileCol < 0) {
    // A name heading but no mobile heading: the column holding the numbers, if any
    mobileCol = bestColumn(width, (col) => (nameCols.includes(col) ? 0 : body.filter((row) => toMobile(row[col])).length));
  }

  return body.flatMap((row) => {
    const mobileCell = mobileCol >= 0 ? row[mobileCol] : "";
    const mobile = toMobile(mobileCell);
    // A name written in the mobile cell ("Rahul 98765 43210") is used when there is no name column
    const name = nameCols.map((col) => toName(row[col])).filter(Boolean).join(" ") || toName(mobileCell);
    if (!mobile && !name) return [];
    // Names without a number are kept (mobile left empty to fill in); a wrong number stays as typed
    return [{ name, mobile: mobile || cellText(mobileCell) }];
  });
};

// Splits CSV text into rows of cells (quoted cells may contain commas)
const parseCsv = (text) => {
  const delimiter = [",", ";", "\t"].sort((a, b) => text.split(b).length - text.split(a).length)[0];
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) { row.push(cell); cell = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
};

// Every sheet of the file is read; returns [{ name, mobile, sheet }] in file order
export const readMembersFromFile = async (file) => {
  const extension = file.name.split(".").pop().toLowerCase();
  let sheets;
  if (extension === "csv" || extension === "txt") {
    sheets = [{ sheet: "", data: parseCsv(await file.text()) }];
  } else if (extension === "xlsx") {
    // Loaded only when a file is uploaded, so the app itself stays small
    const { default: readXlsxFile } = await import("read-excel-file/browser");
    sheets = await readXlsxFile(file);
  } else {
    throw new Error('This file type can\'t be read. In Excel use File → Save As → "Excel Workbook (.xlsx)" or "CSV", then upload that.');
  }
  return sheets.flatMap(({ sheet, data }) => extractMembers(data).map((member) => ({ ...member, sheet })));
};
