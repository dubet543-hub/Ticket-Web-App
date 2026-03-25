import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .sb * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

  .sb {
    --bg: #f4f7fc;
    --surface: #ffffff;
    --border: #e2e8f2;
    --border-light: #edf1f8;
    --accent: #2f5ec4;
    --accent-bg: #eef3fb;
    --accent-ring: #d5e2f8;
    --accent-icon: #3d65c9;
    --brand: #9b2d67;
    --tx1: #1a2b4a;
    --tx2: #4a6080;
    --muted: #8fa3be;
    --hover: #eef3fb;
    --w-exp: 232px;
    --w-col: 68px;
    --ease: 280ms cubic-bezier(0.4,0,0.2,1);
  }

  .sb-aside {
    display: flex; flex-direction: column; height: 100vh;
    background: var(--bg);
    box-shadow: 0 2px 16px rgba(47,94,196,.07), 1px 0 0 var(--border);
    border-right: 1px solid var(--border);
    transition: width var(--ease);
    overflow: hidden;
  }
  .sb-aside.exp { width: var(--w-exp); }
  .sb-aside.col { width: var(--w-col); }

  /* HEADER */
  .sb-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 14px 14px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    min-height: 62px; flex-shrink: 0; gap: 8px;
  }
  .sb-brand { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
  .sb-logo {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--brand);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; letter-spacing: .05em;
    color: white; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(155,45,103,.25);
  }
  .sb-brand-text { min-width: 0; overflow: hidden; }
  .sb-brand-name {
    font-size: 11.5px; font-weight: 800; letter-spacing: .12em;
    color: var(--tx1); white-space: nowrap; text-transform: uppercase; line-height: 1.2;
  }
  .sb-brand-sub {
    font-size: 9.5px; font-weight: 600; letter-spacing: .1em;
    color: var(--muted); white-space: nowrap; text-transform: uppercase; margin-top: 1px;
  }
  .sb-toggle {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1px solid var(--border); background: var(--bg);
    color: var(--muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background .15s, color .15s, border-color .15s; outline: none;
  }
  .sb-toggle:hover { background: var(--hover); color: var(--accent); border-color: var(--accent-ring); }
  .sb-toggle svg { width: 14px; height: 14px; transition: transform var(--ease); }
  .sb-aside.col .sb-toggle svg { transform: rotate(180deg); }

  /* USER */
  .sb-user { padding: 10px 12px; border-bottom: 1px solid var(--border-light); background: var(--surface); flex-shrink: 0; }
  .sb-user-card {
    display: flex; align-items: center; gap: 9px; padding: 8px 10px;
    border-radius: 8px; border: 1px solid var(--border-light); background: var(--bg);
  }
  .sb-avatar {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg,#3d65c9,#2f5ec4);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
    font-family: 'DM Mono', monospace;
  }
  .sb-user-info { min-width: 0; flex: 1; overflow: hidden; }
  .sb-user-name { font-size: 12.5px; font-weight: 700; color: var(--tx1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.3; }
  .sb-user-role { font-size: 10.5px; font-weight: 500; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
  .sb-role-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #10b981; margin-right: 4px; vertical-align: middle; }

  /* NAV */
  .sb-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 12px 10px; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
  .sb-nav::-webkit-scrollbar { width: 4px; }
  .sb-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .sb-sec-label { font-size: 9.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); padding: 0 8px; margin-bottom: 6px; white-space: nowrap; overflow: hidden; }
  .sb-list { display: flex; flex-direction: column; gap: 2px; }

  /* ITEM */
  .sb-item {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 0 8px; height: 40px; border-radius: 8px;
    border: 1px solid transparent; background: transparent;
    cursor: pointer; text-align: left;
    transition: background .12s, color .12s, border-color .12s, box-shadow .12s;
    outline: none; gap: 8px; overflow: hidden;
  }
  .sb-item:hover { background: var(--hover); }
  .sb-item.active { background: var(--accent-bg); border-color: var(--accent-ring); box-shadow: 0 1px 4px rgba(47,94,196,.08); }
  .sb-item-l { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; overflow: hidden; }
  .sb-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    font-size: 9px; font-weight: 800; letter-spacing: .04em;
    font-family: 'DM Mono', monospace;
    transition: background .12s, color .12s;
    background: white; color: var(--tx2);
    border: 1px solid var(--border-light);
  }
  .sb-item.active .sb-icon { background: var(--accent-bg); color: var(--accent-icon); border-color: var(--accent-ring); }
  .sb-item:hover:not(.active) .sb-icon { background: var(--hover); border-color: var(--border); }
  .sb-item-lbl { font-size: 13px; font-weight: 500; color: var(--tx2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color .12s; }
  .sb-item.active .sb-item-lbl { color: var(--tx1); font-weight: 600; }
  .sb-item:hover .sb-item-lbl { color: var(--tx1); }
  .sb-chev { flex-shrink: 0; width: 14px; height: 14px; color: var(--muted); transition: transform var(--ease), color .15s; }
  .sb-chev.open { transform: rotate(180deg); color: var(--accent); }

  /* SUBMENU */
  .sb-sub { overflow: hidden; transition: max-height var(--ease), opacity var(--ease); max-height: 0; opacity: 0; }
  .sb-sub.open { max-height: 200px; opacity: 1; }
  .sb-sub-inner { padding: 3px 0 4px 48px; position: relative; }
  .sb-sub-inner::before { content: ''; position: absolute; left: 23px; top: 4px; bottom: 4px; width: 1.5px; background: var(--border); border-radius: 2px; }
  .sb-sub-btn {
    width: 100%; display: flex; align-items: center; gap: 8px; height: 33px;
    padding: 0 10px; border-radius: 7px; border: none; background: transparent;
    cursor: pointer; text-align: left; font-size: 12px; font-weight: 500;
    color: var(--tx2); transition: background .12s, color .12s; outline: none;
    position: relative; white-space: nowrap;
  }
  .sb-sub-btn::before { content: ''; position: absolute; left: -9px; top: 50%; width: 9px; height: 1.5px; background: var(--border); transform: translateY(-50%); }
  .sb-sub-btn:hover { background: var(--hover); color: var(--tx1); }
  .sb-sub-btn.active { background: var(--accent-bg); color: var(--accent); font-weight: 600; }
  .sb-sub-btn.active::before { background: var(--accent); }
  .sb-sub-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: .5; flex-shrink: 0; }
  .sb-sub-btn.active .sb-sub-dot { opacity: 1; }

  /* FOOTER */
  .sb-footer { border-top: 1px solid var(--border); padding: 10px; background: var(--surface); flex-shrink: 0; }
  .sb-logout {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
    height: 36px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); cursor: pointer; font-size: 12.5px; font-weight: 600;
    color: var(--tx2); transition: background .15s, color .15s, border-color .15s; outline: none;
    white-space: nowrap; overflow: hidden;
  }
  .sb-logout:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .sb-logout svg { width: 14px; height: 14px; flex-shrink: 0; }
  .sb-footer-note { margin-top: 8px; text-align: center; font-size: 9.5px; color: var(--muted); letter-spacing: .02em; white-space: nowrap; overflow: hidden; }

  /* collapsed */
  .sb-aside.col .sb-brand-text,
  .sb-aside.col .sb-user-info,
  .sb-aside.col .sb-item-lbl,
  .sb-aside.col .sb-chev,
  .sb-aside.col .sb-sec-label,
  .sb-aside.col .sb-sub,
  .sb-aside.col .sb-footer-note,
  .sb-aside.col .sb-logout-lbl { display: none; }
  .sb-aside.col .sb-user-card { justify-content: center; padding: 6px; }
  .sb-aside.col .sb-item { justify-content: center; padding: 0; }
  .sb-aside.col .sb-item-l { justify-content: center; flex: none; }
  .sb-aside.col .sb-logout { padding: 0; }
