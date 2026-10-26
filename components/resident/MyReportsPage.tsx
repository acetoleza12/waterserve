"use client";
import { ArrowRight, Plus, FileText } from "lucide-react";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { EmptyState } from "../../components/shared/EmptyState";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<
  WaterServeController,
  "saved" | "notifications" | "navigateTo" | "trackReport"
>;
export function MyReportsPage({
  saved,
  notifications,
  navigateTo,
  trackReport,
}: Props) {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow blue">YOUR WATER SERVICE CONCERNS</div>
        <h1>My reports</h1>
        <p>
          Tracking codes saved on this browser. Use Track a report on another
          device.
        </p>
      </div>
      <div className="saved-list">
        {saved.length ? (
          saved.map((c) => {
            const n = notifications.find((n) => n.code === c);
            return (
              <button
                className="saved-report panel"
                key={c}
                onClick={() => trackReport(c)}
              >
                <span className="service-icon">
                  <FileText size={23} />
                </span>
                <div>
                  <b>{n?.type || "Water service report"}</b>
                  <small>{c}</small>
                </div>
                {n && <StatusBadge status={n.status} />}
                <ArrowRight size={20} />
              </button>
            );
          })
        ) : (
          <div className="panel">
            <EmptyState
              title="Your reports will appear here"
              description="Submit an issue or look up an existing tracking code to save it on this browser."
            />
            <div className="centered">
              <button className="primary" onClick={() => navigateTo("report")}>
                Report an issue
                <Plus size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
