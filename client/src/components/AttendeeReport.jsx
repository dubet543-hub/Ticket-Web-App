function AttendeeReport({
  attendees,
  dashboardStats,
  onPrintReport,
  onEditAttendee,
  onDeleteAttendee,
  onSendWhatsApp,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Attendee Report
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Printable overall attendee and check-in summary
          </p>
        </div>

        <button
          onClick={onPrintReport}
          className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 print:hidden"
        >
          Print
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-slate-800">
            {dashboardStats.totalAttendees}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-emerald-700">Checked In</p>
          <p className="text-2xl font-bold text-emerald-700">
            {dashboardStats.checkedInCount}
          </p>
        </div>

        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-2xl font-bold text-amber-700">
            {dashboardStats.pendingCount}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-blue-700">Ticket Amount</p>
          <p className="text-2xl font-bold text-blue-700">
            ₹ {dashboardStats.totalTicketAmount}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <p className="text-sm text-purple-700">Cover Amount</p>
          <p className="text-2xl font-bold text-purple-700">
            ₹ {dashboardStats.totalCoverAmount}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="rounded-l-xl px-4 py-3 text-sm font-semibold text-slate-700">
                Reg No
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Mobile
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Category
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Amount
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700 print:hidden">
                Edit
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700 print:hidden">
                Delete
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-slate-700 print:hidden">
                WhatsApp
              </th>
              <th className="rounded-r-xl px-4 py-3 text-sm font-semibold text-slate-700">
                Checked In At
              </th>
            </tr>
          </thead>

          <tbody>
            {attendees.length > 0 ? (
              attendees.map((item) => (
                <tr key={item._id} className="border-b border-slate-200">
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {item.registrationNo}
                  </td>
                  <td className="px-4 py-4">{item.name}</td>
                  <td className="px-4 py-4">{item.mobile}</td>
                  <td className="px-4 py-4">
                    {item.category?.categoryName || "-"}
                  </td>
                  <td className="px-4 py-4">₹ {item.amount || 0}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.isCheckedIn
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.isCheckedIn ? "Checked In" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4 print:hidden">
                    <button
                      onClick={() => onEditAttendee(item)}
                      className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-4 py-4 print:hidden">
                    <button
                      onClick={() =>
                        onDeleteAttendee(item._id, item.name)
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-4 py-4 print:hidden">
                    <button
                      onClick={() => onSendWhatsApp(item)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Send WhatsApp
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    {item.checkedInAt
                      ? new Date(item.checkedInAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No attendees found
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
