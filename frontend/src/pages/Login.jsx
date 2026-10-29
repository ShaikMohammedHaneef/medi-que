import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";
import { useNavigate } from "react-router";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/login", formData);

      const token = response.data.token;

      if (!token) {
        throw new Error("Login response did not contain a token.");
      }

      localStorage.setItem("token", token);

      const userResponse = await axiosInstance.get("/auth/me");
      const role = userResponse.data.role;

      const dashboardRoutes = {
        ADMIN: "/admin/dashboard",
        DOCTOR: "/doctor/dashboard",
        RECEPTIONIST: "/receptionist/dashboard",
      };

      const dashboard = dashboardRoutes[role];

      if (!dashboard) {
        throw new Error("Unrecognized staff role.");
      }

      navigate(dashboard, { replace: true });
    } catch (error) {
      localStorage.removeItem("token");

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to sign in. Check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1D2530] dark:text-[#F3F4F6]">
            Staff Sign In
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-[#DAE0E7] bg-white p-6 shadow-sm dark:border-[#374151] dark:bg-[#1F2937] sm:p-8"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              placeholder="staff@example.com"
              required
              className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#1D2530] dark:text-[#F3F4F6]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="h-11 w-full rounded-lg border border-[#DAE0E7] bg-white px-3 pr-12 text-sm text-[#1D2530] outline-none focus:border-[#0B81B7] focus:ring-2 focus:ring-[#0B81B7]/20 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F3F4F6]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-[#0B81B7] dark:text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0B81B7] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#096B98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
