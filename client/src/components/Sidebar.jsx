function Sidebar({ activeMenu, setActiveMenu, currentUser, allowedMenus = [], onLogout }) {
  const roleLabel =
    currentUser?.role === "DataEntry" || String(currentUser?.role || "").toLowerCase().replace(/\s+/g, "") === "dataentry"
      ? "Data Entry"
      : currentUser?.role || "Scanner";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "DB" },
    { id: "master", label: "Master", icon: "MS" },
    { id: "users", label: "Create Login", icon: "CL" },
    { id: "attendees", label: "Member", icon: "MB" },
    { id: "check-in", label: "Check In", icon: "CI" },
    { id: "reports", label: "Report", icon: "RP" },
  ];

  return (
    <aside className="hidden w-56 border-r border-[#dfe6f1] bg-[#f7f9fd] md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:flex-col print:hidden">
      {/* Header */}
      <div className="border-b border-[#dfe6f1] px-4 py-4">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#9b2d67] text-[10px] font-bold text-white">
              CP
            </div>
            <div>
              <h1 className="text-[11px] font-bold tracking-wide text-slate-700">CENTRE POINT</h1>
              <p className="text-[9px] text-slate-500">HOTELS & RESORTS</p>
            </div>
          </div>
          <span className="text-sm text-slate-500">|||</span>
        </div>
      </div>

      {/* User Strip */}
      {currentUser && (
        <div className="border-b border-[#e5ebf4] px-4 py-3">
          <p className="truncate text-xs font-medium text-slate-600">{currentUser.name}</p>
          <p className="truncate text-[10px] text-slate-500">{roleLabel}</p>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          const isMaster = item.id === "master";
          const isReport = item.id === "reports";
          const isMasterSectionActive = activeMenu === "add-category" || activeMenu === "add-facility";
          const isReportSectionActive =
            activeMenu === "member-report" ||
            activeMenu === "facility-report" ||
            activeMenu === "registration-report";
          const canSeeMaster =
            allowedMenus.includes("add-category") || allowedMenus.includes("add-facility");
          const canSeeReport =
            allowedMenus.includes("member-report") ||
            allowedMenus.includes("facility-report") ||
            allowedMenus.includes("registration-report");
          const canSeeDirect = allowedMenus.includes(item.id);

          if ((isMaster && !canSeeMaster) || (isReport && !canSeeReport) || (!isMaster && !isReport && !canSeeDirect)) {
            return null;
          }

          const masterDefault = allowedMenus.includes("add-category") ? "add-category" : "add-facility";
          const reportDefault = allowedMenus.includes("member-report")
            ? "member-report"
            : allowedMenus.includes("facility-report")
            ? "facility-report"
            : "registration-report";

          return (
            <div key={item.id} className="mb-1">
              <button
                onClick={() =>
                  setActiveMenu(isMaster ? masterDefault : isReport ? reportDefault : item.id)
                }
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition ${
                  (isActive || (isMaster && isMasterSectionActive) || (isReport && isReportSectionActive))
                    ? "bg-[#edf2fb] text-[#213b67]"
                    : "text-slate-600 hover:bg-[#eef3fb] hover:text-slate-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] text-[#5073a3]">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {isMaster && <span className="text-[10px] text-slate-400">^</span>}
                {isReport && <span className="text-[10px] text-slate-400">^</span>}
                {item.id === "attendees" && <span className="text-[10px] text-slate-400">v</span>}
              </button>

              {isMaster && (
                <div className="ml-6 mt-1 space-y-1">
                  {allowedMenus.includes("add-category") && (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("add-category")}
                      className={`block w-full rounded px-2 py-1 text-left text-[12px] hover:bg-[#eef3fb] ${
                        activeMenu === "add-category" ? "bg-[#edf2fb] text-[#213b67]" : "text-slate-600"
                      }`}
                    >
                      - Add Category
                    </button>
                  )}
                  {allowedMenus.includes("add-facility") && (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("add-facility")}
                      className={`block w-full rounded px-2 py-1 text-left text-[12px] hover:bg-[#eef3fb] ${
                        activeMenu === "add-facility" ? "bg-[#edf2fb] text-[#213b67]" : "text-slate-600"
                      }`}
                    >
                      - Add Facility
                    </button>
                  )}
                </div>
              )}

              {isReport && (
                <div className="ml-6 mt-1 space-y-1">
                  {allowedMenus.includes("member-report") && (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("member-report")}
                      className={`block w-full rounded px-2 py-1 text-left text-[12px] hover:bg-[#eef3fb] ${
                        activeMenu === "member-report" ? "bg-[#edf2fb] text-[#213b67]" : "text-slate-600"
                      }`}
                    >
                      - Member Report
                    </button>
                  )}
                  {allowedMenus.includes("facility-report") && (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("facility-report")}
                      className={`block w-full rounded px-2 py-1 text-left text-[12px] hover:bg-[#eef3fb] ${
                        activeMenu === "facility-report" ? "bg-[#edf2fb] text-[#213b67]" : "text-slate-600"
                      }`}
                    >
                      - Facility Report
                    </button>
                  )}
                  {allowedMenus.includes("registration-report") && (
                    <button
                      type="button"
                      onClick={() => setActiveMenu("registration-report")}
                      className={`block w-full rounded px-2 py-1 text-left text-[12px] hover:bg-[#eef3fb] ${
                        activeMenu === "registration-report" ? "bg-[#edf2fb] text-[#213b67]" : "text-slate-600"
                      }`}
                    >
                      - Registration Report
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#dfe6f1] px-3 py-3">
        <button
          onClick={onLogout}
          className="w-full rounded bg-[#e6edf8] px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-[#d9e5f6]"
        >
          Logout
        </button>
        <p className="mt-2 text-center text-[10px] text-slate-400">Ticket Booking Management</p>
      </div>
    </aside>
  );
}

export default Sidebar;
