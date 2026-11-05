import { useRef, useState } from "react";
import API from "../api";
import { readMembersFromFile, toMobile } from "../utils/memberImport";

// Bulk add: several member rows on one form, saved together with ticket numbers in row order.
// Only members are saved; tickets are sent later from Member Report.
// Uses the .af-* styles of AttendeeForm, which is on the same page; its "Upload Excel" button
// opens this form's file picker (#bulk-excel-input).

const emptyRow = () => ({ key: crypto.randomUUID(), name: "", mobile: "", category: "", amount: "", coverAmount: "" });

const rowError = (row) =>
  !row.name.trim() ? "Name missing" :
  !toMobile(row.mobile) ? "Mobile must be 10 digits" :
  !row.category ? "Select a category" :
  row.amount === "" || row.coverAmount === "" ? "Enter ticket price and cover price (0 if free)" :
  "";

const isBlank = (row) => !row.name.trim() && !row.mobile.trim() && !row.category && row.amount === "" && row.coverAmount === "";

function BulkAddMembers({ categories = [], onAdded }) {
  const [rows, setRows] = useState(() => [emptyRow(), emptyRow(), emptyRow()]);
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [result, setResult] = useState(null);
  const [notice, setNotice] = useState("");
  const [allValues, setAllValues] = useState({ category: "", amount: "", coverAmount: "" });
  const rootRef = useRef(null);

  // Rows left completely empty are ignored
  const filledRows = rows.filter((row) => !isBlank(row));

  const updateRow = (key, field, value) => {
    setResult(null);
    setRows((current) => current.map((row) =>
      row.key === key ? { ...row, [field]: field === "name" ? value.toUpperCase() : field === "mobile" ? toMobile(value) || value : value } : row
    ));
  };
  const addRow = () => setRows((current) => [...current, emptyRow()]);
  const removeRow = (key) => setRows((current) => (current.length > 1 ? current.filter((row) => row.key !== key) : current));

  // Upload: names and mobiles from the file become rows; category and prices are chosen here
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setResult(null);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const members = await readMembersFromFile(file);
      if (!members.length) {
        setNotice(`No names or 10-digit mobile numbers found in ${file.name}.`);
        return;
      }
      setRows((current) => [
        ...current.filter((row) => !isBlank(row)),
        ...members.map((member) => ({ ...emptyRow(), ...member })),
      ]);
      setShowErrors(false);
      setNotice(`Loaded ${members.length} members from ${file.name}. Choose the category and prices (use "Set for all rows" below), check the list, then click Save All. Nothing is saved yet.`);
    } catch (err) {
      setNotice(err.message || "Could not read this file.");
    }
  };

  const applyToAll = () => {
    const values = Object.fromEntries(Object.entries(allValues).filter(([, value]) => value !== ""));
    if (!Object.keys(values).length) { alert("Choose a category or enter a price first"); return; }
    setRows((current) => current.map((row) => (isBlank(row) ? row : { ...row, ...values })));
  };

  const handleSaveAll = async () => {
    if (!filledRows.length) { alert("Fill in at least one member"); return; }
    if (filledRows.some(rowError)) { setShowErrors(true); return; }
    if (!window.confirm(`Save ${filledRows.length} members? Ticket numbers are given in this order. No tickets are sent.`)) return;

    try {
      setSaving(true);
      const res = await API.post("/attendees/bulk", {
        members: filledRows.map(({ name, mobile, category, amount, coverAmount }) => ({ name, mobile: toMobile(mobile), category, amount, coverAmount })),
      });
      setResult(res.data);
      setNotice("");
      // Keep only the rows that failed, so saving again never adds a member twice
      const failedRows = (res.data.failed || []).map((item) => filledRows[item.row - 1]).filter(Boolean);
      setRows(failedRows.length ? failedRows : [emptyRow(), emptyRow(), emptyRow()]);
      setShowErrors(false);
    } catch (err) {
      const data = err?.response?.data;
      setResult(data?.failed ? data : { added: [], failed: [{ row: "-", name: "", message: data?.message || err.message }] });
    } finally {
      setSaving(false);
      onAdded?.();
    }
  };

  return (
    <div className="af-root" style={{ marginTop: 20, scrollMarginTop: 20 }} ref={rootRef}>
      <style>{`
        .ba-row { display: grid; grid-template-columns: 28px 1.4fr 1.1fr 1fr 0.8fr 0.8fr 36px; gap: 10px; align-items: start; }
        .ba-head { font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #475569; }
        .ba-num { font-family: 'DM Mono', monospace; font-size: 13px; color: #94a3b8; padding-top: 12px; text-align: right; }
        .ba-error { grid-column: 2 / -1; font-size: 12px; color: #dc2626; margin-top: -4px; }
        .ba-remove { height: 42px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; color: #94a3b8; cursor: pointer; font-size: 16px; }
        .ba-remove:hover:not(:disabled) { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .ba-add { align-self: flex-start; background: none; border: 1.5px dashed #9fc9c2; border-radius: 10px; padding: 9px 16px; color: #1a8f84; font-weight: 700; font-size: 13px; cursor: pointer; }
        .ba-add:hover { background: #f0faf7; }
        .ba-all { display: grid; grid-template-columns: auto 1fr 0.8fr 0.8fr auto; gap: 10px; align-items: center; background: #f0faf7; border: 1.5px dashed #9fc9c2; border-radius: 13px; padding: 12px 14px; }
        .ba-all-label { font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #3d7d72; }
        .ba-notice { font-size: 13.5px; line-height: 1.5; color: #1f4f47; background: #f0faf7; border-radius: 10px; padding: 10px 14px; }
        @media (max-width: 760px) {
          .ba-row { grid-template-columns: 1fr 1fr; }
          .ba-row .ba-num, .ba-head-row { display: none; }
          .ba-row { padding-bottom: 12px; border-bottom: 1px dashed #dde9f2; }
          .ba-error { grid-column: 1 / -1; }
          .ba-all { grid-template-columns: 1fr 1fr; }
          .ba-all-label { grid-column: 1 / -1; }
        }
      `}</style>
      <div className="af-card">
        <div className="af-topbar" />
        <div className="af-body">
          <div className="af-header">
            <div>
              <p className="af-eyebrow"><span className="af-mode-dot" />Many at once</p>
              <h3 className="af-title">Bulk Add Members</h3>
              <p className="af-subtitle">
                Fill one member per row and click Save All. Ticket numbers follow the row order.
                Tickets are not sent: send them later from Member Report.
              </p>
            </div>
            <div className="af-header-side">
              <label htmlFor="bulk-excel-input" className="af-cancel-btn" title="Fill the rows with the names and mobile numbers in an Excel or CSV file">
                Upload Excel
              </label>
              <input id="bulk-excel-input" type="file" accept=".xlsx,.csv" onChange={handleFile} style={{ display: "none" }} />
            </div>
          </div>

          <div className="af-form-stack" style={{ gap: 12 }}>
            {notice && <p className="ba-notice">{notice}</p>}

            {filledRows.length > 1 && (
              <div className="ba-all">
                <span className="ba-all-label">Set for all rows</span>
                <div className="af-select-wrap">
                  <select className="af-select" value={allValues.category} onChange={(e) => setAllValues((p) => ({ ...p, category: e.target.value }))}>
                    <option value="">Category</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>{item.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div className="af-input-wrap">
                  <span className="af-prefix">₹</span>
                  <input type="number" min="0" className="af-input has-prefix" placeholder="Ticket" value={allValues.amount}
                    onChange={(e) => setAllValues((p) => ({ ...p, amount: e.target.value }))} />
                </div>
                <div className="af-input-wrap">
                  <span className="af-prefix">₹</span>
                  <input type="number" min="0" className="af-input has-prefix" placeholder="Cover" value={allValues.coverAmount}
                    onChange={(e) => setAllValues((p) => ({ ...p, coverAmount: e.target.value }))} />
                </div>
                <button type="button" className="ba-add" style={{ alignSelf: "center" }} onClick={applyToAll}>Apply to all</button>
              </div>
            )}

            <div className="ba-row ba-head-row">
              <span />
              <span className="ba-head">Name</span>
              <span className="ba-head">Mobile</span>
              <span className="ba-head">Category</span>
              <span className="ba-head">Ticket Price</span>
              <span className="ba-head">Cover Price</span>
              <span />
            </div>

            {rows.map((row, index) => {
              const error = showErrors && !isBlank(row) && rowError(row);
              return (
                <div className="ba-row" key={row.key}>
                  <span className="ba-num">{index + 1}</span>
                  <input
                    className="af-input" placeholder="Full name" value={row.name}
                    onChange={(e) => updateRow(row.key, "name", e.target.value)}
                  />
                  <input
                    className="af-input" placeholder="10-digit number" inputMode="numeric" value={row.mobile}
                    onChange={(e) => updateRow(row.key, "mobile", e.target.value)}
                  />
                  <div className="af-select-wrap">
                    <select className="af-select" value={row.category} onChange={(e) => updateRow(row.key, "category", e.target.value)}>
                      <option value="">Category</option>
                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>{item.categoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="af-input-wrap">
                    <span className="af-prefix">₹</span>
                    <input
                      type="number" min="0" className="af-input has-prefix" placeholder="0" value={row.amount}
                      onChange={(e) => updateRow(row.key, "amount", e.target.value)}
                    />
                  </div>
                  <div className="af-input-wrap">
                    <span className="af-prefix">₹</span>
                    <input
                      type="number" min="0" className="af-input has-prefix" placeholder="0" value={row.coverAmount}
                      onChange={(e) => updateRow(row.key, "coverAmount", e.target.value)}
                    />
                  </div>
                  <button
                    type="button" className="ba-remove" title="Remove this row"
                    onClick={() => removeRow(row.key)} disabled={rows.length === 1}
                  >
                    ×
                  </button>
                  {error && <span className="ba-error">{error}</span>}
                </div>
              );
            })}

            <button type="button" className="ba-add" onClick={addRow}>+ Add another member</button>

            {result && (
              <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                {result.added?.length > 0 && (
                  <p style={{ color: "#065f46", fontWeight: 600 }}>
                    Added {result.added.length}: {result.added.map((item) => `${item.registrationNo} ${item.name}`).join(", ")}
                  </p>
                )}
                {result.failed?.map((item) => (
                  <p key={`${item.row}-${item.name}`} style={{ color: "#b91c1c" }}>
                    Row {item.row} {item.name}: {item.message}
                  </p>
                ))}
              </div>
            )}

            <button type="button" onClick={handleSaveAll} disabled={saving || !filledRows.length} className="af-submit-btn">
              {saving
                ? <><span className="af-spinner" /><span>Saving…</span></>
                : <span>Save All{filledRows.length ? ` (${filledRows.length})` : ""}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkAddMembers;
