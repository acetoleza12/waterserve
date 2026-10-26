"use client";
import {
  Droplets,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Search,
  ChevronRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<WaterServeController, "setPhoto" | "navigateTo">;
export function HomePage({ setPhoto, navigateTo }: Props) {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              YOUR WATER. OUR COMMITMENT.
            </div>
            <h1>
              Better water service
              <br />
              starts with <em>you.</em>
            </h1>
            <p>
              A leak on your street? Low water pressure at home?
              <br className="desktop" />
              Tell us what’s happening. We’ll help get it flowing again.
            </p>
            <div className="hero-buttons">
              <button
                className="primary"
                onClick={() => {
                  setPhoto("");
                  navigateTo("report");
                }}
              >
                Report a water issue
                <ArrowUpRight size={18} />
              </button>
              <button className="secondary" onClick={() => navigateTo("track")}>
                Track your report
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="hero-trust">
              <ShieldCheck size={17} />
              <span>No registration needed</span>
              <i />
              <span>Available 24/7</span>
            </div>
          </div>
          <div className="water-art" aria-label="Illustration of flowing water">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="water-drop">
              <Droplets size={128} strokeWidth={1.2} />
            </div>
            <div className="art-card card-top">
              <span className="art-icon">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <b>A clearer way to connect.</b>
                <small>From your report to a resolution.</small>
              </div>
            </div>
            <div className="art-card card-bottom">
              <span className="live-dot" />
              <span>Here for every drop.</span>
              <Droplets size={16} />
            </div>
            <span className="art-coord">
              12.0676° N &nbsp; 124.6042° E<br />
              CALBAYOG CITY, SAMAR
            </span>
            <span className="water-line line-one" />
            <span className="water-line line-two" />
          </div>
        </div>
      </section>
      <div className="service-strip">
        <div>
          <Activity size={19} />
          <b>Connected to your community.</b>
          <span>
            A simpler way to report water service concerns in Calbayog City.
          </span>
        </div>
        <span className="strip-tag">
          RESIDENT SERVICES
          <ChevronRight size={16} />
        </span>
      </div>
      <section className="section quick-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow blue">LET’S GET YOU TO THE RIGHT PLACE</div>
            <h2>How can we help?</h2>
          </div>
          <p>
            Simple steps. Clear updates.
            <br />
            One less thing to worry about.
          </p>
        </div>
        <div className="service-grid">
          {[
            {
              icon: Droplets,
              title: "Report an issue",
              text: "Let us know about leaks, broken pipes, or changes in your water supply.",
              action: "Submit a report",
              page: "report",
              cls: "blue-card",
            },
            {
              icon: Search,
              title: "Track a report",
              text: "Use your tracking code to see the latest updates and repair progress.",
              action: "Check report status",
              page: "track",
              cls: "",
            },
            {
              icon: ClipboardList,
              title: "Your reports, together",
              text: "Revisit the reports saved on this device and stay up to date.",
              action: "View my reports",
              page: "myreports",
              cls: "",
            },
          ].map((c) => (
            <button
              className={"service-card " + c.cls}
              key={c.title}
              onClick={() => navigateTo(c.page)}
            >
              <span className="service-icon">
                <c.icon size={26} />
              </span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="card-action">
                {c.action}
                <ArrowRight size={18} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="steps-section section">
        <div>
          <div className="eyebrow blue">FROM REPORT TO RESOLUTION</div>
          <h2>We keep you in the loop.</h2>
          <p>
            Every concern follows a clear path.
            <br />
            You can check in at any time.
          </p>
          <button className="text-button" onClick={() => navigateTo("track")}>
            Follow your report
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="steps">
          {[
            {
              title: "Tell us what’s wrong",
              text: "Share the issue, location, and a photo if you have one.",
            },
            {
              title: "We get the right team on it",
              text: "Our staff reviews your report and assigns a maintenance worker.",
            },
            {
              title: "Follow the repair progress",
              text: "Your tracking code keeps every status update within reach.",
            },
          ].map((s, i) => (
            <div className="step" key={s.title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="help-banner section">
        <div className="help-icon">
          <ShieldCheck size={30} />
        </div>
        <div>
          <h3>Your community. Your water. Your voice.</h3>
          <p>
            Accurate details help our field team find and resolve the problem
            faster.
          </p>
        </div>
        <button className="secondary" onClick={() => navigateTo("report")}>
          Make a report
          <ArrowUpRight size={18} />
        </button>
      </section>
    </>
  );
}
