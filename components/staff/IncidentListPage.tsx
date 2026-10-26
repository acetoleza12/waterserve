"use client";
import { Search, Download } from "lucide-react";
import { REPORT_STATUSES } from "../../lib/constants";
import { IncidentTable } from "../../components/incidents/IncidentTable";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<
  WaterServeController,
  | "user"
  | "query"
  | "setQuery"
  | "filter"
  | "setFilter"
  | "filtered"
  | "exportReports"
  | "openIncident"
>;
export function IncidentListPage({
  user,
  query,
  setQuery,
  filter,
  setFilter,
  filtered,
  exportReports,
  openIncident,
}: Props) {
  if (!user) return null;

  return (
    <>
      <div className="page-heading dashboard-heading">
        <div>
          <h1>
            {user.role === "admin" ? "Incident reports" : "My work orders"}
          </h1>
          <p>
            {user.role === "admin"
              ? "Review concerns, assign personnel, and follow every resolution."
              : "Only work orders assigned to you appear here."}
          </p>
        </div>
        {user.role === "admin" && (
          <button className="secondary" onClick={exportReports}>
            <Download size={16} />
            Export CSV
          </button>
        )}
      </div>
      <div className="panel">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />
            <input
              aria-label="Search incidents"
              placeholder="Search code, resident, issue, or address…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All statuses</option>
            {REPORT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span>{filtered.length} reports</span>
        </div>
        {<IncidentTable rows={filtered} onOpen={openIncident} />}
      </div>
    </>
  );
}
