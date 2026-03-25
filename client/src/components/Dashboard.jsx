function Dashboard({ dashboardStats, onPrintReport }) {
  const checkInRate =
    dashboardStats.totalAttendees > 0
      ? Math.round((dashboardStats.checkedInCount / dashboardStats.totalAttendees) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="rounded-2xl border border-[#d3e2ef] bg-white/85 px-6 py-6 shadow-sm print:mb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:block">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live Operations</p>
            <h1 className="text-3xl font-bold text-slate-900">Event Pulse Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Real-time ticketing, check-in, and communication metrics.</p>
          </div>
          <button
            onClick={onPrintReport}
            className="btn-primary print:hidden"
          >
            <span>Print Report</span>
          </button>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Check-In Progress</span>
            <span>{checkInRate}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-linear-to-r from-[#1a8f84] to-[#24a79c]"
              style={{ width: `${checkInRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Primary Metrics - Modern Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5 print:grid-cols-5">
        {/* Total Attendees */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Attendees</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{dashboardStats.totalAttendees}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d8f3ef] text-xs font-bold text-[#0f6c63]">AT</div>
          </div>
          <div className="mt-3 h-1 w-8 rounded bg-[#1a8f84]"></div>
        </div>

        {/* Checked In */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Checked In</p>
              <h3 className="mt-2 text-2xl font-bold text-emerald-700">{dashboardStats.checkedInCount}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">IN</div>
          </div>
          <div className="mt-3 h-1 w-8 bg-emerald-600 rounded"></div>
        </div>

        {/* Pending Entry */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending Entry</p>
              <h3 className="mt-2 text-2xl font-bold text-amber-700">{dashboardStats.pendingCount}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">PD</div>
          </div>
          <div className="mt-3 h-1 w-8 bg-amber-600 rounded"></div>
        </div>

        {/* Ticket Amount */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ticket Amount</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">₹{dashboardStats.totalTicketAmount || 0}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">TK</div>
          </div>
          <div className="mt-3 h-1 w-8 rounded bg-[#1a8f84]"></div>
        </div>

        {/* Cover Amount */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Cover Amount</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">₹{dashboardStats.totalCoverAmount || 0}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">CV</div>
          </div>
          <div className="mt-3 h-1 w-8 bg-slate-600 rounded"></div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* WhatsApp Sent */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">WhatsApp Sent</p>
              <h3 className="mt-2 text-2xl font-bold text-emerald-700">{dashboardStats.whatsappSentCount || 0}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">WS</div>
          </div>
          <div className="mt-3 h-1 w-8 bg-emerald-600 rounded"></div>
        </div>

        {/* WhatsApp Failed */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">WhatsApp Failed</p>
              <h3 className="mt-2 text-2xl font-bold text-red-700">{dashboardStats.whatsappFailedCount || 0}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-700">WF</div>
          </div>
          <div className="mt-3 h-1 w-8 bg-red-600 rounded"></div>
        </div>

        {/* Duplicate Scans */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Duplicate Scans</p>
              <h3 className="mt-2 text-2xl font-bold text-amber-700">{dashboardStats.duplicateScanCount || 0}</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">DS</div>
          </div>
          <div className="mt-3 h-1 w-8 bg-amber-600 rounded"></div>
        </div>

        {/* Check-in Rate */}
        <div className="rounded-xl border border-[#d5e3f0] bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Check-in Rate</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{checkInRate}%</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">CR</div>
          </div>
          <div className="mt-3 h-1 w-8 rounded bg-[#1a8f84]"></div>
        </div>
      </div>

      {/* Category Distribution */}
      {dashboardStats.categoryWiseCount && dashboardStats.categoryWiseCount.length > 0 && (
        <div className="rounded-xl border border-[#d3e2ef] bg-white/85 p-6 shadow-sm print:hidden">
          <h4 className="mb-4 text-lg font-semibold text-slate-900">Registration by Category</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {dashboardStats.categoryWiseCount.map((cat, idx) => (
              <div key={idx} className="rounded-lg border border-[#d9e7f4] bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">{cat.categoryName}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
