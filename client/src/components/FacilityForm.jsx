import { useMemo, useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

  .ff-root {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    background: transparent;
    min-height: 100vh;
    padding: 1px 15px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }


  
  /* ── PAGE HEADER ── */
  .ff-page-header { display: flex; flex-direction: column; gap: 4px; }

  .ff-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
  }

  .ff-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }

  .ff-breadcrumb-sep { opacity: 0.5; font-size: 11px; }
  .ff-breadcrumb-active { color: #1a8f84; font-weight: 600; }

  /* ── CARD ── */
  .ff-card {
    width: 100%;
    background: #ffffff;
    border: 1.5px solid #ccdde8;
    border-radius: 16px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.8),
      0 4px 6px rgba(15,30,55,0.06),
      0 12px 28px rgba(15,30,55,0.12),
      0 24px 48px rgba(15,30,55,0.06);
    overflow: hidden;
    position: relative;
  }

  .ff-topbar {
    height: 4px;
    background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5);
  }

  .ff-card-body { padding: 28px 32px 32px; }

  @media (max-width: 560px) {
    .ff-card-body { padding: 20px 18px 24px; }
    .ff-root { padding: 16px; }
  }

  /* ── CARD HEADER ── */
  .ff-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 26px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8f1f8;
  }

  .ff-eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 6px;
  }

  .ff-mode-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1a8f84;
    animation: ff-glow 2s infinite;
    flex-shrink: 0;
  }

  @keyframes ff-glow {
    0%   { box-shadow: 0 0 0 0 rgba(26,143,132,0.45); }
    70%  { box-shadow: 0 0 0 6px rgba(26,143,132,0); }
    100% { box-shadow: 0 0 0 0 rgba(26,143,132,0); }
  }

  .ff-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.15;
  }

  .ff-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }

  /* ── SECTION ── */
  .ff-section-title {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 14px;
  }

  /* ── FORM STACK ── */
  .ff-form-stack { display: flex; flex-direction: column; gap: 20px; }

  .ff-field { display: flex; flex-direction: column; gap: 7px; }

  .ff-label {
    font-size: 10.5px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .ff-required { color: #e11d48; }

  .ff-input,
  .ff-textarea {
    width: 100%;
    border: 1.5px solid #dde9f2;
    border-radius: 11px;
    background: #f8fafc;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }

  .ff-input {
    height: 42px;
    padding: 0 14px;
  }

  .ff-textarea {
    padding: 12px 14px;
    resize: vertical;
    min-height: 90px;
    line-height: 1.55;
  }

  .ff-input::placeholder,
  .ff-textarea::placeholder { color: #b0bec5; }

  .ff-input:hover:not(:focus),
  .ff-textarea:hover:not(:focus) { border-color: #b8d0e4; background: #fff; }

  .ff-input:focus,
  .ff-textarea:focus {
    border-color: #1a8f84;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
  }

  /* ── DIVIDER ── */
  .ff-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #dde9f2, transparent);
  }

  /* ── ACTIONS ── */
  .ff-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ff-submit-btn {
    flex: 1;
    min-width: 140px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    background: linear-gradient(135deg, #1a8f84, #24a79c);
    color: #fff;
    border: none;
    border-radius: 13px;
    font-size: 14.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(26,143,132,0.3);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  }

  .ff-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(26,143,132,0.38);
  }

  .ff-submit-btn:active:not(:disabled) { transform: translateY(0); }
  .ff-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .ff-reset-btn {
    height: 48px;
    padding: 0 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 13px;
    font-size: 13.5px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    color: #475569;
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    white-space: nowrap;
  }

  .ff-reset-btn:hover { background: #e2e8f0; transform: translateY(-1px); }

  /* ── SPINNER ── */
  .ff-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ff-spin 0.7s linear infinite;
  }

  @keyframes ff-spin { to { transform: rotate(360deg); } }

  /* ── TOAST ── */
  .ff-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    border-radius: 13px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid;
    animation: ff-slideIn 0.25s ease;
  }

  @keyframes ff-slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ff-toast-success {
    background: linear-gradient(135deg, #f0fdf9, #ecfdf5);
    border-color: #a7f3d0;
    color: #065f46;
  }

  .ff-toast-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #10b981;
    flex-shrink: 0;
  }

  /* ── TABLE TOOLBAR ── */
  .ff-table-toolbar {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #e8f1f8;
    flex-wrap: wrap;
  }

  .ff-table-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .ff-table-title {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 9px;
    letter-spacing: -0.1px;
  }

  .ff-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 20px;
    padding: 0 7px;
    border-radius: 20px;
    background: rgba(26,143,132,0.1);
    border: 1px solid rgba(26,143,132,0.2);
    color: #1a8f84;
    font-size: 10.5px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
  }

  /* page-size select */
  .ff-pagesize-wrap {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #64748b;
    font-family: 'DM Sans', sans-serif;
  }

  .ff-pagesize-select {
    height: 30px;
    padding: 0 10px;
    border: 1.5px solid #dde9f2;
    border-radius: 8px;
    background: #f8fafc;
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    font-weight: 600;
    color: #0f172a;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
    appearance: none;
    -webkit-appearance: none;
    padding-right: 22px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
  }

  .ff-pagesize-select:focus { border-color: #1a8f84; }

  /* search */
  .ff-search-wrap { position: relative; display: flex; align-items: center; }

  .ff-search-icon {
    position: absolute;
    left: 11px;
    width: 14px; height: 14px;
    stroke: #94a3b8;
    pointer-events: none;
    flex-shrink: 0;
  }

  .ff-search {
    height: 36px;
    width: 210px;
    border: 1.5px solid #dde9f2;
    border-radius: 10px;
    background: #f8fafc;
    font-size: 12.5px;
    color: #0f172a;
    padding: 0 12px 0 34px;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .ff-search:focus {
    border-color: #1a8f84;
    box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
    background: #fff;
  }

  .ff-search::placeholder { color: #b0bec5; font-size: 12px; }

  @media (max-width: 560px) {
    .ff-search { width: 100%; }
    .ff-table-toolbar { flex-direction: column; align-items: flex-start; }
    .ff-table-left { width: 100%; justify-content: space-between; }
  }

  /* ── TABLE ── */
  .ff-table-wrap { overflow-x: auto; }

  .ff-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }

  .ff-table thead tr {
    background: #f8fafc;
    border-bottom: 1.5px solid #e8f1f8;
  }

  .ff-table th {
    padding: 10px 18px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    font-family: 'DM Mono', monospace;
  }

  .ff-table th:first-child { width: 60px; text-align: center; }

  .ff-table tbody tr {
    border-bottom: 1px solid #f0f6fb;
    transition: background 0.1s;
  }

  .ff-table tbody tr:last-child { border-bottom: none; }
  .ff-table tbody tr:hover { background: rgba(26,143,132,0.04); }

  .ff-table td {
    padding: 13px 18px;
    color: #0f172a;
    vertical-align: middle;
    font-family: 'DM Sans', sans-serif;
  }

  .ff-table td:first-child {
    text-align: center;
    color: #94a3b8;
    font-size: 11.5px;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
  }

  .ff-facility-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .ff-facility-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1a8f84;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .ff-desc {
    font-size: 13px;
    color: #64748b;
  }

  .ff-desc-empty { color: #b0bec5; font-style: italic; }

  .ff-empty { padding: 48px 16px; text-align: center; }

  .ff-empty-icon { width: 40px; height: 40px; margin: 0 auto 12px; opacity: 0.2; }

  .ff-empty-text { font-size: 13px; color: #94a3b8; font-weight: 500; }

  /* ── TABLE FOOTER ── */
  .ff-table-footer {
    padding: 11px 20px;
    border-top: 1px solid #e8f1f8;
    font-size: 11.5px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'DM Sans', sans-serif;
  }

  .ff-table-footer strong { color: #475569; font-weight: 600; }

  /* ── NEW ROW ── */
  @keyframes ff-rowIn {
    from { background: rgba(26,143,132,0.1); }
    to   { background: transparent; }
  }

  .ff-row-new { animation: ff-rowIn 1.6s ease forwards; }
`;

function FacilityForm({
  facilityForm = { facilityName: "", description: "" },
  facilities = [],
  facilityLoading = false,
  onFormChange = () => {},
  onSubmit = () => {},
  onReset = () => {},
  toast = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredFacilities = useMemo(
    () =>
      facilities.filter((item) =>
        item.facilityName?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [facilities, searchTerm]
  );

  const visibleFacilities = filteredFacilities.slice(0, pageSize);

  return (
    <>
      <style>{styles}</style>
      <div className="ff-root">

        {/* ── PAGE HEADER ── */}
        

        {/* ── TOAST ── */}
        {toast && (
          <div className={`ff-toast ff-toast-${toast.type}`}>
            <span className="ff-toast-dot" />
            {toast.message}
          </div>
        )}

        {/* ── FORM CARD ── */}
        <div className="ff-card">
          <div className="ff-topbar" />
          <div className="ff-card-body">

            <div className="ff-card-header">
              <div>
                <p className="ff-eyebrow">
                  <span className="ff-mode-dot" />
                  New Entry
                </p>
                <h3 className="ff-title">Add Facility</h3>
                <p className="ff-subtitle">
                  Define a facility available at your venue or event.
                </p>
              </div>
            </div>

            <div className="ff-form-stack">

              <div>
                <p className="ff-section-title">Facility Details</p>
                <div className="ff-field" style={{ marginBottom: 16 }}>
                  <label className="ff-label">
                    Facility Name <span className="ff-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="facilityName"
                    value={facilityForm.facilityName}
                    onChange={onFormChange}
                    placeholder="Enter facility name"
                    className="ff-input"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="ff-field">
                  <label className="ff-label">
                    Description
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, fontWeight: 500, textTransform: "none", letterSpacing: 0, color: "#94a3b8" }}>
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={facilityForm.description}
                    onChange={onFormChange}
                    placeholder="Describe the facility…"
                    className="ff-textarea"
                    rows={3}
                  />
                </div>
              </div>

              <div className="ff-divider" />

              <div className="ff-actions">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={facilityLoading}
                  className="ff-submit-btn"
                >
                  {facilityLoading ? (
                    <><span className="ff-spinner" /><span>Saving…</span></>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      <span>Save Facility</span>
                    </>
                  )}
                </button>
                <button type="button" onClick={onReset} className="ff-reset-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-3.17"/>
                  </svg>
                  Reset
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className="ff-card">
          <div className="ff-topbar" />
          <div className="ff-table-toolbar">
            <div className="ff-table-left">
              <div className="ff-table-title">
                All Facilities
                <span className="ff-badge">{filteredFacilities.length}</span>
              </div>
              <div className="ff-pagesize-wrap">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="ff-pagesize-select"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>per page</span>
              </div>
            </div>
            <div className="ff-search-wrap">
              <svg className="ff-search-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search facilities…"
                className="ff-search"
              />
            </div>
          </div>

          <div className="ff-table-wrap">
            <table className="ff-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Facility Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {visibleFacilities.length > 0 ? (
                  visibleFacilities.map((item, index) => (
                    <tr
                      key={item._id || `${item.facilityName}-${index}`}
                      className={item._new ? "ff-row-new" : ""}
                    >
                      <td>{String(index + 1).padStart(2, "0")}</td>
                      <td>
                        <span className="ff-facility-pill">
                          <span className="ff-facility-dot" />
                          {item.facilityName}
                        </span>
                      </td>
                      <td>
                        <span className={`ff-desc ${!item.description ? "ff-desc-empty" : ""}`}>
                          {item.description || "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      <div className="ff-empty">
                        <svg className="ff-empty-icon" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <path d="M9 9h6M9 12h4" />
                        </svg>
                        <p className="ff-empty-text">
                          {searchTerm ? `No results for "${searchTerm}"` : "No facilities yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ff-table-footer">
            Showing&nbsp;
            <strong>{visibleFacilities.length > 0 ? 1 : 0}–{visibleFacilities.length}</strong>
            &nbsp;of&nbsp;
            <strong>{filteredFacilities.length}</strong>
            &nbsp;{filteredFacilities.length === 1 ? "entry" : "entries"}
            {searchTerm && <> matching <strong>"{searchTerm}"</strong></>}
          </div>
        </div>

      </div>
    </>
  );
}

/* ── Sample data ── */
const SAMPLE = [
  { _id: "1", facilityName: "Swimming Pool",   description: "Olympic-size heated pool with changing rooms." },
  { _id: "2", facilityName: "Gym",             description: "Fully equipped fitness center, open 24/7." },
  { _id: "3", facilityName: "Conference Hall", description: "Seats up to 200 with AV equipment." },
  { _id: "4", facilityName: "Parking",         description: "" },
  { _id: "5", facilityName: "Wi-Fi",           description: "High-speed internet across all floors." },
];

const EMPTY_FORM = { facilityName: "", description: "" };

export default function App() {
  const [form, setForm]             = useState(EMPTY_FORM);
  const [facilities, setFacilities] = useState(SAMPLE);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.facilityName.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const entry = { ...form, _id: Date.now().toString(), _new: true };
      setFacilities((f) => [entry, ...f]);
      setForm(EMPTY_FORM);
      setLoading(false);
      setToast({ type: "success", message: `Facility "${entry.facilityName}" added successfully.` });
      setTimeout(() => {
        setFacilities((f) =>
          f.map((item) => (item._id === entry._id ? { ...item, _new: false } : item))
        );
      }, 1800);
    }, 900);
  };

  return (
    <FacilityForm
      facilityForm={form}
      facilities={facilities}
      facilityLoading={loading}
      onFormChange={handleChange}
      onSubmit={handleSubmit}
      onReset={() => setForm(EMPTY_FORM)}
      toast={toast}
    />
  );
}