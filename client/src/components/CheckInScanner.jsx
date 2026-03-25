function CheckInScanner({ 
  checkInForm, 
  checkInLoading, 
  checkInResult, 
  scanInputRef, 
  onFormChange, 
  onSubmit,
  facilities = []
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md print:hidden">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Scan Tickets for Entry</h3>
        <p className="mt-1 text-xs text-slate-600">
          Select facility and scan QR code or registration number
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="form-group">
            <label className="form-label">Facility</label>
            <select
              name="facility"
              value={checkInForm.facility || ""}
              onChange={onFormChange}
              className="form-input"
            >
              <option value="">All Gates</option>
              {facilities.map((facility) => (
                <option key={facility._id} value={facility._id}>
                  {facility.facilityName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 form-group">
            <label className="form-label">Scan or Enter Code</label>
            <input
              ref={scanInputRef}
              type="text"
              name="scanValue"
              value={checkInForm.scanValue}
              onChange={onFormChange}
              placeholder="Scan QR / Enter Reg. No."
              autoComplete="off"
              className="form-input"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={checkInLoading}
              className="btn-success w-full justify-center"
            >
              {checkInLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Checking...</span>
                </>
              ) : (
                <span>Check In</span>
              )}
            </button>
          </div>
        </div>
      </form>

      {checkInResult && (
        <div
          className={`mt-6 rounded-lg border p-4 ${
            checkInResult.type === "success"
              ? "alert alert-success"
              : "alert alert-danger"
          }`}
        >
          <h4 className="font-bold text-base">
            {checkInResult.message}
          </h4>

          {checkInResult.attendee && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Registration No</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {checkInResult.attendee.registrationNo}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Name</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {checkInResult.attendee.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Mobile</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {checkInResult.attendee.mobile}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Category</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {checkInResult.attendee.category?.categoryName || "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckInScanner;
