import { useState } from "react";

function MemberList({
  members,
  onEdit,
  onDelete,
  onResendWhatsApp,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  // Filter members based on search and filter
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile.includes(searchTerm) ||
      member.registrationNo.includes(searchTerm);

    const matchesFilter =
      filterBy === "all" ||
      (filterBy === "checked-in" && member.isCheckedIn) ||
      (filterBy === "pending" && !member.isCheckedIn) ||
      (filterBy === "whatsapp-sent" && member.whatsappSent) ||
      (filterBy === "whatsapp-not-sent" && !member.whatsappSent);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <span className="text-lg">📄</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Attendee Directory
        </h3>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              🔍 Search Member
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, mobile, or registration #"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              🔎 Filter by Status
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="all">All Members ({members.length})</option>
              <option value="checked-in">✓ Checked In</option>
              <option value="pending">⏳ Pending Entry</option>
              <option value="whatsapp-sent">📱 WhatsApp Sent</option>
              <option value="whatsapp-not-sent">❌ WhatsApp Not Sent</option>
            </select>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
          🔍 Showing <strong>{filteredMembers.length}</strong> of <strong>{members.length}</strong> members
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50">
              <th className="px-4 py-4 text-left text-sm font-bold text-slate-900">Reg #</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-slate-900">Name</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-slate-900">Mobile</th>
              <th className="px-4 py-4 text-left text-sm font-bold text-slate-900">Category</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-slate-900">Check-In</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-slate-900">WhatsApp</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member._id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {member.registrationNo}
                  </td>
                  <td className="px-4 py-4 text-slate-900">{member.name}</td>
                  <td className="px-4 py-4 text-slate-700">{member.mobile}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {member.category?.categoryName || "-"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        member.isCheckedIn
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {member.isCheckedIn ? "✓ Checked" : "⏳ Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        member.whatsappSent
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.whatsappSent ? "✓ Sent" : "◯ Not Sent"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => onEdit(member)}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition duration-200 flex items-center gap-1"
                        title="Edit member details"
                      >
                        ✎ Edit
                      </button>
                      <button
                        onClick={() => onResendWhatsApp(member)}
                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 transition duration-200 flex items-center gap-1"
                        title="Resend WhatsApp message"
                      >
                        📱 Resend
                      </button>
                      <button
                        onClick={() => onDelete(member._id, member.name)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition duration-200 flex items-center gap-1"
                        title="Delete member"
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">📭</span>
                    <span className="font-medium">No members found</span>
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

export default MemberList;
