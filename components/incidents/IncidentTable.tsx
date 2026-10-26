"use client";
import type { IncidentReport } from "../../lib/types";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { EmptyState } from "../../components/shared/EmptyState";
export function IncidentTable({
  rows,
  onOpen,
}: {
  rows: IncidentReport[];
  onOpen: (report: IncidentReport) => void;
}) {
  return rows.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>INCIDENT / TRACKING CODE</th>
            <th>RESIDENT</th>
            <th>LOCATION</th>
            <th>STATUS</th>
            <th>REPORTED</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              onClick={() => {
                onOpen(r);
              }}
            >
              <td>
                <b>{r.type}</b>
                <small>{r.code}</small>
              </td>
              <td>
                {r.name}
                <small>{r.phone}</small>
              </td>
              <td>
                {r.barangay}
                <small>{r.address}</small>
              </td>
              <td>
                <StatusBadge status={r.status} />
              </td>
              <td>
                {new Date(r.created).toLocaleDateString("en-PH", {
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td>
                <button aria-label={"Open " + r.code} className="icon-button">
                  <ArrowUpRight size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <EmptyState
      title="No incidents to show"
      description="New reports and matching search results will appear here."
    />
  );
}
