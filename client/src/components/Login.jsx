import { useState } from "react";
import API from "../api";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setIsLoading(true);
      const response = await API.post("/users/login", {
        username: username.trim(),
        password,
      });

      const { user, token } = response.data;

      // Store auth data
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      // Call success callback
      onLoginSuccess(user, token);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid username or password"
      );
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#ec6f50]/20 blur-3xl"></div>
      <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[#1a8f84]/20 blur-3xl"></div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#d2e0ef] bg-white/90 shadow-2xl md:grid-cols-2">
        <section className="hidden bg-linear-to-br from-[#0f6c63] via-[#1a8f84] to-[#24a79c] p-10 text-white md:block">
          <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <span className="text-lg font-bold">TM</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Welcome to Event Flow</h1>
          <p className="text-sm text-teal-50">Run registrations, check-ins, and reports from one focused operations panel.</p>

          <div className="mt-10 space-y-4 text-sm">
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold">Fast attendee registration</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold">Real-time QR based check-in</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              <p className="font-semibold">Actionable reporting and exports</p>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Secure Access</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">Enter your credentials to continue.</p>
          </div>

          {error && (
            <div className="alert alert-danger mb-6">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0 text-sm font-semibold text-slate-500 transition hover:text-slate-700"
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center mt-6"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-7 rounded-xl border border-[#d6e4f2] bg-[#f2f8ff] p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#0f6c63]">Demo Credentials</p>
            <div className="space-y-2.5 text-xs">
              <div>
                <p className="font-semibold text-slate-900">Admin</p>
                <p className="text-slate-700">admin / admin123</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Data Entry</p>
                <p className="text-slate-700">dataentry / entry123</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Scanner</p>
                <p className="text-slate-700">scanner / scan123</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
            Protected system • All access is logged and monitored
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
