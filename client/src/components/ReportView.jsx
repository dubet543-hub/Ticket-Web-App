import { useMemo, useState } from "react";

function ReportView({
  type,
  attendees = [],
  facilities = [],
  users = [],
  onPrintReport,
}) {
  const [searchFacility, setSearchFacility] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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

      return matchesFacility && matchesSalesPerson && fromOk && toOk;
    });
  }, [attendees, type, appliedFilters]);

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
        <h3 className="text-center text-2xl font-semibold text-slate-900">{reportTitle}</h3>
        <p className="mt-2 text-center text-sm text-slate-600">CENTRE POINT HOTELS & RESORTS</p>

        <div className="mt-5 text-sm text-slate-700">
          <p>Event Name : New Year Celebration</p>
          <p>Event Date : 31 Dec, 2023</p>
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
                  <th>Entry By</th>
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
                      <td>{item.name || "-"}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>{formatDate(item.checkedInAt)}</td>
                      <td>{item.checkedInBy || "Centre Point Hotel"}</td>
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
                  <th>Gender</th>
                  <th>Entry By</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-6 text-center text-slate-500">No report data found.</td>
                  </tr>
                ) : (
                  filteredAttendees.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.registrationNo || "-"}</td>
                      <td>{item.name || "-"}</td>
                      <td>{item.category?.categoryName || "-"}</td>
                      <td>{item.amount || 0}</td>
                      <td>{item.category?.coverPrice || 0}</td>
                      <td>{item.mobile || "-"}</td>
                      <td>{item.gender || "-"}</td>
                      <td>{item.createdBy?.name || "Centre Point Hotel"}</td>
                      <td>{formatDate(item.createdAt)}</td>
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
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-slate-500">No report data found.</td>
                  </tr>
                ) : (
                  filteredAttendees.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.registrationNo || "-"}</td>
                      <td>{item.name || "-"}</td>
                      <td>{item.category?.categoryName || "-"}</td>
                      <td>{item.email || "-"}</td>
                      <td>{item.mobile || "-"}</td>
                      <td>{item.gender || "-"}</td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <button type="button" className="report-print-hide btn-primary mt-5 w-full justify-center" onClick={onPrintReport}>
          Print
        </button>
      </div>
    </div>
    </>
  );
}

export default ReportView;
