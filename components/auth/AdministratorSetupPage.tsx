"use client";
import { ArrowRight } from "lucide-react";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<WaterServeController, "busy" | "setup">;
export function AdministratorSetupPage({ busy, setup }: Props) {
  return (
    <form className="panel auth-form setup-form" onSubmit={setup}>
      <div className="eyebrow blue">FIRST-TIME SETUP</div>
      <h2>Create your administrator.</h2>
      <p>
        Use the private setup key provided with this website. Setup is available
        only before the first account exists.
      </p>
      <label>
        Setup key
        <input name="key" type="password" required autoComplete="off" />
      </label>
      <label>
        Full name
        <input name="name" required minLength={2} maxLength={100} />
      </label>
      <label>
        Email address
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete="new-password"
        />
        <small>At least 12 characters.</small>
      </label>
      <button className="primary" disabled={busy}>
        {busy ? "Creating…" : "Create administrator"}
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
