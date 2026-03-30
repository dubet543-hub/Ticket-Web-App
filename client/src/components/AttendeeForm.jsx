function AttendeeForm({
  attendeeForm,
  attendeeLoading,
  editingAttendeeId,
  categories = [],
  onFormChange,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

        .af-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }

        /* Full-width card — matches .card from Dashboard */
        .af-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d4e4f0;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(15,30,55,0.06), 0 8px 24px rgba(15,30,55,0.05);
          overflow: hidden;
        }

        /* Teal top accent bar */
        .af-topbar {
          height: 4px;
          background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5);
        }

        .af-body { padding: 28px 32px 32px; }

        /* Header */
        .af-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 16px;
          margin-bottom: 26px; padding-bottom: 20px;
          border-bottom: 1px solid #e8f1f8;
        }
        .af-eyebrow {
          display: flex; align-items: center; gap: 7px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 6px;
        }
        .af-mode-dot {
          display: inline-block; width: 6px; height: 6px;
          border-radius: 50%; background: #1a8f84;
          animation: af-glow 2s infinite;
        }
        @keyframes af-glow {
          0%   { box-shadow: 0 0 0 0 rgba(26,143,132,0.45); }
          70%  { box-shadow: 0 0 0 6px rgba(26,143,132,0); }
          100% { box-shadow: 0 0 0 0 rgba(26,143,132,0); }
        }
        .af-title {
          font-family: 'Sora', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          letter-spacing: -0.03em; color: #0f172a; line-height: 1.15;
        }
        .af-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }

        .af-cancel-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f1f5f9; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 8px 16px;
          font-size: 12.5px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; color: #475569;
          cursor: pointer; white-space: nowrap; flex-shrink: 0;
          transition: background 0.15s, transform 0.15s;
        }
        .af-cancel-btn:hover { background: #e2e8f0; transform: translateY(-1px); }

        /* Section label */
        .af-section-title {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #94a3b8; margin-bottom: 14px;
        }

        /* Grids */
        .af-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; }
        @media (max-width: 900px) { .af-grid-3 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .af-grid-3 { grid-template-columns: 1fr; } .af-body { padding: 20px 18px 24px; } }

        .af-form-stack { display: flex; flex-direction: column; gap: 20px; }
        .af-field { display: flex; flex-direction: column; gap: 7px; }

        /* Labels */
        .af-label {
          font-size: 10.5px; font-weight: 700;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.09em; text-transform: uppercase; color: #475569;
          display: flex; align-items: center; gap: 5px;
        }
        .af-required { color: #e11d48; }
        .af-label-hint {
          font-family: 'DM Sans', sans-serif; font-size: 10.5px;
          font-weight: 500; text-transform: none; letter-spacing: 0; color: #94a3b8;
        }

        /* Inputs */
        .af-input, .af-select {
          width: 100%; height: 42px; padding: 0 14px;
          font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #0f172a;
          background: #f8fafc; border: 1.5px solid #dde9f2;
          border-radius: 11px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          appearance: none; -webkit-appearance: none;
        }
        .af-input::placeholder { color: #b0bec5; }
        .af-input:focus, .af-select:focus {
          border-color: #1a8f84; background: #fff;
          box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
        }
        .af-input:hover:not(:focus), .af-select:hover:not(:focus) {
          border-color: #b8d0e4; background: #fff;
        }
        .af-select-wrap { position: relative; }
        .af-select-wrap::after {
          content: ''; pointer-events: none; position: absolute;
          right: 14px; top: 50%; transform: translateY(-50%);
          width: 0; height: 0;
          border-left: 4.5px solid transparent;
          border-right: 4.5px solid transparent;
          border-top: 5.5px solid #94a3b8;
        }

        /* Divider */
        .af-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #dde9f2, transparent);
        }

        /* WhatsApp */
        .af-wa-box {
          display: flex; align-items: flex-start; gap: 14px;
          background: linear-gradient(135deg, #f0fdf9, #ecfdf5);
          border: 1.5px solid #a7f3d0;
          border-radius: 13px; padding: 16px 20px;
        }
        .af-checkbox {
          width: 18px; height: 18px; border-radius: 5px;
          cursor: pointer; flex-shrink: 0; margin-top: 2px;
          accent-color: #10b981;
        }
        .af-wa-label {
          font-size: 13.5px; font-weight: 700; color: #065f46;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .af-wa-hint { font-size: 12px; color: #4b7c5e; margin-top: 3px; line-height: 1.45; }

        /* Submit */
        .af-submit-btn {
          width: 100%; height: 48px;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          background: linear-gradient(135deg, #1a8f84, #24a79c);
          color: #fff; border: none; border-radius: 13px;
          font-size: 14.5px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(26,143,132,0.3);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .af-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(26,143,132,0.38);
        }
        .af-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .af-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .af-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: af-spin 0.7s linear infinite;
        }
        @keyframes af-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="af-root">
        <div className="af-card">
          <div className="af-topbar" />
          <div className="af-body">

            {/* ── Header ── */}
            <div className="af-header">
              <div>
                <p className="af-eyebrow">
                  <span className="af-mode-dot" />
                  {editingAttendeeId ? "Edit Mode" : "New Registration"}
                </p>
                <h3 className="af-title">
                  {editingAttendeeId ? "Edit Member" : "Register Member"}
                </h3>
                <p className="af-subtitle">
                  Fill the details below to generate a ticket &amp; QR instantly.
                </p>
              </div>
              {editingAttendeeId && (
                <button type="button" className="af-cancel-btn" onClick={onCancelEdit}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Cancel
                </button>
              )}
            </div>

            <div className="af-form-stack">

              {/* ── Personal Info ── */}
              <div>
                <p className="af-section-title">Personal Information</p>
                <div className="af-grid-3">
                  <div className="af-field">
                    <label className="af-label">
                      Name <span className="af-required">*</span>
                    </label>
                    <input
                      type="text" name="name"
                      value={attendeeForm.name} onChange={onFormChange}
                      placeholder="Full name" className="af-input" required
                    />
                  </div>
                  <div className="af-field">
                    <label className="af-label">Gender</label>
                    <div className="af-select-wrap">
                      <select name="gender" value={attendeeForm.gender} onChange={onFormChange} className="af-select">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="af-field">
                    <label className="af-label">Age</label>
                    <input
                      type="number" name="age"
                      value={attendeeForm.age} onChange={onFormChange}
                      placeholder="e.g. 25" className="af-input" min={1} max={120}
                    />
                  </div>
                </div>
              </div>

              <div className="af-divider" />

              {/* ── Contact & Ticket ── */}
              <div>
                <p className="af-section-title">Contact &amp; Ticket</p>
                <div className="af-grid-3">
                  <div className="af-field">
                    <label className="af-label">
                      Mobile <span className="af-required">*</span>
                      <span className="af-label-hint">(WhatsApp)</span>
                    </label>
                    <input
                      type="text" name="mobile"
                      value={attendeeForm.mobile} onChange={onFormChange}
                      placeholder="10-digit number" className="af-input" required
                    />
                  </div>
                  <div className="af-field">
                    <label className="af-label">Email</label>
                    <input
                      type="email" name="email"
                      value={attendeeForm.email} onChange={onFormChange}
                      placeholder="example@email.com" className="af-input"
                    />
                  </div>
                  <div className="af-field">
                    <label className="af-label">
                      Category <span className="af-required">*</span>
                    </label>
                    <div className="af-select-wrap">
                      <select name="category" value={attendeeForm.category} onChange={onFormChange} className="af-select" required>
                        <option value="">Select category</option>
                        {categories.map((item) => (
                          <option key={item._id} value={item._id}>{item.categoryName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="af-divider" />

              {/* ── WhatsApp ── */}
              <div className="af-wa-box">
                <input
                  type="checkbox" id="sendWhatsApp" name="sendWhatsApp"
                  checked={attendeeForm.sendWhatsApp || false}
                  onChange={(e) => onFormChange({ target: { name: "sendWhatsApp", value: e.target.checked } })}
                  className="af-checkbox"
                />
                <div>
                  <label htmlFor="sendWhatsApp" className="af-wa-label">
                    Send Ticket on WhatsApp
                  </label>
                  <p className="af-wa-hint">
                    Ticket &amp; QR code will be delivered to the mobile number via WhatsApp.
                  </p>
                </div>
              </div>

              {/* ── Submit ── */}
              <button type="button" onClick={onSubmit} disabled={attendeeLoading} className="af-submit-btn">
                {attendeeLoading ? (
                  <><span className="af-spinner" /><span>{editingAttendeeId ? "Updating…" : "Saving…"}</span></>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {editingAttendeeId
                        ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
                        : <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>
                      }
                    </svg>
                    <span>{editingAttendeeId ? "Update Member" : "Save Member"}</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AttendeeForm;