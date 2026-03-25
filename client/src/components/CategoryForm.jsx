import { useMemo, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .cf-root * {
    box-sizing: border-box;
    font-family: 'DM Sans', sans-serif;
  }

  .cf-root {
    --cf-bg: #f8f9fb;
    --cf-white: #ffffff;
    --cf-border: #e4e7ec;
    --cf-border-focus: #6366f1;
    --cf-text-primary: #0f172a;
    --cf-text-secondary: #64748b;
    --cf-text-muted: #94a3b8;
    --cf-accent: #6366f1;
    --cf-accent-light: #eef2ff;
    --cf-accent-hover: #4f46e5;
    --cf-danger: #ef4444;
    --cf-success: #10b981;
    --cf-shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --cf-shadow-md: 0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
    --cf-radius: 12px;
    --cf-radius-sm: 8px;
    --cf-radius-xs: 6px;

    background: var(--cf-bg);
    padding: 24px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── PAGE HEADER ── */
  .cf-page-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .cf-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--cf-text-muted);
    letter-spacing: 0.01em;
  }

  .cf-breadcrumb span + span::before {
    content: '/';
    margin-right: 6px;
    color: var(--cf-border);
  }

  .cf-breadcrumb span:last-child {
    color: var(--cf-accent);
    font-weight: 500;
  }

  /* ── CARD ── */
  .cf-card {
    background: var(--cf-white);
    border: 1px solid var(--cf-border);
    border-radius: var(--cf-radius);
    box-shadow: var(--cf-shadow-sm);
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }

  .cf-card:hover {
    box-shadow: var(--cf-shadow-md);
  }

  .cf-card-header {
    padding: 20px 24px 0;
    border-bottom: 1px solid var(--cf-border);
    margin-bottom: 0;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .cf-card-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--cf-radius-sm);
    background: var(--cf-accent-light);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .cf-card-icon svg {
    width: 18px;
    height: 18px;
    stroke: var(--cf-accent);
  }

  .cf-card-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--cf-text-primary);
    margin: 0;
    line-height: 1.3;
  }

  .cf-card-subtitle {
    font-size: 11.5px;
    color: var(--cf-text-muted);
    margin: 1px 0 0;
    line-height: 1.4;
  }

  .cf-card-body {
    padding: 20px 24px 24px;
  }

  /* ── FORM ── */
  .cf-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .cf-fields-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: 680px) {
    .cf-fields-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 681px) and (max-width: 900px) {
    .cf-fields-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .cf-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .cf-label {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--cf-text-secondary);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .cf-required {
    color: var(--cf-danger);
    font-size: 13px;
    line-height: 1;
  }

  .cf-input-wrap {
    position: relative;
  }

  .cf-input-prefix {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    font-weight: 600;
    color: var(--cf-text-muted);
    font-family: 'DM Mono', monospace;
    pointer-events: none;
    user-select: none;
  }

  .cf-input {
    width: 100%;
    height: 40px;
    border: 1.5px solid var(--cf-border);
    border-radius: var(--cf-radius-xs);
    background: var(--cf-bg);
    font-size: 13.5px;
    font-weight: 400;
    color: var(--cf-text-primary);
    padding: 0 12px;
    outline: none;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
    -moz-appearance: textfield;
  }

  .cf-input::-webkit-outer-spin-button,
  .cf-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .cf-input.has-prefix {
    padding-left: 28px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
  }

  .cf-input:hover {
    border-color: #c7cdd8;
    background: #fafbfc;
  }

  .cf-input:focus {
    border-color: var(--cf-border-focus);
    background: var(--cf-white);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .cf-input::placeholder {
    color: var(--cf-text-muted);
    font-weight: 400;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
  }

  /* ── BUTTONS ── */
  .cf-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 4px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .cf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 38px;
    min-width: 110px;
    padding: 0 18px;
    border-radius: var(--cf-radius-xs);
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: all 0.15s ease;
    letter-spacing: 0.01em;
    outline: none;
    white-space: nowrap;
  }

  .cf-btn-primary {
    background: var(--cf-accent);
    color: white;
    border-color: var(--cf-accent);
  }

  .cf-btn-primary:hover:not(:disabled) {
    background: var(--cf-accent-hover);
    border-color: var(--cf-accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  }

  .cf-btn-primary:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  .cf-btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .cf-btn-secondary {
    background: transparent;
    color: var(--cf-text-secondary);
    border-color: var(--cf-border);
  }

  .cf-btn-secondary:hover {
    background: var(--cf-bg);
    color: var(--cf-text-primary);
    border-color: #c7cdd8;
  }

  /* ── SPINNER ── */
  .cf-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: cf-spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  @keyframes cf-spin {
    to { transform: rotate(360deg); }
  }

  /* ── TABLE CARD ── */
  .cf-table-toolbar {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid var(--cf-border);
    flex-wrap: wrap;
  }

  .cf-table-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--cf-text-primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cf-count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    border-radius: 20px;
    background: var(--cf-accent-light);
    color: var(--cf-accent);
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
  }

  .cf-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .cf-search-icon {
    position: absolute;
    left: 10px;
    width: 14px;
    height: 14px;
    stroke: var(--cf-text-muted);
    pointer-events: none;
  }

  .cf-search {
    height: 34px;
    width: 200px;
    border: 1.5px solid var(--cf-border);
    border-radius: var(--cf-radius-xs);
    background: var(--cf-bg);
    font-size: 12.5px;
    color: var(--cf-text-primary);
    padding: 0 10px 0 32px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .cf-search:focus {
    border-color: var(--cf-border-focus);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    background: var(--cf-white);
  }

  .cf-search::placeholder {
    color: var(--cf-text-muted);
  }

  /* ── TABLE ── */
  .cf-table-wrap {
    overflow-x: auto;
  }

  .cf-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }

  .cf-table thead tr {
    background: #f8f9fb;
    border-bottom: 1.5px solid var(--cf-border);
  }

  .cf-table th {
    padding: 10px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    color: var(--cf-text-muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .cf-table th:first-child {
    width: 52px;
    text-align: center;
  }

  .cf-table th.align-right,
  .cf-table td.align-right {
    text-align: right;
  }

  .cf-table tbody tr {
    border-bottom: 1px solid #f1f4f8;
    transition: background 0.1s ease;
  }

  .cf-table tbody tr:last-child {
    border-bottom: none;
  }

  .cf-table tbody tr:hover {
    background: #fafbff;
  }

  .cf-table td {
    padding: 12px 16px;
    color: var(--cf-text-primary);
    vertical-align: middle;
  }

  .cf-table td:first-child {
    text-align: center;
    color: var(--cf-text-muted);
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    font-weight: 500;
  }

  .cf-category-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  .cf-category-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--cf-accent);
    flex-shrink: 0;
    opacity: 0.6;
  }

  .cf-price {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: var(--cf-text-primary);
  }

  .cf-price-zero {
    color: var(--cf-text-muted);
  }

  .cf-empty {
    padding: 40px 16px;
    text-align: center;
  }

  .cf-empty-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto 10px;
    opacity: 0.25;
  }

  .cf-empty-text {
    font-size: 13px;
    color: var(--cf-text-muted);
    font-weight: 500;
  }

  .cf-table-footer {
    padding: 10px 20px;
    border-top: 1px solid var(--cf-border);
    font-size: 11.5px;
    color: var(--cf-text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cf-table-footer strong {
    color: var(--cf-text-secondary);
    font-weight: 600;
  }
`;

function CategoryForm({
  categoryForm = { categoryName: "", price: "", coverPrice: "" },
  categories = [],
  categoryLoading = false,
  onFormChange = () => {},
  onSubmit = (e) => e.preventDefault(),
  onReset = () => {},
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

        {/* ── FORM CARD ── */}
        <div className="cf-card">
          <div className="cf-card-header">
            <div className="cf-card-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div>
              <p className="cf-card-title">Add Category</p>
              <p className="cf-card-subtitle" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ opacity: 0.5 }}>Home</span>
                  <span style={{ opacity: 0.3, fontSize: 10 }}>›</span>
                  <span style={{ opacity: 0.5 }}>Master</span>
                  <span style={{ opacity: 0.3, fontSize: 10 }}>›</span>
                  <span style={{ color: "var(--cf-accent)", fontWeight: 500 }}>Add Category</span>
                </span>
              </p>
            </div>
          </div>

          <div className="cf-card-body">
            <form onSubmit={onSubmit} className="cf-form">
              <div className="cf-fields-grid">
                {/* Category Name */}
                <div className="cf-field">
                  <label className="cf-label">
                    Category Name <span className="cf-required">*</span>
                  </label>
                  <div className="cf-input-wrap">
                    <input
                      type="text"
                      name="categoryName"
                      value={categoryForm.categoryName}
                      onChange={onFormChange}
                      placeholder="Enter category name"
                      className="cf-input"
                      required
                    />
                  </div>
                </div>

                {/* Ticket Price */}
                <div className="cf-field">
                  <label className="cf-label">
                    Ticket Price <span className="cf-required">*</span>
                  </label>
                  <div className="cf-input-wrap">
                    <span className="cf-input-prefix">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={categoryForm.price}
                      onChange={onFormChange}
                      placeholder="e.g. 500"
                      className="cf-input has-prefix"
                      required
                    />
                  </div>
                </div>

                {/* Cover Price */}
                <div className="cf-field">
                  <label className="cf-label">
                    Cover Price <span className="cf-required">*</span>
                  </label>
                  <div className="cf-input-wrap">
                    <span className="cf-input-prefix">₹</span>
                    <input
                      type="number"
                      name="coverPrice"
                      value={categoryForm.coverPrice}
                      onChange={onFormChange}
                      placeholder="e.g. 0"
                      className="cf-input has-prefix"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="cf-actions">
                <button type="submit" disabled={categoryLoading} className="cf-btn cf-btn-primary">
                  {categoryLoading ? (
                    <>
                      <span className="cf-spinner" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
                <button type="button" onClick={onReset} className="cf-btn cf-btn-secondary">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── TABLE CARD ── */}
        <div className="cf-card">
          <div className="cf-table-toolbar">
            <div className="cf-table-title">
              Categories
              <span className="cf-count-badge">{filteredCategories.length}</span>
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
                  <th>Category</th>
                  <th className="align-right">Ticket Price</th>
                  <th className="align-right">Cover Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item, index) => (
                    <tr key={item._id || `${item.categoryName}-${index}`}>
                      <td>{String(index + 1).padStart(2, "0")}</td>
                      <td>
                        <span className="cf-category-pill">
                          <span className="cf-category-dot" />
                          {item.categoryName}
                        </span>
                      </td>
                      <td className="align-right">
                        <span className={`cf-price ${!item.price || item.price === 0 ? "cf-price-zero" : ""}`}>
                          ₹{(item.price ?? 0).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="align-right">
                        <span className={`cf-price ${!item.coverPrice || item.coverPrice === 0 ? "cf-price-zero" : ""}`}>
                          ₹{(item.coverPrice ?? 0).toLocaleString("en-IN")}
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
                        <p className="cf-empty-text">No categories found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="cf-table-footer">
            Showing <strong>{filteredCategories.length}</strong>&nbsp;
            {filteredCategories.length === 1 ? "entry" : "entries"}
            {searchTerm && (
              <> for <strong>"{searchTerm}"</strong></>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

// ── Demo wrapper so the component renders with sample data ──
const sampleCategories = [
  { _id: "1", categoryName: "General",    price: 500,  coverPrice: 0   },
  { _id: "2", categoryName: "VIP",        price: 1500, coverPrice: 200 },
  { _id: "3", categoryName: "Premium",    price: 2500, coverPrice: 500 },
  { _id: "4", categoryName: "Economy",    price: 250,  coverPrice: 0   },
  { _id: "5", categoryName: "Corporate",  price: 3000, coverPrice: 750 },
];

export default function App() {
  const [form, setForm] = useState({ categoryName: "", price: "", coverPrice: "" });
  const [categories, setCategories] = useState(sampleCategories);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setCategories((c) => [...c, { ...form, _id: Date.now().toString() }]);
      setForm({ categoryName: "", price: "", coverPrice: "" });
      setLoading(false);
    }, 900);
  };

  return (
    <CategoryForm
      categoryForm={form}
      categories={categories}
      categoryLoading={loading}
      onFormChange={handleChange}
      onSubmit={handleSubmit}
      onReset={() => setForm({ categoryName: "", price: "", coverPrice: "" })}
    />
  );
}