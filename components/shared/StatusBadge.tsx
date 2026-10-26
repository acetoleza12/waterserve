"use client";
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={"badge " + status.toLowerCase().replaceAll(" ", "-")}>
      <i />
      {status}
    </span>
  );
}
