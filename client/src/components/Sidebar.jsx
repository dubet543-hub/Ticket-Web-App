function Sidebar({ activeMenu, setActiveMenu, currentUser, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "master", label: "Master Data", icon: "⚙️", subItems: true },
    { id: "users", label: "Users", icon: "👥" },
    { id: "attendees", label: "Attendees", icon: "👤" },
    { id: "check-in", label: "Check-In", icon: "✓" },
    { id: "reports", label: "Reports", icon: "📑" },
  ];

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-600";
      case "DataEntry":
        return "bg-blue-600";
      case "Scanner":
        return "bg-green-600";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <aside className="hidden w-72 bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white md:block print:hidden shadow-xl flex flex-col">
      <div className="mb-8 border-b border-slate-700 pb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Event Manager</h1>
        <p className="mt-2 text-xs text-slate-400">Ticket & Entry System</p>
      </div>

      {/* Current User Info */}
      {currentUser && (
        <div className="mb-6 rounded-lg bg-slate-700/50 p-4 border border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-600">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">@{currentUser.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${getRoleBadgeColor(currentUser.role)} px-2 py-1 rounded text-xs font-semibold text-white`}>
              {currentUser.role === "DataEntry" ? "Data Entry" : currentUser.role}
            </span>
            <span className="text-xs text-green-400">● Online</span>
          </div>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => setActiveMenu(item.id)}
              className={`w-full rounded-lg px-4 py-3 text-left font-medium transition duration-200 flex items-center gap-3 ${
                activeMenu === item.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-700 pt-4 space-y-3">
        <button
          onClick={onLogout}
          className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30"
        >
          🚪 Logout
        </button>
        <p className="text-xs text-slate-400 text-center">© 2026 Event Management</p>
      </div>
    </aside>
  );
}

export default Sidebar;