`;

function Sidebar({ activeMenu, setActiveMenu, currentUser, allowedMenus = [], onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({ master: true, reports: true });

  const roleLabel =
    String(currentUser?.role || "").toLowerCase().replace(/\s+/g, "") === "dataentry"
      ? "Data Entry"
      : currentUser?.role || "Scanner";

  const menuItems = [
    { id: "dashboard", label: "Dashboard",    icon: "DB" },
    { id: "master",    label: "Master",       icon: "MS" },
    { id: "users",     label: "Create Login", icon: "CL" },
    { id: "attendees", label: "Member",       icon: "MB" },
    { id: "check-in",  label: "Check In",     icon: "CI" },
    { id: "reports",   label: "Report",       icon: "RP" },
  ];

  const isMasterActive = ["add-category","add-facility"].includes(activeMenu);
  const isReportActive = ["member-report","facility-report","registration-report"].includes(activeMenu);
  const canSeeMaster   = allowedMenus.includes("add-category") || allowedMenus.includes("add-facility");
  const canSeeReport   = ["member-report","facility-report","registration-report"].some(x => allowedMenus.includes(x));
  const masterDefault  = allowedMenus.includes("add-category") ? "add-category" : "add-facility";
  const reportDefault  = allowedMenus.includes("member-report") ? "member-report" : allowedMenus.includes("facility-report") ? "facility-report" : "registration-report";

  const isVisible = (item) => {
    if (item.id === "master"  && !canSeeMaster) return false;
    if (item.id === "reports" && !canSeeReport) return false;
    if (item.id !== "master" && item.id !== "reports" && !allowedMenus.includes(item.id)) return false;
    return true;
  };

  const isActive = (item) => {
    if (item.id === "master")  return isMasterActive;
    if (item.id === "reports") return isReportActive;
    return activeMenu === item.id;
  };

  const handleClick = (item) => {
    if (item.id === "master") {
      setOpenMenus(p => ({ ...p, master: !p.master }));
      if (!openMenus.master) setActiveMenu(masterDefault);
      return;
    }
    if (item.id === "reports") {
      setOpenMenus(p => ({ ...p, reports: !p.reports }));
      if (!openMenus.reports) setActiveMenu(reportDefault);
      return;
    }
    setActiveMenu(item.id);
  };

  const initials = (n = "") => n.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "U";

  return (
    <>
      <style>{styles}</style>
      <aside className={`sb sb-aside ${collapsed ? "col" : "exp"}`}>

        {/* Header */}
        <div className="sb-header">
          <div className="sb-brand">
            <div className="sb-logo">CP</div>
            <div className="sb-brand-text">
              <div className="sb-brand-name">Centre Point</div>
              <div className="sb-brand-sub">Hotels &amp; Resorts</div>
            </div>
          </div>
          <button type="button" className="sb-toggle" onClick={() => setCollapsed(p => !p)} title={collapsed ? "Expand" : "Collapse"}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* User */}
        {currentUser && (
          <div className="sb-user">
            <div className="sb-user-card">
              <div className="sb-avatar">{initials(currentUser.name)}</div>
              <div className="sb-user-info">
                <div className="sb-user-name">{currentUser.name}</div>
                <div className="sb-user-role"><span className="sb-role-dot" />{roleLabel}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="sb-nav">
          {!collapsed && <div className="sb-sec-label">Main Menu</div>}
          <div className="sb-list">
            {menuItems.map((item) => {
              if (!isVisible(item)) return null;
              const active   = isActive(item);
              const isMaster = item.id === "master";
              const isReport = item.id === "reports";
              const isOpen   = (isMaster && openMenus.master) || (isReport && openMenus.reports);

              return (
                <div key={item.id}>
                  <button type="button" className={`sb-item${active ? " active" : ""}`} onClick={() => handleClick(item)} title={collapsed ? item.label : ""}>
                    <span className="sb-item-l">
                      <span className="sb-icon">{item.icon}</span>
                      <span className="sb-item-lbl">{item.label}</span>
                    </span>
                    {(isMaster || isReport) && !collapsed && (
                      <svg className={`sb-chev${isOpen ? " open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    )}
                  </button>

                  {isMaster && canSeeMaster && (
                    <div className={`sb-sub${openMenus.master && !collapsed ? " open" : ""}`}>
                      <div className="sb-sub-inner">
                        {allowedMenus.includes("add-category") && (
                          <button type="button" className={`sb-sub-btn${activeMenu === "add-category" ? " active" : ""}`} onClick={() => setActiveMenu("add-category")}>
                            <span className="sb-sub-dot" /> Add Category
                          </button>
                        )}
                        {allowedMenus.includes("add-facility") && (
                          <button type="button" className={`sb-sub-btn${activeMenu === "add-facility" ? " active" : ""}`} onClick={() => setActiveMenu("add-facility")}>
                            <span className="sb-sub-dot" /> Add Facility
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {isReport && canSeeReport && (
                    <div className={`sb-sub${openMenus.reports && !collapsed ? " open" : ""}`}>
                      <div className="sb-sub-inner">
                        {allowedMenus.includes("member-report") && (
                          <button type="button" className={`sb-sub-btn${activeMenu === "member-report" ? " active" : ""}`} onClick={() => setActiveMenu("member-report")}>
                            <span className="sb-sub-dot" /> Member Report
                          </button>
                        )}
                        {allowedMenus.includes("facility-report") && (
                          <button type="button" className={`sb-sub-btn${activeMenu === "facility-report" ? " active" : ""}`} onClick={() => setActiveMenu("facility-report")}>
                            <span className="sb-sub-dot" /> Facility Report
                          </button>
                        )}
                        {allowedMenus.includes("registration-report") && (
                          <button type="button" className={`sb-sub-btn${activeMenu === "registration-report" ? " active" : ""}`} onClick={() => setActiveMenu("registration-report")}>
                            <span className="sb-sub-dot" /> Registration Report
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <button type="button" className="sb-logout" onClick={onLogout} title={collapsed ? "Logout" : ""}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="sb-logout-lbl">Logout</span>
          </button>
          <div className="sb-footer-note">Ticket Booking Management</div>
        </div>

      </aside>
    </>
  );
}

// Demo wrapper
export default function App() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  return (
    <div style={{ display: "flex", height: "100vh", background: "#f0f4fa" }}>
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        currentUser={{ name: "Rahul Sharma", role: "Admin" }}
        allowedMenus={["dashboard","master","users","attendees","check-in","reports","add-category","add-facility","member-report","facility-report","registration-report"]}
        onLogout={() => alert("Logged out")}
      />
      <main style={{ flex: 1, padding: 32, fontFamily: "DM Sans, sans-serif" }}>
        <h2 style={{ color: "#1a2b4a", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
          Active: <span style={{ color: "#2f5ec4" }}>{activeMenu}</span>
        </h2>
        <p style={{ color: "#64748b", fontSize: 13 }}>Click sidebar items to navigate.</p>
      </main>
    </div>
  );
}