export const ISSUE_TYPES = [
  "Water leak",
  "Broken pipe",
  "Low pressure",
  "Discolored water",
  "No water supply",
  "Other issue",
];
export const REPORT_STATUSES = [
  "Submitted",
  "Assigned",
  "In Progress",
  "Resolved",
];
export const formatTimestamp = (s: string) =>
  new Date(s).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  });
