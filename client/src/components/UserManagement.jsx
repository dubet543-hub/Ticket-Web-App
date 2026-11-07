import { useState } from "react";
import API from "../api";

const ROLE_ACCESS = {
  Admin: "Full access: members, reports, check-in, categories, logins",
  DataEntry: "Register and view members",
  Scanner: "Check-in and facility reports only",
};

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "-");

function UserManagement({ userForm, userLoading, onFormChange, onSubmit, users, editingUserId, currentUserId, onEditUser, onDeleteUser, onCancelEdit }) {
  const editing = Boolean(editingUserId);

  // View: details of one login, with its counts loaded from the server
  const [viewing, setViewing] = useState(null);
  const openView = async (user) => {
    setViewing({ ...user, loading: true });
    try {
      const res = await API.get(`/users/${user._id}`);
      setViewing((current) => (current?._id === user._id ? { ...res.data, loading: false } : current));
    } catch {
      setViewing((current) => (current?._id === user._id ? { ...current, loading: false, failed: true } : current));
    }
  };
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

        .um-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; display: flex; flex-direction: column; gap: 22px; }

        /* ── Card ── */
        .um-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d4e4f0;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(15,30,55,0.06), 0 8px 24px rgba(15,30,55,0.05);
          overflow: hidden;
        }

        .um-topbar {
          height: 4px;
          background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5);
        }

        .um-body { padding: 28px 32px 32px; }
        @media (max-width: 560px) { .um-body { padding: 20px 18px 24px; } }

        /* ── Header ── */
        .um-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 16px;
          margin-bottom: 26px; padding-bottom: 20px;
          border-bottom: 1px solid #e8f1f8;
        }

        .um-eyebrow {
          display: flex; align-items: center; gap: 7px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 6px;
        }

        .um-mode-dot {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #1a8f84;
          animation: um-glow 2s infinite;
        }
        @keyframes um-glow {
          0%   { box-shadow: 0 0 0 0 rgba(26,143,132,0.45); }
          70%  { box-shadow: 0 0 0 6px rgba(26,143,132,0); }
          100% { box-shadow: 0 0 0 0 rgba(26,143,132,0); }
        }

        .um-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          letter-spacing: -0.03em; color: #0f172a; line-height: 1.15;
        }
        .um-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }

        /* ── Section label ── */
        .um-section-title {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 14px;
        }

        /* ── Grids ── */
        .um-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .um-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
        @media (max-width: 900px) { .um-grid-3 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) {
          .um-grid-2, .um-grid-3 { grid-template-columns: 1fr; }
        }

        .um-form-stack { display: flex; flex-direction: column; gap: 20px; }
        .um-field { display: flex; flex-direction: column; gap: 7px; }

        /* ── Labels ── */
        .um-label {
          font-size: 10.5px; font-weight: 700;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.09em; text-transform: uppercase; color: #475569;
          display: flex; align-items: center; gap: 5px;
        }
        .um-required { color: #e11d48; }

        /* ── Inputs ── */
        .um-input, .um-select {
          width: 100%; height: 42px; padding: 0 14px;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #0f172a;
          background: #f8fafc; border: 1.5px solid #dde9f2;
          border-radius: 11px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          appearance: none; -webkit-appearance: none; box-sizing: border-box;
        }
        .um-input::placeholder { color: #b0bec5; }
        .um-input:focus, .um-select:focus {
          border-color: #1a8f84; background: #fff;
          box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
        }
        .um-input:hover:not(:focus), .um-select:hover:not(:focus) {
          border-color: #b8d0e4; background: #fff;
        }

        /* Password wrapper */
        .um-pw-wrap { position: relative; }
        .um-pw-wrap .um-input { padding-right: 60px; }
        .um-pw-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 11px; font-weight: 700;
          font-family: 'DM Mono', monospace; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.06em;
          padding: 4px 6px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .um-pw-toggle:hover { color: #1a8f84; background: rgba(26,143,132,0.08); }

        /* Select chevron */
        .um-select-wrap { position: relative; }
        .um-select-wrap::after {
          content: ''; pointer-events: none; position: absolute;
          right: 14px; top: 50%; transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 4.5px solid transparent;
          border-right: 4.5px solid transparent;
          border-top: 5.5px solid #94a3b8;
        }

        /* ── Role info box ── */
        .um-role-box {
          display: flex; align-items: flex-start; gap: 14px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border: 1.5px solid #bae6fd;
          border-radius: 13px; padding: 16px 20px;
        }
        .um-role-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: rgba(14,165,233,0.12);
          border: 1px solid rgba(14,165,233,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .um-role-info-title { font-size: 13px; font-weight: 700; color: #0c4a6e; margin-bottom: 3px; }
        .um-role-hint { font-size: 11.5px; color: #0369a1; line-height: 1.5; }

        /* ── Divider ── */
        .um-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #dde9f2, transparent);
        }

        /* ── Submit ── */
        .um-submit-btn {
          width: 100%; height: 48px;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          background: linear-gradient(135deg, #1a8f84, #24a79c);
          color: #fff; border: none; border-radius: 13px;
          font-size: 14.5px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(26,143,132,0.3);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          letter-spacing: -0.01em;
        }
        .um-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26,143,132,0.38);
        }
        .um-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .um-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .um-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: um-spin 0.7s linear infinite;
        }
        @keyframes um-spin { to { transform: rotate(360deg); } }

        /* ── User List Card ── */
        .um-list-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d4e4f0;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(15,30,55,0.06), 0 8px 24px rgba(15,30,55,0.05);
          overflow: hidden;
        }

        .um-list-topbar {
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
        }

        .um-list-body { padding: 24px 28px 28px; }

        .um-list-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .um-list-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase; color: #94a3b8;
          margin-bottom: 4px;
        }
        .um-list-title {
          font-family: 'Sora', sans-serif; font-size: 1.1rem; font-weight: 800;
          letter-spacing: -0.03em; color: #0f172a;
        }
        .um-count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 28px; height: 28px; padding: 0 9px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 99px;
          font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700;
          color: #475569;
        }

        /* Table */
        .um-table-wrap {
          overflow-x: auto;
          border: 1px solid #e8f1f8;
          border-radius: 12px;
        }
        .um-table {
          width: 100%; border-collapse: collapse;
          font-family: 'DM Sans', sans-serif;
        }
        .um-table thead tr {
          background: #f8fafc;
          border-bottom: 1px solid #e8f1f8;
        }
        .um-table th {
          padding: 11px 16px;
          font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.13em; text-transform: uppercase; color: #94a3b8;
          text-align: left; white-space: nowrap;
        }
        .um-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.12s;
        }
        .um-table tbody tr:last-child { border-bottom: none; }
        .um-table tbody tr:hover { background: #f8fafc; }
        .um-table td {
          padding: 13px 16px;
          font-size: 13px; color: #334155; vertical-align: middle;
        }

        /* Avatar */
        .um-avatar {
          width: 32px; height: 32px; border-radius: 9px;
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 800;
          color: #fff; flex-shrink: 0;
          background: linear-gradient(135deg, #1a8f84, #24a79c);
        }
        .um-name-cell { display: flex; align-items: center; gap: 10px; }
        .um-name-text { font-weight: 600; color: #0f172a; }
        .um-username-text { font-size: 11.5px; color: #94a3b8; font-family: 'DM Mono', monospace; }

        /* Badges */
        .um-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 99px;
          font-size: 11px; font-weight: 700;
          font-family: 'DM Mono', monospace; letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .um-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        .um-badge-admin    { background: #fef3c7; color: #92400e; }
        .um-badge-admin .um-badge-dot { background: #f59e0b; }

        .um-badge-data     { background: #ede9fe; color: #5b21b6; }
        .um-badge-data .um-badge-dot { background: #8b5cf6; }

        .um-badge-scanner  { background: #e0f2fe; color: #0c4a6e; }
        .um-badge-scanner .um-badge-dot { background: #0ea5e9; }

        .um-badge-active   { background: #dcfce7; color: #14532d; }
        .um-badge-active .um-badge-dot { background: #22c55e; }

        .um-badge-inactive { background: #fee2e2; color: #7f1d1d; }
        .um-badge-inactive .um-badge-dot { background: #ef4444; }

        /* Empty state */
        .um-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 40px 20px; gap: 10px;
          color: #94a3b8;
        }
        .um-empty-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }
        .um-empty-text { font-size: 13px; font-weight: 600; color: #64748b; }
        .um-empty-hint { font-size: 12px; color: #94a3b8; }

        /* Edit / Delete */
        .um-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .um-action-btn {
          height: 32px; padding: 0 14px; border-radius: 9px; cursor: pointer;
          font-size: 12.5px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #dde9f2; background: #fff; color: #0f172a;
          transition: background 0.15s, border-color 0.15s;
        }
        .um-action-btn:hover { background: #f1f5f9; border-color: #b8d0e4; }
        .um-action-delete { border-color: #fecaca; color: #dc2626; }
        .um-action-delete:hover { background: #fef2f2; border-color: #fca5a5; }
        .um-you { font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; }
        .um-editing-row { background: #f0faf7 !important; }

        /* View box */
        .um-overlay {
          position: fixed; inset: 0; z-index: 50; background: rgba(15,23,42,0.45);
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
        .um-view {
          width: 100%; max-width: 440px; background: #fff; border-radius: 18px; overflow: hidden;
          box-shadow: 0 20px 50px rgba(15,30,55,0.3);
        }
        .um-view-body { padding: 22px 24px 24px; }
        .um-view-head { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
        .um-view-head .um-avatar { width: 44px; height: 44px; font-size: 15px; border-radius: 12px; }
        .um-view-rows { display: grid; grid-template-columns: auto 1fr; gap: 10px 16px; font-size: 13.5px; }
        .um-view-key { font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 700; letter-spacing: 0.09em; text-transform: uppercase; color: #94a3b8; padding-top: 2px; }
        .um-view-val { color: #0f172a; }
        .um-view-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
        .um-view-stat { background: #f8fafc; border: 1px solid #e8f1f8; border-radius: 12px; padding: 12px 14px; }
        .um-view-stat-num { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
        .um-view-stat-label { font-size: 12px; color: #64748b; }
        .um-view-foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
        .um-cancel-btn {
          height: 38px; padding: 0 16px; border-radius: 11px; cursor: pointer;
          font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #dde9f2; background: #fff; color: #475569;
        }
        .um-cancel-btn:hover { background: #f1f5f9; }
      `}</style>

      <div className="um-root">

        {/* ── Create User Card ── */}
        <div className="um-card">
          <div className="um-topbar" />
          <div className="um-body">

            {/* Header */}
            <div className="um-header">
              <div>
                <p className="um-eyebrow">
                  <span className="um-mode-dot" />
                  Access Control
                </p>
                <h3 className="um-title">{editing ? `Edit User · ${userForm.username}` : "Create User Account"}</h3>
                <p className="um-subtitle">
                  {editing ? "Change the details below. Leave the password empty to keep the current one." : "Add a new operator with role-based access."}
                </p>
              </div>
              {editing && (
                <button type="button" className="um-cancel-btn" onClick={onCancelEdit}>Cancel</button>
              )}
            </div>

            <div className="um-form-stack">

              {/* ── Identity ── */}
              <div>
                <p className="um-section-title">Identity</p>
                <div className="um-grid-2">
                  <div className="um-field">
                    <label className="um-label">
                      Full Name <span className="um-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userForm.name}
                      onChange={onFormChange}
                      placeholder="e.g. John Doe"
                      className="um-input"
                      required
                    />
                  </div>
                  <div className="um-field">
                    <label className="um-label">
                      Username <span className="um-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={userForm.username}
                      onChange={onFormChange}
                      placeholder="e.g. johndoe"
                      className="um-input"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>

              <div className="um-divider" />

              {/* ── Credentials & Role ── */}
              <div>
                <p className="um-section-title">Credentials &amp; Role</p>
                <div className="um-grid-2">
                  <div className="um-field">
                    <label className="um-label">
                      {editing ? "New Password" : <>Password <span className="um-required">*</span></>}
                    </label>
                    <div className="um-pw-wrap">
                      <input
                        type="password"
                        name="password"
                        value={userForm.password}
                        onChange={onFormChange}
                        placeholder={editing ? "Leave empty to keep current" : "••••••••"}
                        className="um-input"
                        required={!editing}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="um-field">
                    <label className="um-label">
                      User Role <span className="um-required">*</span>
                    </label>
                    <div className="um-select-wrap">
                      <select
                        name="role"
                        value={userForm.role}
                        onChange={onFormChange}
                        className="um-select"
                        required
                      >
                        <option value="">Select a role</option>
                        <option value="Admin">Admin — Full Access</option>
                        <option value="DataEntry">Data Entry — Register Attendees</option>
                        <option value="Scanner">Scanner — Check-In Only</option>
                      </select>
                    </div>
                  </div>
                  {editing && (
                    <div className="um-field">
                      <label className="um-label">Status</label>
                      <div className="um-select-wrap">
                        <select name="status" value={userForm.status || "Active"} onChange={onFormChange} className="um-select">
                          <option value="Active">Active — can log in</option>
                          <option value="Inactive">Inactive — can't log in</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Role hint box ── */}
              <div className="um-role-box">
                <div className="um-role-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div>
                  <p className="um-role-info-title">Role Permissions</p>
                  <p className="um-role-hint">
                    <strong>Admin</strong> — full system access &nbsp;·&nbsp;
                    <strong>Data Entry</strong> — register &amp; view members &nbsp;·&nbsp;
                    <strong>Scanner</strong> — check-in &amp; facility reports only
                  </p>
                </div>
              </div>

              {/* ── Submit ── */}
              <button
                type="button"
                onClick={onSubmit}
                disabled={userLoading}
                className="um-submit-btn"
              >
                {userLoading ? (
                  <><span className="um-spinner" /><span>{editing ? "Updating…" : "Creating…"}</span></>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <line x1="19" y1="8" x2="19" y2="14"/>
                      <line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    <span>{editing ? "Update User" : "Create User"}</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ── User List Card ── */}
        <div className="um-list-card">
          <div className="um-list-topbar" />
          <div className="um-list-body">

            <div className="um-list-header">
              <div>
                <p className="um-list-eyebrow">Directory</p>
                <h4 className="um-list-title">System Users</h4>
              </div>
              {users && users.length > 0 && (
                <span className="um-count-badge">{users.length}</span>
              )}
            </div>

            <div className="um-table-wrap">
              {users && users.length > 0 ? (
                <table className="um-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const initials = (user.name || "?")
                        .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

                      const roleBadgeClass =
                        user.role === "Admin"     ? "um-badge um-badge-admin"   :
                        user.role === "DataEntry" ? "um-badge um-badge-data"    :
                                                    "um-badge um-badge-scanner";

                      const roleLabel =
                        user.role === "DataEntry" ? "Data Entry" : user.role;

                      return (
                        <tr key={user._id} className={user._id === editingUserId ? "um-editing-row" : undefined}>
                          <td>
                            <div className="um-name-cell">
                              <div className="um-avatar">{initials}</div>
                              <span className="um-name-text">{user.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="um-username-text">{user.username}</span>
                          </td>
                          <td>
                            <span className={roleBadgeClass}>
                              <span className="um-badge-dot" />
                              {roleLabel}
                            </span>
                          </td>
                          <td>
                            <span className={`um-badge ${user.status === "Active" ? "um-badge-active" : "um-badge-inactive"}`}>
                              <span className="um-badge-dot" />
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <div className="um-actions">
                              <button type="button" className="um-action-btn" onClick={() => openView(user)}>View</button>
                              <button type="button" className="um-action-btn" onClick={() => onEditUser(user)}>Edit</button>
                              {user._id === currentUserId ? (
                                <span className="um-you" title="You can't delete the login you are using">(you)</span>
                              ) : (
                                <button type="button" className="um-action-btn um-action-delete" onClick={() => onDeleteUser(user)}>Delete</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="um-empty">
                  <div className="um-empty-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <p className="um-empty-text">No users created yet</p>
                  <p className="um-empty-hint">Create your first user account above.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {viewing && (
        <div className="um-overlay" onClick={() => setViewing(null)}>
          <div className="um-view" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={`Login ${viewing.username}`}>
            <div className="um-list-topbar" />
            <div className="um-view-body">
              <div className="um-view-head">
                <div className="um-avatar">
                  {(viewing.name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="um-list-title">{viewing.name}</h4>
                  <span className="um-username-text">{viewing.username}{viewing._id === currentUserId ? " · you" : ""}</span>
                </div>
              </div>

              <div className="um-view-rows">
                <span className="um-view-key">Role</span>
                <span className="um-view-val">
                  <strong>{viewing.role === "DataEntry" ? "Data Entry" : viewing.role}</strong> — {ROLE_ACCESS[viewing.role] || ""}
                </span>
                <span className="um-view-key">Status</span>
                <span className="um-view-val">
                  <span className={`um-badge ${viewing.status === "Active" ? "um-badge-active" : "um-badge-inactive"}`}>
                    <span className="um-badge-dot" />{viewing.status}
                  </span>
                  {viewing.status !== "Active" && " can't log in"}
                </span>
                <span className="um-view-key">Password</span>
                <span className="um-view-val">Hidden (stored locked). Use Edit to set a new one.</span>
                <span className="um-view-key">Created</span>
                <span className="um-view-val">{formatDateTime(viewing.createdAt)}</span>
                <span className="um-view-key">Last changed</span>
                <span className="um-view-val">{formatDateTime(viewing.updatedAt)}</span>
              </div>

              <div className="um-view-stats">
                <div className="um-view-stat">
                  <div className="um-view-stat-num">{viewing.loading ? "…" : viewing.failed ? "-" : viewing.registeredCount}</div>
                  <div className="um-view-stat-label">Members registered</div>
                </div>
                <div className="um-view-stat">
                  <div className="um-view-stat-num">{viewing.loading ? "…" : viewing.failed ? "-" : viewing.scannedCount}</div>
                  <div className="um-view-stat-label">Entries scanned</div>
                </div>
              </div>

              <div className="um-view-foot">
                <button type="button" className="um-action-btn" onClick={() => { setViewing(null); onEditUser(viewing); }}>Edit</button>
                <button type="button" className="um-cancel-btn" onClick={() => setViewing(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserManagement;