function UserManagement({ userForm, userLoading, onFormChange, onSubmit, users }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">Create User Account</h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={userForm.name}
              onChange={onFormChange}
              placeholder="John Doe"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Username <span className="required">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={userForm.username}
              onChange={onFormChange}
              placeholder="johndoe"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={userForm.password}
              onChange={onFormChange}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              User Role <span className="required">*</span>
            </label>
            <select
              name="role"
              value={userForm.role}
              onChange={onFormChange}
              className="form-input"
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin - Full Access</option>
              <option value="DataEntry">Data Entry - Register Attendees</option>
              <option value="Scanner">Scanner - Check-In Only</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={userLoading}
            className="btn-primary w-full justify-center"
          >
            {userLoading ? (
              <>
                <span className="spinner"></span>
                <span>Creating...</span>
              </>
            ) : (
              <span>Create User</span>
            )}
          </button>
        </form>
      </div>

      {/* User List */}
      {users && users.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-slate-900">Created Users</h4>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={{fontWeight: '600'}}>{user.name}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className="badge badge-primary">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "Active"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
