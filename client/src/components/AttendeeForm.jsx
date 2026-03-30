// Modern, compact, and themed AttendeeForm
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
    <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 md:p-6 shadow transition hover:shadow-md max-w-xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
            {editingAttendeeId ? "Edit Member" : "Register Member"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Fill the details below to generate a ticket and QR instantly.
          </p>
        </div>
        {editingAttendeeId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-secondary btn-xs px-3 py-1 rounded-md text-xs"
          >
            Cancel
          </button>
        )}
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="form-group">
            <label className="form-label text-sm font-medium text-slate-700">
              Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={attendeeForm.name}
              onChange={onFormChange}
              placeholder="Full name"
              className="form-input text-sm px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={attendeeForm.email}
              onChange={onFormChange}
              placeholder="example@email.com"
              className="form-input text-sm px-3 py-2 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="form-group">
            <label className="form-label text-sm font-medium text-slate-700">
              Mobile Number <span className="required">*</span> (WhatsApp)
            </label>
            <input
              type="text"
              name="mobile"
              value={attendeeForm.mobile}
              onChange={onFormChange}
              placeholder="10-digit mobile number"
              className="form-input text-sm px-3 py-2 rounded-md"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label text-sm font-medium text-slate-700">
              Ticket Category <span className="required">*</span>
            </label>
            <select
              name="category"
              value={attendeeForm.category}
              onChange={onFormChange}
              className="form-input text-sm px-3 py-2 rounded-md"
              required
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="form-group">
            <label className="form-label text-sm font-medium text-slate-700">Gender</label>
            <select
              name="gender"
              value={attendeeForm.gender}
              onChange={onFormChange}
              className="form-input text-sm px-3 py-2 rounded-md"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label text-sm font-medium text-slate-700">Age</label>
            <input
              type="number"
              name="age"
              value={attendeeForm.age}
              onChange={onFormChange}
              placeholder="Age"
              className="form-input text-sm px-3 py-2 rounded-md"
            />
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex flex-col gap-1">
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
              className="h-4 w-4 rounded border border-blue-300"
            />
            <span className="text-xs font-medium text-slate-700">
              Send Ticket on WhatsApp
            </span>
          </label>
          <p className="text-xs text-slate-600">
            Ticket and QR code will be sent to the mobile number via WhatsApp
          </p>
        </div>
        <button
          type="submit"
          disabled={attendeeLoading}
          className="btn-success w-full justify-center mt-2 text-base font-semibold py-2 rounded-lg shadow-sm transition disabled:opacity-60"
        >
          {attendeeLoading ? (
            <>
              <span className="spinner"></span>
              <span>{editingAttendeeId ? "Updating..." : "Saving..."}</span>
            </>
          ) : (
            <span>{editingAttendeeId ? "Update Member" : "Save Member"}</span>
          )}
        </button>
      </form>
    </div>
  );
}

