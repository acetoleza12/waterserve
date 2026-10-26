import type { IncidentReport, StaffMember } from "./types";
/** Downloads the visible incident list as a spreadsheet-safe CSV file. */
export function exportIncidentCsv(
  reports: IncidentReport[],
  staff: StaffMember[],
) {
  const esc = (v: any) =>
    '"' +
    String(v || "")
      .replaceAll('"', '""')
      .replace(/^[=+@-]/, "'") +
    '"';
  const rows = [
    [
      "Tracking code",
      "Name",
      "Contact",
      "Barangay",
      "Address",
      "Issue",
      "Status",
      "Assigned to",
      "Submitted",
    ],
    ...reports.map((r) => [
      r.code,
      r.name,
      r.phone,
      r.barangay,
      r.address,
      r.type,
      r.status,
      staff.find((s) => s.id === r.assigned)?.name || "",
      r.created,
    ]),
  ];
  const u = URL.createObjectURL(
    new Blob(["\uFEFF" + rows.map((r) => r.map(esc).join(",")).join("\r\n")], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const a = document.createElement("a");
  a.href = u;
  a.download = "waterserve-incidents.csv";
  a.click();
  URL.revokeObjectURL(u);
}
