import { useState, useEffect } from "react";

// ─── tiny helper ──────────────────────────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (start === end) { setDisplay(end); return; }
    const step = Math.ceil(end / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─── badge icon ───────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  const palettes = {
    teal:   { bg: "#d8f3ef", text: "#0f6c63", border: "#b2e4dd" },
    emerald:{ bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
    amber:  { bg: "#fef3c7", text: "#92400e", border: "#fde68a" },
    red:    { bg: "#fee2e2", text: "#991b1b", border: "#fecaca" },
    blue:   { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
    slate:  { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" },
  };
  const p = palettes[color] || palettes.slate;
  return (
    <span style={{
      background: p.bg, color: p.text, border: `1px solid ${p.border}`,
      borderRadius: "8px", padding: "3px 9px",
      fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em",
      fontFamily: "'DM Mono', monospace",
    }}>
      {label}
    </span>
  );
}

// ─── accent bar ───────────────────────────────────────────────────────────────
function AccentBar({ color }) {
  const colors = {
    teal:    "linear-gradient(90deg,#1a8f84,#24a79c)",
    emerald: "linear-gradient(90deg,#059669,#34d399)",
    amber:   "linear-gradient(90deg,#d97706,#fbbf24)",
    red:     "linear-gradient(90deg,#dc2626,#f87171)",
    blue:    "linear-gradient(90deg,#2563eb,#60a5fa)",
    slate:   "linear-gradient(90deg,#475569,#94a3b8)",
  };
  return (
    <div style={{
      marginTop: "16px", height: "3px", width: "36px", borderRadius: "99px",
      background: colors[color] || colors.slate,
    }} />
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, prefix = "", suffix = "", badge, badgeColor, accentColor, size = "md" }) {
  return (
    <div className="metric-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <p style={{
          fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "#64748b",
          fontFamily: "'DM Mono', monospace",
        }}>
          {label}
        </p>
        <Badge label={badge} color={badgeColor} />
      </div>
      <h3 style={{
        marginTop: "14px",
        fontSize: size === "lg" ? "2.25rem" : "1.85rem",
        fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em",
        color: "#0f172a",
        fontFamily: "'Sora', sans-serif",
      }}>
        {prefix}<AnimatedNumber value={value} />{suffix}
      </h3>
      <AccentBar color={accentColor} />
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em",
      textTransform: "uppercase", color: "#94a3b8",
      fontFamily: "'DM Mono', monospace",
      marginBottom: "14px",
    }}>
      {children}
    </p>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ dashboardStats = {}, onPrintReport }) {
  const {
    totalAttendees = 0,
    checkedInCount = 0,
    pendingCount = 0,
    totalTicketAmount = 0,
    totalCoverAmount = 0,
    whatsappSentCount = 0,
    whatsappFailedCount = 0,
    duplicateScanCount = 0,
    categoryWiseCount = [],
  } = dashboardStats;

  const checkInRate = totalAttendees > 0
    ? Math.round((checkedInCount / totalAttendees) * 100) : 0;

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

        .dashboard-root *, .dashboard-root *::before, .dashboard-root *::after {
          box-sizing: border-box;
        }

        /* Dashboard fills the app-main panel — no extra padding or bg needed */
        .dashboard-root {
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .card {
          background: #ffffff;
          border: 1px solid #d4e4f0;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(15,30,55,0.06), 0 8px 24px rgba(15,30,55,0.05);
          padding: 26px 28px;
        }

        .metric-card {
          background: #ffffff;
          border: 1px solid #d4e4f0;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(15,30,55,0.06), 0 8px 24px rgba(15,30,55,0.05);
          padding: 22px 22px 20px;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .metric-card:hover {
          transform: translateY(-3px);
          border-color: #b6d4e8;
          box-shadow: 0 10px 32px rgba(15,30,55,0.12);
        }

        .grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 1200px) {
          .grid-5 { grid-template-columns: repeat(3, 1fr); }
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 720px) {
          .grid-5, .grid-4 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .grid-5, .grid-4 { grid-template-columns: 1fr; }
        }

        .progress-track {
          height: 8px;
          background: #ddeaf4;
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5);
          transition: width 1s cubic-bezier(.4,0,.2,1);
        }

        .print-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #1a8f84 0%, #24a79c 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 11px 24px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(26,143,132,0.28);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .print-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(26,143,132,0.36);
        }
        .print-btn:active { transform: translateY(0); opacity: 0.9; }

        .live-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.5);
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        .cat-chip {
          background: #f6fafd;
          border: 1px solid #d4e4f0;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cat-chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(15,30,55,0.08);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(203,220,235,0.8), transparent);
          margin: 4px 0;
        }

        @media print {
          .print-btn, .dashboard-root { box-shadow: none !important; }
          .metric-card, .card { break-inside: avoid; }
        }
      `}</style>

      <div className="dashboard-root">
        <div style={{ maxWidth: "1380px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* ── Hero Header ── */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "22px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span className="live-dot" />
                  <p style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em",
                    textTransform: "uppercase", color: "#64748b",
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    Live Operations
                  </p>
                </div>
                <h1 style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1,
                  color: "#0f172a", fontFamily: "'Sora', sans-serif",
                }}>
                  Event Pulse Dashboard
                </h1>
                <p style={{ marginTop: "7px", fontSize: "13.5px", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
                  Real-time ticketing, check-in &amp; communication metrics.
                </p>
              </div>
              <button className="print-btn" onClick={onPrintReport}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Report
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#475569", fontFamily: "'DM Mono', monospace" }}>
                Check-In Progress
              </p>
              <span style={{
                fontSize: "12px", fontWeight: 700, color: "#1a8f84",
                fontFamily: "'DM Mono', monospace",
              }}>
                {checkInRate}%
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${checkInRate}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>0</span>
              <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "'DM Mono', monospace" }}>
                {checkedInCount} / {totalAttendees}
              </span>
            </div>
          </div>

          {/* ── Primary Metrics ── */}
          <div>
            <SectionLabel>Attendance Overview</SectionLabel>
            <div className="grid-5">
              <MetricCard label="Total Attendees"  value={totalAttendees}       badge="AT" badgeColor="teal"    accentColor="teal" />
              <MetricCard label="Checked In"        value={checkedInCount}        badge="IN" badgeColor="emerald" accentColor="emerald" />
              <MetricCard label="Pending Entry"     value={pendingCount}          badge="PD" badgeColor="amber"   accentColor="amber" />
              <MetricCard label="Ticket Amount"     value={totalTicketAmount}  prefix="₹" badge="TK" badgeColor="slate"   accentColor="teal" />
              <MetricCard label="Cover Amount"      value={totalCoverAmount}   prefix="₹" badge="CV" badgeColor="slate"   accentColor="slate" />
            </div>
          </div>

          {/* ── Secondary Metrics ── */}
          <div>
            <SectionLabel>Communications &amp; Integrity</SectionLabel>
            <div className="grid-4">
              <MetricCard label="WhatsApp Sent"    value={whatsappSentCount}    badge="WS" badgeColor="emerald" accentColor="emerald" />
              <MetricCard label="WhatsApp Failed"  value={whatsappFailedCount}  badge="WF" badgeColor="red"     accentColor="red" />
              <MetricCard label="Duplicate Scans"  value={duplicateScanCount}   badge="DS" badgeColor="amber"   accentColor="amber" />
              <MetricCard label="Check-in Rate"    value={checkInRate}   suffix="%" badge="CR" badgeColor="blue"    accentColor="blue" />
            </div>
          </div>

          {/* ── Category Distribution ── */}
          {categoryWiseCount.length > 0 && (
            <div className="card" style={{ paddingBottom: "28px" }}>
              <SectionLabel>Registration by Category</SectionLabel>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "14px",
              }}>
                {categoryWiseCount.map((cat, idx) => (
                  <div key={idx} className="cat-chip">
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                      {cat.categoryName}
                    </p>
                    <div className="divider" />
                    <p style={{
                      fontSize: "1.75rem", fontWeight: 800, color: "#0f172a",
                      fontFamily: "'Sora', sans-serif", letterSpacing: "-0.03em",
                    }}>
                      <AnimatedNumber value={cat.count} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}