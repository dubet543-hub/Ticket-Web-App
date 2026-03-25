import { useMemo, useState } from "react";

function FacilityForm({
  facilityForm,
  facilities = [],
  facilityLoading,
  onFormChange,
  onSubmit,
  onReset,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) =>
      item.facilityName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [facilities, searchTerm]);

  const visibleFacilities = filteredFacilities.slice(0, pageSize);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">Add Facility</h3>
          <p className="mt-1 text-xs text-slate-500">Home / Master / Add Facility</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Facility Name</label>
            <input
              type="text"
              name="facilityName"
              value={facilityForm.facilityName}
              onChange={onFormChange}
              placeholder="Enter facility name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              value={facilityForm.description}
              onChange={onFormChange}
              placeholder="Describe the facility"
              rows="3"
              className="form-input"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="submit"
              disabled={facilityLoading}
              className="btn-primary min-w-28 justify-center"
            >
              {facilityLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="btn-secondary min-w-28 justify-center"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            entries per page
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full max-w-48 rounded border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="w-full">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Facility Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {visibleFacilities.length > 0 ? (
                visibleFacilities.map((item, index) => (
                  <tr key={item._id || `${item.facilityName}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.facilityName}</td>
                    <td>{item.description || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-sm text-slate-500">
                    No facilities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Showing 1 to {visibleFacilities.length} of {filteredFacilities.length} entries
        </p>
      </div>
    </div>
  );
}

export default FacilityForm;
