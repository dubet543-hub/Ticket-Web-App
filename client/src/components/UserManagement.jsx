function UserManagement({ userForm, userLoading, onFormChange, onSubmit, users }) {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <span className="text-lg">👥</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Create User Account
          </h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={userForm.name}
              onChange={onFormChange}
              placeholder="John Doe"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={userForm.username}
              onChange={onFormChange}
              placeholder="johndoe"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={userForm.password}
              onChange={onFormChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              User Role *
            </label>
            <select
              name="role"
              value={userForm.role}
              onChange={onFormChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            >
              <option value="">Select Role</option>
              <option value="Admin">👑 Admin - Full Access</option>
              <option value="DataEntry">📝 Data Entry - Register Attendees</option>
              <option value="Scanner">✓ Scanner - Check-In Only</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={userLoading}
            className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-orange-700 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-orange-600/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
          >
            {userLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Creating...
              </span>
            ) : (
              "👤 Create User"
            )}
          </button>
        </form>
      </div>

      {/* User List */}
      {users && users.length > 0 && (
        <div className="mt-8">
          <h4 className="mb-4 text-lg font-semibold text-slate-800">
            Created Users
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="rounded-l-lg px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Username
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="rounded-r-lg px-4 py-3 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-200">
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{user.username}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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
