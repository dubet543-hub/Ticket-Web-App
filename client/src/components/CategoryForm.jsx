import { useMemo, useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

  .cf-root {
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
  .cf-page-header { display: flex; flex-direction: column; gap: 4px; }

  .cf-page-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
  }

  .cf-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }

  .cf-breadcrumb-sep { opacity: 0.5; font-size: 11px; }
  .cf-breadcrumb-active { color: #1a8f84; font-weight: 600; }

  /* ── CARD ── */
  .cf-card {
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

  .cf-topbar {
    height: 4px;
    background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5);
  }

  .cf-card-body { padding: 28px 32px 32px; }

  @media (max-width: 560px) {
    .cf-card-body { padding: 20px 18px 24px; }
    .cf-root { padding: 16px; }
  }

  /* ── CARD HEADER ── */
  .cf-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 26px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e8f1f8;
  }

  .cf-eyebrow {
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

  .cf-mode-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1a8f84;
    animation: cf-glow 2s infinite;
    flex-shrink: 0;
  }

  @keyframes cf-glow {
    0%   { box-shadow: 0 0 0 0 rgba(26,143,132,0.45); }
    70%  { box-shadow: 0 0 0 6px rgba(26,143,132,0); }
    100% { box-shadow: 0 0 0 0 rgba(26,143,132,0); }
  }

  .cf-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.15;
  }

  .cf-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }

  /* ── SECTION ── */
  .cf-section-title {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 14px;
  }

  /* ── FORM STACK ── */
  .cf-form-stack { display: flex; flex-direction: column; gap: 20px; }

  .cf-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 18px;
  }

  @media (max-width: 900px) { .cf-grid-3 { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 560px) { .cf-grid-3 { grid-template-columns: 1fr; } }

  .cf-field { display: flex; flex-direction: column; gap: 7px; }

  .cf-label {
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

  .cf-required { color: #e11d48; }

  .cf-input-wrap { position: relative; }

  .cf-prefix {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    font-weight: 700;
    color: #94a3b8;
    font-family: 'DM Mono', monospace;
    pointer-events: none;
    user-select: none;
    z-index: 1;
  }

  .cf-input {
    width: 100%;
    height: 42px;
    padding: 0 14px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #0f172a;
    background: #f8fafc;
    border: 1.5px solid #dde9f2;
    border-radius: 11px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    -moz-appearance: textfield;
  }

  .cf-input::-webkit-outer-spin-button,
  .cf-input::-webkit-inner-spin-button { -webkit-appearance: none; }

  .cf-input.has-prefix {
    padding-left: 28px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }

  .cf-input::placeholder { color: #b0bec5; }

  .cf-input:hover:not(:focus) { border-color: #b8d0e4; background: #fff; }

  .cf-input:focus {
    border-color: #1a8f84;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
  }

  /* ── DIVIDER ── */
  .cf-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #dde9f2, transparent);
  }

  /* ── ACTIONS ── */
  .cf-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .cf-submit-btn {
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

  .cf-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(26,143,132,0.38);
  }

  .cf-submit-btn:active:not(:disabled) { transform: translateY(0); }
  .cf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .cf-reset-btn {
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

  .cf-reset-btn:hover { background: #e2e8f0; transform: translateY(-1px); }

  /* ── SPINNER ── */
  .cf-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cf-spin 0.7s linear infinite;
  }

  @keyframes cf-spin { to { transform: rotate(360deg); } }

  /* ── TOAST ── */
  .cf-toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 18px;
    border-radius: 13px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid;
    animation: cf-slideIn 0.25s ease;
  }

  @keyframes cf-slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cf-toast-success {
    background: linear-gradient(135deg, #f0fdf9, #ecfdf5);
    border-color: #a7f3d0;
    color: #065f46;
  }

  .cf-toast-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #10b981;
    flex-shrink: 0;
  }

  /* ── TABLE CARD ── */
  .cf-table-toolbar {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #e8f1f8;
    flex-wrap: wrap;
  }

  .cf-table-title {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 9px;
    letter-spacing: -0.1px;
  }

  .cf-badge {
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

  .cf-search-wrap { position: relative; display: flex; align-items: center; }

  .cf-search-icon {
    position: absolute;
    left: 11px;
    width: 14px; height: 14px;
    stroke: #94a3b8;
    pointer-events: none;
    flex-shrink: 0;
  }

  .cf-search {
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

  .cf-search:focus {
    border-color: #1a8f84;
    box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
    background: #fff;
  }

  .cf-search::placeholder { color: #b0bec5; font-size: 12px; }

  @media (max-width: 560px) {
    .cf-search { width: 100%; }
    .cf-table-toolbar { flex-direction: column; align-items: flex-start; }
  }

  /* ── TABLE ── */
  .cf-table-wrap { overflow-x: auto; }

  .cf-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }

  .cf-table thead tr {
    background: #f8fafc;
    border-bottom: 1.5px solid #e8f1f8;
  }

  .cf-table th {
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

  .cf-table th:first-child { width: 52px; text-align: center; }
  .cf-table th.ar, .cf-table td.ar { text-align: right; }

  .cf-table tbody tr {
    border-bottom: 1px solid #f0f6fb;
    transition: background 0.1s;
  }

  .cf-table tbody tr:last-child { border-bottom: none; }
  .cf-table tbody tr:hover { background: rgba(26,143,132,0.04); }

  .cf-table td {
    padding: 13px 18px;
    color: #0f172a;
    vertical-align: middle;
    font-family: 'DM Sans', sans-serif;
  }

  .cf-table td:first-child {
    text-align: center;
    color: #94a3b8;
    font-size: 11.5px;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
  }

  .cf-cat-pill { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; }

  .cf-cat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1a8f84;
    opacity: 0.6;
    flex-shrink: 0;
  }

  .cf-price {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #0f172a;
  }

  .cf-price-zero { color: #b0bec5; }

  .cf-empty { padding: 48px 16px; text-align: center; }

  .cf-empty-icon { width: 40px; height: 40px; margin: 0 auto 12px; opacity: 0.2; }

  .cf-empty-text { font-size: 13px; color: #94a3b8; font-weight: 500; }

  .cf-table-footer {
    padding: 11px 20px;
    border-top: 1px solid #e8f1f8;
    font-size: 11.5px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'DM Sans', sans-serif;
  }

  .cf-table-footer strong { color: #475569; font-weight: 600; }

  @keyframes cf-rowIn {
    from { background: rgba(26,143,132,0.1); }
    to   { background: transparent; }
  }

  .cf-row-new { animation: cf-rowIn 1.6s ease forwards; }
`;

function CategoryForm({
  categoryForm = { categoryName: "", price: "", coverPrice: "" },
  categories = [],
  categoryLoading = false,
  onFormChange = () => {},
  onSubmit = () => {},
  onReset = () => {},
  toast = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(
    () =>
      categories.filter((item) =>
        item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

  return (
    <>
      <style>{styles}</style>
      <div className="cf-root">

        {/* ── PAGE HEADER ── */}
        

        {/* ── TOAST ── */}
        {toast && (
          <div className={`cf-toast cf-toast-${toast.type}`}>
            <span className="cf-toast-dot" />
            {toast.message}
          </div>
        )}

        {/* ── FORM CARD ── */}
        <div className="cf-card">
          <div className="cf-topbar" />
          <div className="cf-card-body">

            <div className="cf-card-header">
              <div>
                <p className="cf-eyebrow">
                  <span className="cf-mode-dot" />
                  New Entry
                </p>
                <h3 className="cf-title">Add Category</h3>
                <p className="cf-subtitle">
                  Define a ticket category with pricing for your event.
                </p>
              </div>
            </div>

            <div className="cf-form-stack">

              <div>
                <p className="cf-section-title">Category Details</p>
                <div className="cf-grid-3">

                  <div className="cf-field">
                    <label className="cf-label">
                      Category Name <span className="cf-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="categoryName"
                      value={categoryForm.categoryName}
                      onChange={onFormChange}
                      placeholder="e.g. VIP, General"
                      className="cf-input"
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div className="cf-field">
                    <label className="cf-label">
                      Ticket Price <span className="cf-required">*</span>
                    </label>
                    <div className="cf-input-wrap">
                      <span className="cf-prefix">₹</span>
                      <input
                        type="number"
                        name="price"
                        value={categoryForm.price}
                        onChange={onFormChange}
                        placeholder="0"
                        className="cf-input has-prefix"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="cf-field">
                    <label className="cf-label">
                      Cover Price <span className="cf-required">*</span>
                    </label>
                    <div className="cf-input-wrap">
                      <span className="cf-prefix">₹</span>
                      <input
                        type="number"
                        name="coverPrice"
                        value={categoryForm.coverPrice}
                        onChange={onFormChange}
                        placeholder="0"
                        className="cf-input has-prefix"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                </div>
              </div>

              <div className="cf-divider" />

              <div className="cf-actions">
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={categoryLoading}
                  className="cf-submit-btn"
                >
                  {categoryLoading ? (
                    <><span className="cf-spinner" /><span>Saving…</span></>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      <span>Save Category</span>
                    </>
                  )}
                </button>
                <button type="button" onClick={onReset} className="cf-reset-btn">
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
        <div className="cf-card">
          <div className="cf-topbar" />
          <div className="cf-table-toolbar">
            <div className="cf-table-title">
              All Categories
              <span className="cf-badge">{filteredCategories.length}</span>
            </div>
            <div className="cf-search-wrap">
              <svg className="cf-search-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories…"
                className="cf-search"
              />
            </div>
          </div>

          <div className="cf-table-wrap">
            <table className="cf-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th className="ar">Ticket Price</th>
                  <th className="ar">Cover Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item, index) => (
                    <tr
                      key={item._id || `${item.categoryName}-${index}`}
                      className={item._new ? "cf-row-new" : ""}
                    >
                      <td>{String(index + 1).padStart(2, "0")}</td>
                      <td>
                        <span className="cf-cat-pill">
                          <span className="cf-cat-dot" />
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="ar">
                        <span className={`cf-price ${!item.price || Number(item.price) === 0 ? "cf-price-zero" : ""}`}>
                          ₹{Number(item.price ?? 0).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="ar">
                        <span className={`cf-price ${!item.coverPrice || Number(item.coverPrice) === 0 ? "cf-price-zero" : ""}`}>
                          ₹{Number(item.coverPrice ?? 0).toLocaleString("en-IN")}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <div className="cf-empty">
                        <svg className="cf-empty-icon" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="3" />
                          <path d="M9 9h6M9 12h4" />
                        </svg>
                        <p className="cf-empty-text">
                          {searchTerm ? `No results for "${searchTerm}"` : "No categories yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cf-table-footer">
            Showing&nbsp;<strong>{filteredCategories.length}</strong>&nbsp;
            {filteredCategories.length === 1 ? "entry" : "entries"}
            {searchTerm && <> matching <strong>"{searchTerm}"</strong></>}
          </div>
        </div>

      </div>
    </>
  );
}

const SAMPLE = [
  { _id: "1", categoryName: "General",   price: 500,  coverPrice: 0   },
  { _id: "2", categoryName: "VIP",       price: 1500, coverPrice: 200 },
  { _id: "3", categoryName: "Premium",   price: 2500, coverPrice: 500 },
  { _id: "4", categoryName: "Economy",   price: 250,  coverPrice: 0   },
  { _id: "5", categoryName: "Corporate", price: 3000, coverPrice: 750 },
];

const EMPTY_FORM = { categoryName: "", price: "", coverPrice: "" };

export default function App() {
  const [form, setForm]             = useState(EMPTY_FORM);
  const [categories, setCategories] = useState(SAMPLE);
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
    if (!form.categoryName || form.price === "" || form.coverPrice === "") return;
    setLoading(true);
    setTimeout(() => {
      const entry = { ...form, _id: Date.now().toString(), _new: true };
      setCategories((c) => [entry, ...c]);
      setForm(EMPTY_FORM);
      setLoading(false);
      setToast({ type: "success", message: `Category "${entry.categoryName}" added successfully.` });
      setTimeout(() => {
        setCategories((c) =>
          c.map((item) => (item._id === entry._id ? { ...item, _new: false } : item))
        );
      }, 1800);
    }, 900);
  };

  return (
    <CategoryForm
      categoryForm={form}
      categories={categories}
      categoryLoading={loading}
      onFormChange={handleChange}
      onSubmit={handleSubmit}
      onReset={() => setForm(EMPTY_FORM)}
      toast={toast}
    />
  );
}