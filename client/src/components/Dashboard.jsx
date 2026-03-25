function Dashboard({ dashboardStats, onPrintReport }) {
  return (
    <div>
      <div className="mb-8 print:mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:block">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600 print:text-slate-700 text-sm">
              Real-time event insights and ticket management
            </p>
          </div>

          <button
            onClick={onPrintReport}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-blue-600/30 print:hidden"
          >
            📄 Print Report
          </button>
        </div>
      </div>

      {/* Primary Metrics - Modern Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5 print:grid-cols-5">
        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Attendees</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {dashboardStats.totalAttendees}
              </h3>
            </div>
            <div className="text-4xl opacity-20 group-hover:opacity-40 transition">👥</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Checked In</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-700">
                {dashboardStats.checkedInCount}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">✓</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Entry</p>
              <h3 className="mt-3 text-3xl font-bold text-amber-700">
                {dashboardStats.pendingCount}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">⏳</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ticket Amount</p>
              <h3 className="mt-3 text-3xl font-bold text-blue-700">
                ₹ {dashboardStats.totalTicketAmount || 0}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">💳</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-purple-200 bg-gradient-to-br from-white to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Cover Amount</p>
              <h3 className="mt-3 text-3xl font-bold text-purple-700">
                ₹ {dashboardStats.totalCoverAmount || 0}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">🎫</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded"></div>
        </div>
      </div>

      {/* WhatsApp & Check-in Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-green-200 bg-gradient-to-br from-white to-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">WhatsApp Sent</p>
              <h3 className="mt-3 text-3xl font-bold text-green-700">
                {dashboardStats.whatsappSentCount || 0}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">📱</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-red-200 bg-gradient-to-br from-white to-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">WhatsApp Failed</p>
              <h3 className="mt-3 text-3xl font-bold text-red-700">
                {dashboardStats.whatsappFailedCount || 0}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">❌</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-orange-200 bg-gradient-to-br from-white to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Duplicate Scans</p>
              <h3 className="mt-3 text-3xl font-bold text-orange-700">
                {dashboardStats.duplicateScanCount || 0}
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">⚠️</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
        </div>

        <div className="group rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Check-in Rate</p>
              <h3 className="mt-3 text-3xl font-bold text-indigo-700">
                {dashboardStats.totalAttendees > 0
                  ? Math.round(
                      (dashboardStats.checkedInCount / dashboardStats.totalAttendees) *
                        100
                    )
                  : 0}
                %
              </h3>
            </div>
            <div className="text-4xl opacity-30 group-hover:opacity-50 transition">📊</div>
          </div>
          <div className="mt-4 h-1 w-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded"></div>
        </div>
      </div>

      {/* Category Distribution */}
      {dashboardStats.categoryWiseCount &&
        dashboardStats.categoryWiseCount.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
            <h4 className="mb-4 text-lg font-semibold text-slate-800">
              Registration by Category
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {dashboardStats.categoryWiseCount.map((cat, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-50 p-4 border-l-4 border-blue-500"
                >
                  <p className="text-sm text-slate-600">{cat.categoryName}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {cat.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

export default Dashboard;
