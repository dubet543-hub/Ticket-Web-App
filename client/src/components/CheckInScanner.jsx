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
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg print:hidden">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
          <span className="text-lg">✓</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Scan Tickets for Entry
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Select facility, scan QR code or registration number. One-time verified entry.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              📍 Facility
            </label>
            <select
              name="facility"
              value={checkInForm.facility || ""}
              onChange={onFormChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="">All Gates</option>
              {facilities.map((facility) => (
                <option key={facility._id} value={facility._id}>
                  {facility.facilityName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              🔍 Scan or Enter Code
            </label>
            <input
              ref={scanInputRef}
              type="text"
              name="scanValue"
              value={checkInForm.scanValue}
              onChange={onFormChange}
              placeholder="Scan QR / Enter Reg. No."
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={checkInLoading}
              className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-green-600/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
            >
              {checkInLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </span>
              ) : (
                "✓ Check In"
              )}
            </button>
          </div>
        </div>
      </form>

      {checkInResult && (
        <div
          className={`mt-6 rounded-2xl border p-5 ${
            checkInResult.type === "success"
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <h4
            className={`text-lg font-bold ${
              checkInResult.type === "success"
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {checkInResult.message}
          </h4>

          {checkInResult.attendee && (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-500">Registration No</p>
                <p className="font-semibold text-slate-800">
                  {checkInResult.attendee.registrationNo}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-semibold text-slate-800">
                  {checkInResult.attendee.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Mobile</p>
                <p className="font-semibold text-slate-800">
                  {checkInResult.attendee.mobile}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Category</p>
                <p className="font-semibold text-slate-800">
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
