function AttendeeForm({
  attendeeForm,
  attendeeLoading,
  editingAttendeeId,
  categories,
  onFormChange,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <span className="text-lg">👤</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {editingAttendeeId ? "Edit Attendee" : "Register Attendee"}
          </h3>
        </div>

        {editingAttendeeId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
          >
            ✕ Cancel
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={attendeeForm.name}
            onChange={onFormChange}
            placeholder="Full name"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={attendeeForm.email}
            onChange={onFormChange}
            placeholder="example@email.com"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Mobile Number * (WhatsApp)
          </label>
          <input
            type="text"
            name="mobile"
            value={attendeeForm.mobile}
            onChange={onFormChange}
            placeholder="10-digit mobile number"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Gender
            </label>
            <select
              name="gender"
              value={attendeeForm.gender}
              onChange={onFormChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={attendeeForm.age}
              onChange={onFormChange}
              placeholder="Age"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Ticket Category *
          </label>
          <select
            name="category"
            value={attendeeForm.category}
            onChange={onFormChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">Select category</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="sendWhatsApp"
              checked={attendeeForm.sendWhatsApp || false}
              onChange={(e) =>
                onFormChange({
                  target: { name: "sendWhatsApp", value: e.target.checked },
                })
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              Send Ticket on WhatsApp
            </span>
          </label>
          <p className="mt-2 text-xs text-slate-600">
            Ticket and QR code will be sent to the mobile number via WhatsApp
          </p>
        </div>

        <button
          type="submit"
          disabled={attendeeLoading}
          className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {attendeeLoading
            ? editingAttendeeId
              ? "Updating..."
              : "Saving..."
            : editingAttendeeId
            ? "Update Attendee"
            : "Save Attendee"}
        </button>
      </form>
    </div>
  );
}

export default AttendeeForm;
