"use client";
import { ClipboardList } from "lucide-react";
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty">
      <ClipboardList size={36} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
