import { useState } from "react";

function MemberList({
  members,
  onEdit,
  onDelete,
  canTestQr = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [selectedMember, setSelectedMember] = useState(null);

  const handlePrintTicketPdf = () => {
    if (!selectedMember?.qrCode) {
      alert("QR code not available for this attendee");
      return;
    }

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      alert("Popup blocked. Please allow popups and try again.");
      return;
    }

    win.document.write(`
      <html>
        <head>
          <title>${selectedMember.name} - Ticket QR</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .card { max-width: 420px; border: 1px solid #d5dde8; border-radius: 12px; padding: 20px; }
            .title { font-size: 22px; font-weight: 700; margin: 0 0 8px; }
            .line { margin: 4px 0; color: #334155; }
            .qr { margin-top: 16px; width: 250px; height: 250px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 class="title">Test Ticket QR</h1>
            <p class="line"><strong>Name:</strong> ${selectedMember.name || "-"}</p>
            <p class="line"><strong>Registration No:</strong> ${selectedMember.registrationNo || "-"}</p>
            <p class="line"><strong>Mobile:</strong> ${selectedMember.mobile || "-"}</p>
            <img class="qr" src="${selectedMember.qrCode}" alt="QR Code" />
          </div>
          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  // Filter members based on search and filter
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.mobile.includes(searchTerm) ||
      member.registrationNo.includes(searchTerm);

    return matchesSearch;
  });

  const paginatedMembers = filteredMembers.slice(0, pageSize);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="text-xs font-medium text-slate-600">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="mr-2 rounded border border-slate-300 px-2 py-1 text-xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          entries per Page
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full max-w-48 rounded border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th>SN</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Gender</th>
              <th>Date</th>
              <th style={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member, index) => (
                <tr key={member._id}>
                  <td style={{fontWeight: "600"}}>{index + 1}</td>
                  <td>{member.registrationNo || "-"}</td>
                  <td>{member.name}</td>
                  <td>{member.category?.categoryName || "-"}</td>
                  <td>{member.email || "-"}</td>
                  <td>{member.mobile}</td>
                  <td>{member.gender || "-"}</td>
                  <td>{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "-"}</td>
                  <td style={{ textAlign: "center" }}>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      <button
                        onClick={() => onEdit(member)}
                        className="btn-primary btn-sm"
                        title="View member"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onDelete(member._id, member.name)}
                        className="btn-danger btn-sm"
                        title="Delete member"
                      >
                        Delete
                      </button>
                      {canTestQr && (
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="btn-secondary btn-sm"
                          title="Test QR"
                        >
                          QR / PDF
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>
                  <div className="empty-state">
                    <div className="empty-state-title">No members found</div>
                    <p className="empty-state-text">Try adjusting your filters or search term</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Showing 1 to {paginatedMembers.length} of {filteredMembers.length} entries
      </p>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">QR Test Preview</h4>
                <p className="text-xs text-slate-600">{selectedMember.name} ({selectedMember.registrationNo || "-"})</p>
              </div>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => setSelectedMember(null)}
              >
                Close
              </button>
            </div>

            {selectedMember.qrCode ? (
              <div className="rounded-lg border border-slate-200 p-4 text-center">
                <img
                  src={selectedMember.qrCode}
                  alt={`QR for ${selectedMember.name}`}
                  className="mx-auto h-64 w-64 rounded border border-slate-200 bg-white p-1"
                />
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                QR code is not available for this attendee.
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={handlePrintTicketPdf}
                disabled={!selectedMember.qrCode}
              >
                Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberList;
