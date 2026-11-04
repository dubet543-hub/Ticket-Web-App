import { useMemo, useState } from "react";
import { downloadReportExcel } from "../utils/reportExcel";
import { registeredBy, scannedBy } from "../utils/staffLabel";

// Delivery status reported by Meta for the last ticket sent
const WHATSAPP_STATUS = {
  // New members start as "pending" until a ticket is actually sent
  pending: { label: "Not sent", color: "#64748b" },
  sent: { label: "Sent", color: "#2563eb" },
  delivered: { label: "Delivered", color: "#059669" },
  read: { label: "Read", color: "#047857" },
  failed: { label: "Failed", color: "#dc2626" },
};

// A ticket counts as sent once Meta accepted it (sent/delivered/read) or tried and failed
const ticketWasSent = (item) => ["sent", "delivered", "read", "failed"].includes(item.whatsappStatus);

function ReportView({
  type,
  attendees = [],
  facilities = [],
  users = [],
  onPrintReport,
  onSendWhatsApp,
  onEditAttendee,
  onDeleteAttendee,
}) {
  const [searchFacility, setSearchFacility] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  // Name / mobile number search filters as you type (no Submit needed)
  const [searchText, setSearchText] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    searchFacility: "",
    salesPerson: "",
    fromDate: "",
    toDate: "",
  });

  const filteredAttendees = useMemo(() => {
    const { searchFacility: selectedFacility, salesPerson: selectedSalesPerson, fromDate: selectedFromDate, toDate: selectedToDate } = appliedFilters;

    return attendees.filter((item) => {
      const matchesFacility =
        type !== "facility" ||
        !selectedFacility ||
        (Array.isArray(item.checkInHistory)
          ? item.checkInHistory.some((entry) => {
              const facilityId = entry?.facility?._id || entry?.facility;
              return String(facilityId || "") === String(selectedFacility);
            })
          : false);

      let matchesSalesPerson = true;
      if (type === "registration" && selectedSalesPerson) {
        const createdById = item.createdBy?._id || item.createdBy;
        matchesSalesPerson = String(createdById || "") === String(selectedSalesPerson);
      }

      const referenceDate = item.createdAt || item.checkedInAt;
      const createdAt = referenceDate ? new Date(referenceDate) : null;
      const fromOk = !selectedFromDate || (createdAt && createdAt >= new Date(`${selectedFromDate}T00:00:00`));
      const toOk = !selectedToDate || (createdAt && createdAt <= new Date(`${selectedToDate}T23:59:59.999`));

      const query = searchText.trim().toLowerCase();
      const queryDigits = query.replace(/\D/g, "");
      const matchesSearch =
        !query ||
        String(item.name || "").toLowerCase().includes(query) ||
        (queryDigits.length > 0 && String(item.mobile || "").replace(/\D/g, "").includes(queryDigits));

      return matchesFacility && matchesSalesPerson && fromOk && toOk && matchesSearch;
    });
  }, [attendees, type, appliedFilters, searchText]);

  const reportTitle =
    type === "facility"
      ? "Facility Collect Report"
      : type === "registration"
      ? "Registration Report"
      : "Member Report";

  const reportCategory =
    type === "facility"
      ? "Facility Report"
      : type === "registration"
      ? "Registration Report"
      : "Member Report";

  const resetFilters = () => {
    setSearchText("");
    setSearchFacility("");
    setSalesPerson("");
    setFromDate("");
    setToDate("");
    setAppliedFilters({
      searchFacility: "",
      salesPerson: "",
      fromDate: "",
      toDate: "",
    });
  };

  const submitFilters = () => {
    setAppliedFilters({
      searchFacility,
      salesPerson,
      fromDate,
      toDate,
    });
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  const hasMemberActions = Boolean(onSendWhatsApp || onEditAttendee || onDeleteAttendee);

  const [excelLoading, setExcelLoading] = useState(false);
  const handleDownloadExcel = async () => {
    try {
      setExcelLoading(true);
      await downloadReportExcel(type, filteredAttendees, facilities);
    } catch (error) {
      console.error("Excel download:", error);
      alert("Could not create the Excel file. Please try again.");
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          .report-print-area,
          .report-print-area * {
            visibility: visible !important;
          }

          .report-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #fff !important;
          }

          .report-print-area .overflow-x-auto {
            overflow: visible !important;
          }

          .report-print-hide {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-5">
      <div className="report-print-hide rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-bold text-slate-900">Search Here</h3>

        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name or mobile number"
            className="form-input"
            autoComplete="off"
          />
          {searchText && (
            <p style={{ marginTop: "6px", fontSize: "13px", color: "#475569" }}>
              {filteredAttendees.length} {filteredAttendees.length === 1 ? "match" : "matches"} for “{searchText.trim()}”
            </p>
          )}
        </div>

        {type === "facility" && (
          <div className="space-y-3">
            <select
              value={searchFacility}
              onChange={(e) => setSearchFacility(e.target.value)}
              className="form-input"
            >
              <option value="">Select Facility Name</option>
              {facilities.map((facility) => (
                <option key={facility._id} value={facility._id}>
                  {facility.facilityName}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="form-input"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {type === "registration" && (
          <div className="space-y-3">
            <select
              value={salesPerson}
              onChange={(e) => setSalesPerson(e.target.value)}
              className="form-input"
            >
              <option value="">Select Sales Person</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="form-input"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        )}

        {type === "member" && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-input"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-input"
            />
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button type="button" className="btn-primary btn-sm" onClick={submitFilters}>
            Submit
          </button>
          <button type="button" className="btn-secondary btn-sm" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      <div className="report-print-area rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="report-print-hide" style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "8px" }}>
          <button
            type="button"
            className="btn-success btn-sm"
            onClick={handleDownloadExcel}
            disabled={excelLoading || filteredAttendees.length === 0}
            title={filteredAttendees.length ? "Download the rows shown below as an Excel file" : "No rows to download"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {excelLoading ? "Preparing…" : "Download Excel"}
          </button>
          <button type="button" className="btn-primary btn-sm" onClick={onPrintReport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Report
          </button>
        </div>
        <h3 className="text-center text-2xl font-semibold text-slate-900">{reportTitle}</h3>
        <p className="mt-2 text-center text-sm text-slate-600">CENTRE POINT HOTELS & RESORTS</p>

        <div className="mt-5 text-sm text-slate-700">
          <p>Event Name : Dhamaaka – The Karan Johar Edition</p>
          <p>Event Date : 7 Nov, 2026 · 08:30 PM onwards</p>
          <p>Venue : Hotel Centre Point, Nagpur</p>
          <p>Report Date : {new Date().toLocaleDateString()}</p>
          <p>Report Category : {reportCategory}</p>
        </div>

        {type === "facility" && (
          <div className="mt-5 overflow-x-auto rounded border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Reg No</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Notes</th>
                  <th>Label</th>
                  <th>Date</th>
                  <th>Scanned By</th>
                  <th>Sign</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-500">No report data found.</td>
                  </tr>
                ) : (
                  filteredAttendees.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.registrationNo || "-"}</td>
                      <td>{item.category?.categoryName || "-"}</td>
                      <td>{item.name?.toUpperCase() || "-"}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{formatDateTime(item.checkedInAt)}</td>
                      <td>{scannedBy(item)}</td>
                      <td>-</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {type === "registration" && (
          <div className="mt-5 overflow-x-auto rounded border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Ticket Amount</th>
                  <th>Cover Amount</th>
                  <th>Mobile</th>
                  <th>Entry By</th>
                  <th>Date</th>
                  {onDeleteAttendee && <th className="report-print-hide">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={onDeleteAttendee ? 10 : 9} className="py-6 text-center text-slate-500">No report data found.</td>
                  </tr>
                ) : (
                  filteredAttendees.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.registrationNo || "-"}</td>
                      <td>{item.name?.toUpperCase() || "-"}</td>
                      <td>{item.category?.categoryName || "-"}</td>
                      <td>{item.amount || 0}</td>
                      <td>{item.coverAmount || 0}</td>
                      <td>{item.mobile || "-"}</td>
                      <td>{registeredBy(item)}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      {onDeleteAttendee && (
                        <td className="report-print-hide">
                          <button type="button" className="btn-danger btn-sm" onClick={() => onDeleteAttendee(item._id, item.name)}>
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {type === "member" && (
          <div className="mt-5 overflow-x-auto rounded border border-slate-200">
            <table className="w-full">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Mobile</th>
                  <th>Date</th>
                  <th>Last Updated</th>
                  <th>Registered By</th>
                  <th>Scanned By</th>
                  <th>WhatsApp</th>
                  {hasMemberActions && <th className="report-print-hide">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={hasMemberActions ? 11 : 10} className="py-6 text-center text-slate-500">No report data found.</td>
                  </tr>
                ) : (
                  filteredAttendees.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.registrationNo || "-"}</td>
                      <td>{item.name?.toUpperCase() || "-"}</td>
                      <td>{item.category?.categoryName || "-"}</td>
                      <td>{item.mobile || "-"}</td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>{formatDateTime(item.updatedAt)}</td>
                      <td>{registeredBy(item)}</td>
                      <td>{scannedBy(item)}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: WHATSAPP_STATUS[item.whatsappStatus]?.color || "#64748b" }}>
                          {WHATSAPP_STATUS[item.whatsappStatus]?.label || "Not sent"}
                        </span>
                        {item.whatsappStatus === "failed" && item.whatsappError && (
                          <div style={{ fontSize: "11.5px", color: "#b91c1c", maxWidth: "260px", marginTop: "2px" }}>
                            {item.whatsappError}
                          </div>
                        )}
                      </td>
                      {hasMemberActions && (
                        <td className="report-print-hide">
                          <div className="flex flex-wrap gap-1.5">
                            {onEditAttendee && (
                              <button type="button" className="btn-secondary btn-sm" onClick={() => onEditAttendee(item)}>
                                Edit
                              </button>
                            )}
                            {onSendWhatsApp && (
                              <button
                                type="button"
                                className="btn-success btn-sm"
                                onClick={() => onSendWhatsApp(item)}
                                disabled={!item.mobile}
                                title={item.mobile ? `Send ticket to ${item.mobile}` : "No mobile number"}
                              >
                                {ticketWasSent(item) ? "Resend Ticket" : "Send Ticket"}
                              </button>
                            )}
                            {onDeleteAttendee && (
                              <button type="button" className="btn-danger btn-sm" onClick={() => onDeleteAttendee(item._id, item.name)}>
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <button type="button" className="report-print-hide btn-primary mt-5 w-full justify-center" onClick={onPrintReport}>
          Print Report
        </button>
      </div>
    </div>
    </>
  );
}

export default ReportView;
