function CategoryForm({ categoryForm, categoryLoading, onFormChange, onSubmit }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <span className="text-lg">🏷️</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Add Ticket Category
        </h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Name *
          </label>
          <input
            type="text"
            name="categoryName"
            value={categoryForm.categoryName}
            onChange={onFormChange}
            placeholder="e.g., VIP, General, Standard"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Ticket Price (₹) *
          </label>
          <input
            type="number"
            name="price"
            value={categoryForm.price}
            onChange={onFormChange}
            placeholder="e.g., 500"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Cover Price (₹) *
          </label>
          <input
            type="number"
            name="coverPrice"
            value={categoryForm.coverPrice}
            onChange={onFormChange}
            placeholder="e.g., 0"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <button
          type="submit"
          disabled={categoryLoading}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
        >
          {categoryLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Saving...
            </span>
          ) : (
            "💾 Save Category"
          )}
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
