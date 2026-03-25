function FacilityForm({ facilityForm, facilityLoading, onFormChange, onSubmit }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
          <span className="text-lg">🏢</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Add Facility/Venue
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Facility Name
          </label>
          <input
            type="text"
            name="facilityName"
            value={facilityForm.facilityName}
            onChange={onFormChange}
            placeholder="e.g., Check In, VIP Entry, Lounge, etc."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={facilityForm.description}
            onChange={onFormChange}
            placeholder="Describe the facility"
            rows="3"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={facilityLoading}
          className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
        >
          {facilityLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Saving...
            </span>
          ) : (
            "🏢 Save Facility"
          )}
        </button>
      </form>
    </div>
  );
}

export default FacilityForm;
