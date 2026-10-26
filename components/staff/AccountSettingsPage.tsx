"use client";
import { Lock } from "lucide-react";
import { apiRequest } from "../../lib/api-client";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<
  WaterServeController,
  "user" | "setUser" | "busy" | "showToast" | "navigateTo" | "performAction"
>;
export function AccountSettingsPage({
  user,
  setUser,
  busy,
  showToast,
  navigateTo,
  performAction,
}: Props) {
  if (!user) return null;

  return (
    <form
      className="panel auth-form setup-form"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        performAction(async () => {
          await apiRequest("password", Object.fromEntries(f));
          setUser(null);
          navigateTo("login");
          showToast("Password changed. Please sign in again.");
        });
      }}
    >
      <h2>Account security</h2>
      <p>
        {user.name} · {user.email}
      </p>
      <label>
        Current password
        <input
          name="current"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>
      <label>
        New password
        <input
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
        />
        <small>
          Use at least 12 characters. Updating signs you out on all devices.
        </small>
      </label>
      <button className="primary" disabled={busy}>
        Update password
        <Lock size={17} />
      </button>
    </form>
  );
}
