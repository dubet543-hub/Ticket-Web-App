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
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">
          {editingAttendeeId ? "Edit Attendee" : "Register Attendee"}
        </h3>

        {editingAttendeeId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-secondary btn-sm"
          >
            <span>Cancel</span>
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="form-group">
          <label className="form-label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={attendeeForm.name}
            onChange={onFormChange}
            placeholder="Full name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={attendeeForm.email}
            onChange={onFormChange}
            placeholder="example@email.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Mobile Number <span className="required">*</span> (WhatsApp)
          </label>
          <input
            type="text"
            name="mobile"
            value={attendeeForm.mobile}
            onChange={onFormChange}
            placeholder="10-digit mobile number"
            className="form-input"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={attendeeForm.gender}
              onChange={onFormChange}
              className="form-input"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="age"
              value={attendeeForm.age}
              onChange={onFormChange}
              placeholder="Age"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Ticket Category <span className="required">*</span>
          </label>
          <select
            name="category"
            value={attendeeForm.category}
            onChange={onFormChange}
            className="form-input"
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

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
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
          className="btn-success w-full justify-center"
        >
          {attendeeLoading ? (
            <>
              <span className="spinner"></span>
              <span>{editingAttendeeId ? "Updating..." : "Saving..."}</span>
            </>
          ) : (
            <span>{editingAttendeeId ? "Update Attendee" : "Save Attendee"}</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default AttendeeForm;
