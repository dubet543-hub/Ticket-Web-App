import { useMemo, useState } from "react";

function CategoryForm({
  categoryForm,
  categories = [],
  categoryLoading,
  onFormChange,
  onSubmit,
  onReset,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((item) =>
      item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900">Add Category</h3>
          <p className="mt-1 text-xs text-slate-500">Home / Master / Add Category</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">
              Category Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="categoryName"
              value={categoryForm.categoryName}
              onChange={onFormChange}
              placeholder="Enter category name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Ticket Price (₹) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={categoryForm.price}
              onChange={onFormChange}
              placeholder="e.g., 500"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Cover Price (₹) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="coverPrice"
              value={categoryForm.coverPrice}
              onChange={onFormChange}
              placeholder="e.g., 0"
              className="form-input"
              required
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="submit"
              disabled={categoryLoading}
              className="btn-primary min-w-28 justify-center"
            >
              {categoryLoading ? (
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
                <th>Category</th>
                <th>Ticket Price</th>
                <th>Cover Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((item, index) => (
                  <tr key={item._id || `${item.categoryName}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{item.categoryName}</td>
                    <td>₹{item.price ?? 0}</td>
                    <td>₹{item.coverPrice ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-sm text-slate-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-500">Showing {filteredCategories.length} entries</p>
      </div>
    </div>
  );
}

export default CategoryForm;
