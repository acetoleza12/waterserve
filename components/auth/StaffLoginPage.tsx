"use client";
import { ArrowRight, Users, Wrench, ShieldCheck, Lock } from "lucide-react";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<
  WaterServeController,
  "needsSetup" | "ready" | "busy" | "role" | "setRole" | "navigateTo" | "login"
>;
export function StaffLoginPage({
  needsSetup,
  ready,
  busy,
  role,
  setRole,
  navigateTo,
  login,
}: Props) {
  return (
    <div className="auth-layout">
      <div className="auth-intro">
        <div className="eyebrow blue">CCWD STAFF PORTAL</div>
        <h1>
          A connected team.
          <br />A better response.
        </h1>
        <p>
          Review reports, coordinate field repairs, and keep residents informed
          at every step.
        </p>
        <div className="auth-feature">
          <ShieldCheck />
          <span>
            Secure, role-based access
            <br />
            <small>For authorized administrative and maintenance staff.</small>
          </span>
        </div>
      </div>
      <form className="panel auth-form" onSubmit={login}>
        <span className="service-icon">
          <Lock size={24} />
        </span>
        <h2>Welcome back.</h2>
        <p>Sign in to your workspace.</p>
        <div className="role-switch">
          <button
            type="button"
            className={role === "admin" ? "selected" : ""}
            onClick={() => setRole("admin")}
          >
            <Users size={17} />
            Administrator
          </button>
          <button
            type="button"
            className={role === "maintenance" ? "selected" : ""}
            onClick={() => setRole("maintenance")}
          >
            <Wrench size={17} />
            Maintenance
          </button>
        </div>
        <label>
          Email address
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </label>
        <button className="primary" disabled={busy || !ready}>
          {busy ? "Signing in…" : "Sign in"}
          <ArrowRight size={18} />
        </button>
        {needsSetup && (
          <div className="setup-prompt">
            First time here?{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => navigateTo("setup")}
            >
              Set up administrator
            </button>
          </div>
        )}
        <small className="muted">
          Residents can report and track issues without signing in.
        </small>
      </form>
    </div>
  );
}
