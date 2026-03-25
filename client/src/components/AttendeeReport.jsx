function AttendeeReport({
  attendees,
  dashboardStats,
  onPrintReport,
  onEditAttendee,
  onDeleteAttendee,
  onSendWhatsApp,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Attendee Report</h3>
          <p className="mt-1 text-sm text-slate-600">Comprehensive attendee and check-in summary</p>
        </div>

        <button
          onClick={onPrintReport}
          className="btn-primary print:hidden"
        >
          Print
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Total</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {dashboardStats.totalAttendees}
          </p>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Checked In</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {dashboardStats.checkedInCount}
          </p>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {dashboardStats.pendingCount}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Ticket Amt</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            ₹{dashboardStats.totalTicketAmount}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-700 uppercase tracking-wide">Cover Amt</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            ₹{dashboardStats.totalCoverAmount}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{textAlign: 'center'}} className="print:hidden">Actions</th>
              <th>Checked In</th>
            </tr>
          </thead>

          <tbody>
            {attendees.length > 0 ? (
              attendees.map((item) => (
                <tr key={item._id}>
                  <td style={{fontWeight: '600'}}>{item.registrationNo}</td>
                  <td>{item.name}</td>
                  <td>{item.mobile}</td>
                  <td>{item.category?.categoryName || "-"}</td>
                  <td style={{fontWeight: '500'}}>₹{item.amount || 0}</td>
                  <td>
                    <span className={`badge ${
                        item.isCheckedIn
                          ? "badge-success"
                          : "badge-warning"
                      }`}>
                      {item.isCheckedIn ? "Checked In" : "Pending"}
                    </span>
                  </td>
                  <td style={{textAlign: 'center'}} className="print:hidden">
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      <button
                        onClick={() => onEditAttendee(item)}
                        className="btn-warning btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteAttendee(item._id, item.name)}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => onSendWhatsApp(item)}
                        className="btn-success btn-sm"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </td>
                  <td className="text-sm">
                    {item.checkedInAt
                      ? new Date(item.checkedInAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>
                  <div className="empty-state">
                    <div className="empty-state-title">No attendees found</div>
                    <p className="empty-state-text">Start by registering attendees or check your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendeeReport;
