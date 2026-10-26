"use client";
import { ArrowRight, ClipboardList, ShieldCheck, Lock } from "lucide-react";
import { ISSUE_TYPES } from "../../lib/constants";
import { PhotoInput } from "../../components/shared/PhotoInput";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<WaterServeController, "busy" | "setPhoto" | "submitReport">;
export function ReportIssuePage({ busy, setPhoto, submitReport }: Props) {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow blue">RESIDENT SERVICES / NEW REPORT</div>
        <h1>Let’s get it flowing again.</h1>
        <p>Tell us about the problem. No account needed.</p>
      </div>
      <div className="form-layout">
        <form className="panel report-form" onSubmit={submitReport}>
          <div className="form-section-title">
            <span>01</span>
            <div>
              <h3>Your contact details</h3>
              <p>So our team can follow up and find your service location.</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Full name
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Juan dela Cruz"
              />
            </label>
            <label>
              Contact number
              <input
                name="phone"
                type="tel"
                required
                minLength={7}
                maxLength={25}
                autoComplete="tel"
                placeholder="09XX XXX XXXX"
              />
            </label>
            <label>
              Account number<small className="inline-note">Optional</small>
              <input
                name="account"
                maxLength={50}
                placeholder="Your CCWD account number"
              />
            </label>
            <label>
              Barangay
              <input
                name="barangay"
                required
                minLength={2}
                maxLength={100}
                placeholder="Enter your barangay"
              />
            </label>
            <label className="full">
              Service address
              <input
                name="address"
                required
                minLength={5}
                maxLength={300}
                autoComplete="street-address"
                placeholder="House number, street, and nearby landmark"
              />
            </label>
          </div>
          <div className="form-section-title">
            <span>02</span>
            <div>
              <h3>What’s the issue?</h3>
              <p>A few details will help us send the right team.</p>
            </div>
          </div>
          <label>
            Issue type
            <select name="type" required defaultValue="">
              <option value="" disabled>
                Select a water service issue
              </option>
              {ISSUE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Describe the problem
            <textarea
              name="description"
              required
              minLength={15}
              maxLength={3000}
              rows={4}
              placeholder="What is happening? When did it start? Include details that will help our team."
            />
          </label>
          <PhotoInput onChange={setPhoto} />
          <label className="checkbox">
            <input type="checkbox" name="consent" required />
            <span>
              I agree that my contact details, address, and attachments may be
              used by authorized staff to assess and resolve this incident.
            </span>
          </label>
          <div className="form-footer">
            <span>
              <ShieldCheck size={16} />
              Your details are shared only with authorized staff.
            </span>
            <button className="primary" disabled={busy}>
              {busy ? "Submitting…" : "Submit report"}
              <ArrowRight size={17} />
            </button>
          </div>
        </form>
        <aside>
          <div className="info-card">
            <span className="service-icon">
              <ClipboardList size={25} />
            </span>
            <h3>What happens next?</h3>
            <ol>
              <li>Get your unique tracking code.</li>
              <li>Our team reviews your concern.</li>
              <li>Follow progress until it’s resolved.</li>
            </ol>
            <hr />
            <p>
              <b>Keep your tracking code safe.</b>
              <br />
              It is your private link to report updates. You can return to it
              anytime.
            </p>
          </div>
          <p className="aside-note">
            <Lock size={15} />
            Contact information is never shown in public tracking results.
          </p>
        </aside>
      </div>
    </>
  );
}
