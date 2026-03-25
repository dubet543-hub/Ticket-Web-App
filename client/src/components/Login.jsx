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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-4">
            <span className="text-4xl">🎫</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Event Manager</h1>
          <p className="text-white/80 text-sm">Ticket & Entry Management System</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-600 text-sm mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-800 font-medium">
                <span className="mr-2">❌</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                🔐 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 pr-12 text-slate-900 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 transition"
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Signing in...
                </span>
              ) : (
                "🔓 Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-3">📝 Demo Credentials:</p>
            <div className="space-y-2 text-xs text-blue-800">
              <div>
                <p className="font-semibold">Admin:</p>
                <p className="text-blue-700">Username: admin | Password: admin123</p>
              </div>
              <div>
                <p className="font-semibold">Data Entry:</p>
                <p className="text-blue-700">Username: dataentry | Password: entry123</p>
              </div>
              <div>
                <p className="font-semibold">Scanner:</p>
                <p className="text-blue-700">Username: scanner | Password: scan123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            Protected system • All access is logged and monitored
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
