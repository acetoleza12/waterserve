"use client";
import { Plus } from "lucide-react";
import { apiRequest } from "../../lib/api-client";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<
  WaterServeController,
  "busy" | "staff" | "showToast" | "loadWorkspace" | "performAction"
>;
export function StaffManagementPage({
  busy,
  staff,
  showToast,
  loadWorkspace,
  performAction,
}: Props) {
  return (
    <>
      <div className="page-heading">
        <h1>A team that keeps things flowing.</h1>
        <p>
          Create staff credentials and use maintenance accounts to assign field
          work.
        </p>
      </div>
      <div className="team-layout">
        <div className="panel">
          <div className="panel-heading">
            <h3>Staff directory</h3>
            <span className="count">{staff.length} members</span>
          </div>
          {staff.map((s) => (
            <div className="staff-row" key={s.id}>
              <span className="avatar">{s.name[0]}</span>
              <div>
                <b>{s.name}</b>
                <small>{s.email}</small>
              </div>
              <span className="staff-role">{s.role}</span>
            </div>
          ))}
        </div>
        <form
          className="panel auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            performAction(async () => {
              await apiRequest("staff", Object.fromEntries(f));
              await loadWorkspace();
              form.reset();
              showToast("Staff account created.");
            });
          }}
        >
          <h3>Add a staff member</h3>
          <p>
            Share credentials privately. Staff can change passwords from
            Account.
          </p>
          <label>
            Full name
            <input name="name" required minLength={2} maxLength={100} />
          </label>
          <label>
            Email address
            <input name="email" type="email" required />
          </label>
          <label>
            Role
            <select name="role">
              <option value="maintenance">Maintenance</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <label>
            Initial password
            <input
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
            />
            <small>At least 12 characters</small>
          </label>
          <button className="primary" disabled={busy}>
            Create account
            <Plus size={17} />
          </button>
        </form>
      </div>
    </>
  );
}
