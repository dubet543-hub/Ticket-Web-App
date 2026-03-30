import { useState } from "react";
import API from "../api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600&display=swap');

  .lg-root {
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
    background: #f0f6fb;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    position: relative;
    overflow: hidden;
  }

  /* Soft background blobs */
  .lg-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .lg-blob-1 {
    width: 420px; height: 420px;
    background: rgba(26,143,132,0.12);
    top: -100px; left: -120px;
  }
  .lg-blob-2 {
    width: 360px; height: 360px;
    background: rgba(236,111,80,0.09);
    bottom: -80px; right: -100px;
  }

  /* ── WRAPPER ── */
  .lg-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
    border-radius: 20px;
    border: 1.5px solid #ccdde8;
    background: #ffffff;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.8),
      0 4px 6px rgba(15,30,55,0.06),
      0 12px 28px rgba(15,30,55,0.12),
      0 24px 48px rgba(15,30,55,0.06);
  }

  @media (max-width: 700px) {
    .lg-wrapper { grid-template-columns: 1fr; }
    .lg-sidebar { display: none; }
  }

  /* ── TOPBAR ── */
  .lg-topbar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #1a8f84, #24a79c, #3bc1b5);
    z-index: 2;
  }

  /* ── SIDEBAR ── */
  .lg-sidebar {
    background: linear-gradient(145deg, #0f6c63 0%, #1a8f84 55%, #24a79c 100%);
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .lg-sidebar::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .lg-sidebar::after {
    content: '';
    position: absolute;
    bottom: -40px; left: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }

  .lg-logo-box {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(255,255,255,0.18);
    border: 1.5px solid rgba(255,255,255,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    flex-shrink: 0;
  }

  .lg-logo-text {
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
  }

  .lg-sidebar-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.7rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin-bottom: 10px;
  }

  .lg-sidebar-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
    margin-bottom: 36px;
  }

  .lg-feature-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
  }

  .lg-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 12px;
  }

  .lg-feature-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
    flex-shrink: 0;
  }

  .lg-feature-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.92);
  }

  /* ── FORM PANEL ── */
  .lg-panel {
    padding: 48px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media (max-width: 560px) {
    .lg-panel { padding: 32px 22px; }
  }

  .lg-eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #94a3b8;
    margin-bottom: 8px;
  }

  .lg-mode-dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #1a8f84;
    animation: lg-glow 2s infinite;
    flex-shrink: 0;
  }

  @keyframes lg-glow {
    0%   { box-shadow: 0 0 0 0 rgba(26,143,132,0.45); }
    70%  { box-shadow: 0 0 0 6px rgba(26,143,132,0); }
    100% { box-shadow: 0 0 0 0 rgba(26,143,132,0); }
  }

  .lg-title {
    font-family: 'Sora', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .lg-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 32px;
  }

  /* Alert */
  .lg-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    background: #fff5f5;
    border: 1.5px solid #fecaca;
    border-radius: 11px;
    font-size: 13px;
    font-weight: 600;
    color: #991b1b;
    margin-bottom: 22px;
    animation: lg-slideIn 0.2s ease;
  }

  @keyframes lg-slideIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lg-alert-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
    margin-top: 3px;
  }

  /* Form fields */
  .lg-form-stack { display: flex; flex-direction: column; gap: 18px; }

  .lg-field { display: flex; flex-direction: column; gap: 7px; }

  .lg-label {
    font-size: 10.5px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #475569;
  }

  .lg-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 1.5px solid #dde9f2;
    border-radius: 11px;
    background: #f8fafc;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
  }

  .lg-input::placeholder { color: #b0bec5; }

  .lg-input:hover:not(:focus) {
    border-color: #b8d0e4;
    background: #fff;
  }

  .lg-input:focus {
    border-color: #1a8f84;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(26,143,132,0.13);
  }

  .lg-input:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Password wrapper */
  .lg-pw-wrap { position: relative; }

  .lg-pw-wrap .lg-input { padding-right: 60px; }

  .lg-pw-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 6px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
  }

  .lg-pw-toggle:hover { color: #1a8f84; background: rgba(26,143,132,0.08); }
  .lg-pw-toggle:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Divider */
  .lg-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #dde9f2, transparent);
    margin: 4px 0;
  }

  /* Submit button */
  .lg-submit-btn {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    background: linear-gradient(135deg, #1a8f84, #24a79c);
    color: #fff;
    border: none;
    border-radius: 13px;
    font-size: 14.5px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(26,143,132,0.3);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    letter-spacing: -0.01em;
  }

  .lg-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(26,143,132,0.38);
  }

  .lg-submit-btn:active:not(:disabled) { transform: translateY(0); }
  .lg-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Spinner */
  .lg-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lg-spin 0.7s linear infinite;
  }

  @keyframes lg-spin { to { transform: rotate(360deg); } }

  /* Footer note */
  .lg-footer-note {
    margin-top: 20px;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #b0bec5;
  }
`;

function Login({ onLoginSuccess = () => {} }) {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setIsLoading(true);

      // ── Real API call ────────────────────────────────────────────────────────
      const response = await API.post("/users/login", {
        username: username.trim(),
        password,
      });
      const { user, token } = response.data;
      // user must include a `role` field: "Admin" | "DataEntry" | "Scanner"

      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      onLoginSuccess(user, token);
      // ────────────────────────────────────────────────────────────────────────

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid username or password.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lg-root">
        <div className="lg-blob lg-blob-1" />
        <div className="lg-blob lg-blob-2" />

        <div className="lg-wrapper">
          <div className="lg-topbar" />

          {/* ── SIDEBAR ── */}
          <aside className="lg-sidebar">
            <div className="lg-logo-box">
              <span className="lg-logo-text">EF</span>
            </div>

            <h1 className="lg-sidebar-title">Welcome to<br />Event Flow</h1>
            <p className="lg-sidebar-sub">
              Run registrations, check-ins, and reports from one focused operations panel.
            </p>

            <div className="lg-feature-list">
              {[
                "Fast attendee registration",
                "Real-time QR based check-in",
                "Actionable reporting & exports",
              ].map((f) => (
                <div className="lg-feature" key={f}>
                  <span className="lg-feature-dot" />
                  <span className="lg-feature-label">{f}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* ── FORM PANEL ── */}
          <section className="lg-panel">
            <p className="lg-eyebrow">
              <span className="lg-mode-dot" />
              Secure Access
            </p>
            <h2 className="lg-title">Sign in</h2>
            <p className="lg-subtitle">Enter your credentials to continue.</p>

            {error && (
              <div className="lg-alert">
                <span className="lg-alert-dot" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="lg-form-stack">
              <div className="lg-field">
                <label className="lg-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="lg-input"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              <div className="lg-field">
                <label className="lg-label">Password</label>
                <div className="lg-pw-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="lg-input"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="lg-pw-toggle"
                    disabled={isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="lg-divider" />

              <button type="submit" disabled={isLoading} className="lg-submit-btn">
                {isLoading ? (
                  <>
                    <span className="lg-spinner" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16" height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <p className="lg-footer-note">Protected system · All access is logged</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default Login;