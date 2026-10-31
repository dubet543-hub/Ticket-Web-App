import { getEntryType } from "../utils/ticketImage";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

  .ci-root {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── CARD ── */
  .ci-card {
    width: 100%;
    background: #ffffff;
    border: 1.5px solid #ccdde8;
    border-radius: 16px;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.8),
      0 4px 6px rgba(15,30,55,0.06),
      0 12px 28px rgba(15,30,55,0.12);
    overflow: hidden;
  }

  .ci-topbar { height: 4px; background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5); }
  .ci-body { padding: 26px 30px 28px; }

  .ci-eyebrow {
    display: flex; align-items: center; gap: 7px;
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: #94a3b8; margin-bottom: 6px;
  }

  .ci-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #1a8f84; flex-shrink: 0;
    animation: ci-glow 2s infinite;
  }

  @keyframes ci-glow {
    0%   { box-shadow: 0 0 0 0 rgba(26,143,132,0.45); }
    70%  { box-shadow: 0 0 0 6px rgba(26,143,132,0); }
    100% { box-shadow: 0 0 0 0 rgba(26,143,132,0); }
  }

  .ci-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.4rem; font-weight: 800;
    letter-spacing: -0.03em; color: #0f172a; line-height: 1.15;
  }

  .ci-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }

  /* ── SCAN BAR ── */
  .ci-form {
    display: grid;
    grid-template-columns: minmax(180px, 240px) 1fr auto;
    gap: 14px;
    align-items: end;
    margin-top: 22px;
  }

  .ci-field { display: flex; flex-direction: column; gap: 7px; }

  .ci-label {
    font-size: 10.5px; font-weight: 700;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.09em; text-transform: uppercase; color: #475569;
  }

  .ci-input, .ci-select {
    width: 100%; height: 50px;
    font-size: 15px; font-family: 'DM Sans', sans-serif; color: #0f172a;
    background: #f8fafc; border: 1.5px solid #dde9f2;
    border-radius: 12px; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }

  .ci-select { padding: 0 38px 0 14px; appearance: none; -webkit-appearance: none; cursor: pointer; }
  .ci-input { padding: 0 16px 0 46px; }
  .ci-input::placeholder { color: #a0b0bd; }

  .ci-input:focus, .ci-select:focus {
    border-color: #1a8f84; background: #fff;
    box-shadow: 0 0 0 4px rgba(26,143,132,0.13);
  }

  .ci-select-wrap, .ci-input-wrap { position: relative; }

  .ci-select-wrap::after {
    content: ''; pointer-events: none; position: absolute;
    right: 15px; top: 50%; transform: translateY(-50%);
    border-left: 4.5px solid transparent;
    border-right: 4.5px solid transparent;
    border-top: 5.5px solid #94a3b8;
  }

  .ci-input-icon {
    position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
    width: 20px; height: 20px; color: #1a8f84; pointer-events: none;
  }

  .ci-btn {
    height: 50px; padding: 0 26px;
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    background: linear-gradient(135deg, #1a8f84, #24a79c);
    color: #fff; border: none; border-radius: 12px;
    font-size: 14.5px; font-weight: 700; font-family: 'DM Sans', sans-serif;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 2px 12px rgba(26,143,132,0.3);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  }

  .ci-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,143,132,0.38); }
  .ci-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .ci-spinner {
    width: 17px; height: 17px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: ci-spin 0.7s linear infinite;
  }

  @keyframes ci-spin { to { transform: rotate(360deg); } }

  .ci-hint { margin: 14px 0 0; font-size: 12.5px; color: #64748b; }

  .ci-hint kbd {
    font-family: 'DM Mono', monospace; font-size: 11px;
    padding: 1px 6px; border-radius: 5px;
    border: 1px solid #dde9f2; background: #f8fafc; color: #475569;
  }

  /* ── RESULT ── */
  .ci-result {
    border-radius: 16px; overflow: hidden;
    border: 1.5px solid var(--ci-border);
    background: #fff;
    box-shadow: 0 12px 28px rgba(15,30,55,0.10);
    animation: ci-pop 0.25s ease;
  }

  @keyframes ci-pop {
    from { opacity: 0; transform: translateY(-6px) scale(0.99); }
    to   { opacity: 1; transform: none; }
  }

  .ci-result.ok   { --ci-main: #059669; --ci-soft: #ecfdf5; --ci-border: #a7f3d0; }
  .ci-result.dup  { --ci-main: #d97706; --ci-soft: #fffbeb; --ci-border: #fcd34d; }
  .ci-result.bad  { --ci-main: #dc2626; --ci-soft: #fef2f2; --ci-border: #fecaca; }

  .ci-result-head {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 26px;
    background: var(--ci-soft);
    border-bottom: 1px solid var(--ci-border);
  }

  .ci-result-icon {
    width: 52px; height: 52px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: var(--ci-main); color: #fff; flex-shrink: 0;
    box-shadow: 0 6px 16px color-mix(in srgb, var(--ci-main) 35%, transparent);
  }

  .ci-result-status {
    font-family: 'Sora', sans-serif;
    font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em;
    color: var(--ci-main); line-height: 1.1;
  }

  .ci-result-msg { font-size: 13px; color: #475569; margin-top: 3px; }

  .ci-icon-btn {
    width: 32px; height: 32px; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    background: transparent; border: 1px solid transparent; border-radius: 9px;
    color: #94a3b8; cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .ci-icon-btn:hover { background: #fff1f2; border-color: #fecdd3; color: #e11d48; }
  .ci-result-head .ci-icon-btn { margin-left: auto; }

  .ci-clear-btn {
    height: 28px; padding: 0 12px;
    background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; color: #475569;
    cursor: pointer; transition: background 0.15s, color 0.15s;
  }

  .ci-clear-btn:hover { background: #fff1f2; color: #e11d48; border-color: #fecdd3; }

  .ci-person {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
    padding: 20px 26px 4px;
  }

  .ci-person-name {
    font-family: 'Sora', sans-serif;
    font-size: 1.6rem; font-weight: 800; letter-spacing: -0.03em;
    color: #0f172a; word-break: break-word;
  }

  .ci-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 999px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase;
    color: #fff; background: var(--ci-entry);
  }

  .ci-pill.female    { --ci-entry: #a3123f; }
  .ci-pill.male      { --ci-entry: #2f8f8c; }
  .ci-pill.enclosure { --ci-entry: #b8892f; }

  .ci-details {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    margin: 16px 26px 24px;
    background: #e8f1f8;
    border: 1px solid #e8f1f8;
    border-radius: 12px;
    overflow: hidden;
  }

  .ci-detail { background: #fff; padding: 12px 16px; }

  .ci-detail-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8;
  }

  .ci-detail-value {
    margin-top: 4px; font-size: 15px; font-weight: 600; color: #0f172a;
    word-break: break-word;
  }

  .ci-detail-value.mono { font-family: 'DM Mono', monospace; font-size: 14px; }

  /* ── RECENT SCANS ── */
  .ci-recent-head {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 16px 22px; border-bottom: 1px solid #e8f1f8;
  }

  .ci-recent-title {
    font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 700; color: #0f172a;
    display: flex; align-items: center; gap: 9px;
  }

  .ci-counts { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .ci-count {
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700;
    padding: 3px 9px; border-radius: 999px;
  }

  .ci-count.ok  { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
  .ci-count.bad { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

  .ci-recent-list { list-style: none; margin: 0; padding: 0; }

  .ci-recent-item {
    display: grid;
    grid-template-columns: 64px 1fr auto auto;
    align-items: center; gap: 14px;
    padding: 11px 22px;
    border-bottom: 1px solid #f0f6fb;
    font-size: 13.5px;
  }

  .ci-recent-item:last-child { border-bottom: none; }

  .ci-recent-time { font-family: 'DM Mono', monospace; font-size: 12px; color: #94a3b8; }
  .ci-recent-who { color: #0f172a; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ci-recent-who span { color: #94a3b8; font-weight: 500; margin-left: 6px; }

  .ci-tag {
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; white-space: nowrap;
  }

  .ci-tag.ok  { background: #ecfdf5; color: #047857; }
  .ci-tag.dup { background: #fffbeb; color: #b45309; }
  .ci-tag.bad { background: #fef2f2; color: #b91c1c; }

  @media (max-width: 760px) {
    .ci-body { padding: 20px 16px 22px; }
    .ci-form { grid-template-columns: 1fr; }
    .ci-btn { width: 100%; }
    .ci-details { grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 14px 16px 18px; }
    .ci-result-head, .ci-person { padding-left: 16px; padding-right: 16px; }
    .ci-recent-item { padding: 10px 16px; grid-template-columns: 52px 1fr auto auto; gap: 8px; }
  }
`;

const ENTRY_LABELS = {
  female: "Female Entry",
  male: "Male Entry",
  enclosure: "Enclosure · VIP",
};

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "-";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "-";

// ok = entry allowed, dup = ticket already used, bad = invalid / other error
const resultKind = (result) => {
  if (result.type === "success") return "ok";
  return result.attendee?.isCheckedIn ? "dup" : "bad";
};

const RESULT_TEXT = {
  ok: "Entry allowed",
  dup: "Already checked in",
  bad: "Entry denied",
};

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ResultIcon = ({ kind }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {kind === "ok" && <polyline points="20 6 9 17 4 12" />}
    {kind === "dup" && <><line x1="12" y1="7" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
    {kind === "bad" && <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>}
  </svg>
);

function CheckInResult({ result, onDismiss }) {
  const kind = resultKind(result);
  const attendee = result.attendee;
  const entryType = attendee ? getEntryType(attendee) : null;
  const lastGate = attendee?.checkInHistory?.at(-1)?.facility?.facilityName;

  return (
    <div className={`ci-result ${kind}`} role="status" aria-live="assertive">
      <div className="ci-result-head">
        <div className="ci-result-icon"><ResultIcon kind={kind} /></div>
        <div>
          <div className="ci-result-status">{RESULT_TEXT[kind]}</div>
          <div className="ci-result-msg">{result.message}</div>
        </div>
        <button type="button" className="ci-icon-btn" onClick={onDismiss} title="Dismiss" aria-label="Dismiss result">
          <DeleteIcon />
        </button>
      </div>

      {attendee && (
        <>
          <div className="ci-person">
            <div className="ci-person-name">{attendee.name || "Guest"}</div>
            <span className={`ci-pill ${entryType}`}>{ENTRY_LABELS[entryType]}</span>
          </div>

          <div className="ci-details">
            <div className="ci-detail">
              <div className="ci-detail-label">Reg No</div>
              <div className="ci-detail-value mono">{attendee.registrationNo || "-"}</div>
            </div>
            <div className="ci-detail">
              <div className="ci-detail-label">Category</div>
              <div className="ci-detail-value">{attendee.category?.categoryName || "-"}</div>
            </div>
            <div className="ci-detail">
              <div className="ci-detail-label">Mobile</div>
              <div className="ci-detail-value mono">{attendee.mobile || "-"}</div>
            </div>
            <div className="ci-detail">
              <div className="ci-detail-label">Ticket Price</div>
              <div className="ci-detail-value">{formatMoney(attendee.amount)}</div>
            </div>
            <div className="ci-detail">
              <div className="ci-detail-label">Cover Price</div>
              <div className="ci-detail-value">{formatMoney(attendee.coverAmount)}</div>
            </div>
            <div className="ci-detail">
              <div className="ci-detail-label">{kind === "dup" ? "First checked in" : "Checked in at"}</div>
              <div className="ci-detail-value">
                {formatDateTime(attendee.checkedInAt)}
                {lastGate ? ` · ${lastGate}` : ""}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CheckInScanner({
  checkInForm,
  checkInLoading,
  checkInResult,
  recentScans = [],
  onDeleteScan = () => {},
  onClearScans = () => {},
  onDismissResult = () => {},
  scanInputRef,
  onFormChange,
  onSubmit,
  facilities = [],
}) {
  const allowedCount = recentScans.filter((scan) => scan.allowed).length;
  const deniedCount = recentScans.length - allowedCount;

  return (
    <>
      <style>{styles}</style>
      <div className="ci-root print:hidden">

        {/* ── SCANNER ── */}
        <div className="ci-card">
          <div className="ci-topbar" />
          <div className="ci-body">
            <p className="ci-eyebrow"><span className="ci-live-dot" />Gate Scanner</p>
            <h3 className="ci-title">Scan Tickets for Entry</h3>
            <p className="ci-subtitle">Choose the gate, then scan the guest&apos;s QR code or type their registration number.</p>

            <form onSubmit={onSubmit} className="ci-form">
              <div className="ci-field">
                <label className="ci-label" htmlFor="ci-facility">Gate</label>
                <div className="ci-select-wrap">
                  <select
                    id="ci-facility"
                    name="facility"
                    value={checkInForm.facility || ""}
                    onChange={onFormChange}
                    className="ci-select"
                  >
                    <option value="">All Gates</option>
                    {facilities.map((facility) => (
                      <option key={facility._id} value={facility._id}>
                        {facility.facilityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ci-field">
                <label className="ci-label" htmlFor="ci-scan">Scan or enter code</label>
                <div className="ci-input-wrap">
                  <svg className="ci-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                    <rect x="7" y="7" width="4" height="4" rx="0.5" />
                    <rect x="13" y="13" width="4" height="4" rx="0.5" />
                    <path d="M13 7h4v2M7 15v2h2" />
                  </svg>
                  <input
                    id="ci-scan"
                    ref={scanInputRef}
                    type="text"
                    name="scanValue"
                    value={checkInForm.scanValue}
                    onChange={onFormChange}
                    placeholder="Scan QR or enter Reg. No. (e.g. MA0001)"
                    autoComplete="off"
                    className="ci-input"
                  />
                </div>
              </div>

              <button type="submit" disabled={checkInLoading} className="ci-btn">
                {checkInLoading ? (
                  <><span className="ci-spinner" /><span>Checking…</span></>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Check In</span>
                  </>
                )}
              </button>
            </form>

            <p className="ci-hint">
              {checkInLoading
                ? "Checking ticket…"
                : <>Ready to scan. Typed codes are submitted with <kbd>Enter</kbd>.</>}
            </p>
          </div>
        </div>

        {/* ── RESULT ── */}
        {checkInResult && <CheckInResult result={checkInResult} onDismiss={onDismissResult} />}

        {/* ── RECENT SCANS ── */}
        {recentScans.length > 0 && (
          <div className="ci-card">
            <div className="ci-recent-head">
              <div className="ci-recent-title">Recent scans</div>
              <div className="ci-counts">
                <span className="ci-count ok">{allowedCount} allowed</span>
                <span className="ci-count bad">{deniedCount} denied</span>
                <button type="button" className="ci-clear-btn" onClick={onClearScans}>Clear all</button>
              </div>
            </div>
            <ul className="ci-recent-list">
              {recentScans.map((scan) => {
                const kind = scan.allowed ? "ok" : scan.attendee?.isCheckedIn ? "dup" : "bad";
                return (
                  <li key={scan.id} className="ci-recent-item">
                    <span className="ci-recent-time">{formatTime(scan.at)}</span>
                    <span className="ci-recent-who">
                      {scan.attendee?.name || scan.label}
                      {scan.attendee?.registrationNo && <span>{scan.attendee.registrationNo}</span>}
                    </span>
                    <span className={`ci-tag ${kind}`}>{RESULT_TEXT[kind]}</span>
                    <button
                      type="button"
                      className="ci-icon-btn"
                      onClick={() => onDeleteScan(scan.id)}
                      title="Remove from list"
                      aria-label={`Remove ${scan.attendee?.name || scan.label} from recent scans`}
                    >
                      <DeleteIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      </div>
    </>
  );
}

export default CheckInScanner;
