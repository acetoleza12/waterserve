"use client";
import { Search } from "lucide-react";
import { EmptyState } from "../../components/shared/EmptyState";
import type { WaterServeController } from "../../hooks/useWaterServe";
type Props = Pick<WaterServeController, "reports" | "query" | "setQuery">;
export function CustomerDirectoryPage({ reports, query, setQuery }: Props) {
  return (
    <>
      <div className="page-heading">
        <h1>Customer directory</h1>
        <p>
          Read-only details from submitted reports. These are resident-provided,
          not verified CCWD account records.
        </p>
      </div>
      <div className="panel">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />
            <input
              aria-label="Search customers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, contact, or address…"
            />
          </div>
        </div>
        {reports.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>RESIDENT</th>
                  <th>CONTACT</th>
                  <th>SERVICE ADDRESS</th>
                  <th>ACCOUNT NUMBER</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Map(reports.map((r) => [r.name + r.phone, r])).values(),
                )
                  .filter((r) =>
                    [r.name, r.phone, r.address].some((v) =>
                      v.toLowerCase().includes(query.toLowerCase()),
                    ),
                  )
                  .map((r) => (
                    <tr key={r.id}>
                      <td>
                        <b>{r.name}</b>
                      </td>
                      <td>{r.phone}</td>
                      <td>
                        {r.address}
                        <small>{r.barangay}</small>
                      </td>
                      <td>{r.account || "Not provided"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No customer records yet"
            description="Resident details will appear when reports are submitted."
          />
        )}
      </div>
    </>
  );
}
