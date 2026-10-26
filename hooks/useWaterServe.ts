"use client";
import type {
  StaffMember,
  IncidentReport,
  TrackingResult,
  ReportNotification,
} from "../lib/types";
import { useEffect, useState, type FormEvent } from "react";
import { exportIncidentCsv } from "../lib/export-incidents";
import { apiRequest } from "../lib/api-client";
import { REPORT_STATUSES } from "../lib/constants";
/** Coordinates navigation, form actions, polling, and browser preferences. */
export function useWaterServe() {
  // Navigation, sign-in state, and interface feedback.
  const [page, setPage] = useState("home");
  const [user, setUser] = useState<StaffMember | null>(null);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  // Shared reports and browser-local tracking shortcuts.
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [tracked, setTracked] = useState<TrackingResult | null>(null);
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState("");
  const [photo, setPhoto] = useState("");
  const [selected, setSelected] = useState<IncidentReport | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [role, setRole] = useState("admin");
  const [notifications, setNotifications] = useState<ReportNotification[]>([]);
  const showToast = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 4500);
  };
  const navigateTo = (p: string) => {
    setPage(p);
    setError("");
    setMenu(false);
    setSelected(null);
    setQuery("");
    setFilter("All statuses");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Retrieve server state without putting data access in view components.
  async function loadSession() {
    const s = await apiRequest("session");
    setUser(s.user);
    setNeedsSetup(s.needsSetup);
    return s;
  }
  async function loadWorkspace() {
    try {
      const [r, s] = await Promise.all([
        apiRequest("reports"),
        apiRequest("staff"),
      ]);
      setReports(r);
      setStaff(s);
      return r;
    } catch (e: any) {
      if (e.status === 401) {
        setUser(null);
        setPage("login");
        setSelected(null);
      }
      throw e;
    }
  }
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem("ws_codes") || "[]"));
      setRead(JSON.parse(localStorage.getItem("ws_read") || "[]"));
    } catch {}
    loadSession()
      .then((s) => {
        if (s.user) setPage("dashboard");
      })
      .catch((e) => setError(e.message))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!user) return;
    loadWorkspace().catch((e) => setError(e.message));
    const t = setInterval(() => loadWorkspace().catch(() => {}), 30000);
    return () => clearInterval(t);
  }, [user]);
  useEffect(() => {
    if (!saved.length) return;
    let active = true;
    const check = async () => {
      const result = await Promise.allSettled(
        saved.map((c) => apiRequest("track?code=" + encodeURIComponent(c))),
      );
      if (active)
        setNotifications(
          result
            .flatMap((r) =>
              r.status === "fulfilled"
                ? r.value.history.map((h: any) => ({
                    ...h,
                    code: r.value.report.code,
                    type: r.value.report.type,
                  }))
                : [],
            )
            .sort((a: any, b: any) => b.time.localeCompare(a.time)),
        );
    };
    check();
    const t = setInterval(check, 60000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [saved]);
  useEffect(() => {
    if (!tracked) return;
    const t = setInterval(
      () =>
        apiRequest("track?code=" + tracked.report.code)
          .then(setTracked)
          .catch(() => {}),
      30000,
    );
    return () => clearInterval(t);
  }, [tracked?.report?.code]);
  useEffect(() => {
    if (!selected) return;
    const latest = reports.find((r) => r.id === selected.id);
    if (latest) setSelected(latest);
  }, [reports]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const modal = document.querySelector('[role="dialog"]') as HTMLElement;
    const controls = () =>
      Array.from(
        modal?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),input,select,textarea,a[href]",
        ) || [],
      );
    controls()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(null);
        setError("");
      }
      if (e.key === "Tab") {
        const list = controls(),
          first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [!!selected]);
  // Apply the same loading and error handling to every form action.
  async function performAction(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  function remember(c: string) {
    const next = [c, ...saved.filter((s) => s !== c)].slice(0, 50);
    setSaved(next);
    localStorage.setItem("ws_codes", JSON.stringify(next));
  }
  async function trackReport(c = code) {
    await performAction(async () => {
      const r = await apiRequest("track?code=" + encodeURIComponent(c.trim()));
      setTracked(r);
      setCode(c.trim().toUpperCase());
      remember(r.report.code);
      navigateTo("track");
    });
  }
  // Resident submission and staff workflow actions.
  async function submitReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await performAction(async () => {
      const r = await apiRequest("reports", {
        ...Object.fromEntries(f),
        consent: f.get("consent") === "on",
        photo,
      });
      remember(r.code);
      setSuccess(r.code);
      setPhoto("");
      navigateTo("confirmation");
    });
  }
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await performAction(async () => {
      await apiRequest("login", { ...Object.fromEntries(f), role });
      await loadSession();
      navigateTo("dashboard");
    });
  }
  async function setup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await performAction(async () => {
      await apiRequest("setup", Object.fromEntries(f));
      setNeedsSetup(false);
      showToast("Administrator created. Sign in to continue.");
      navigateTo("login");
    });
  }
  async function updateIncident(data: any) {
    const incident = selected;
    if (!incident) return;
    await performAction(async () => {
      await apiRequest("reports/" + incident.id, data);
      const r = await loadWorkspace();
      setSelected(r.find((x: any) => x.id === incident.id));
      setPhoto("");
      showToast("Report updated. The resident can see the new status.");
    });
  }
  const nav = user
    ? [
        ["dashboard", "Overview"],
        [
          "incidents",
          user.role === "admin" ? "Incident reports" : "My work orders",
        ],
        ...(user.role === "admin"
          ? [
              ["customers", "Customers"],
              ["team", "Staff & access"],
            ]
          : []),
        ["settings", "Account"],
      ]
    : [
        ["home", "Home"],
        ["report", "Report an issue"],
        ["track", "Track a report"],
        ["myreports", "My reports"],
      ];
  const unread = notifications.filter((n) => !read.includes(n.id)).length;
  const filtered = reports.filter(
    (r) =>
      (filter === "All statuses" || r.status === filter) &&
      [r.code, r.name, r.type, r.address, r.barangay].some((v) =>
        v.toLowerCase().includes(query.toLowerCase()),
      ),
  );
  function exportReports() {
    exportIncidentCsv(filtered, staff);
  }
  function openIncident(report: IncidentReport) {
    setSelected(report);
    setPhoto("");
    setError("");
  }
  return {
    page,
    setPage,
    user,
    setUser,
    needsSetup,
    setNeedsSetup,
    ready,
    setReady,
    menu,
    setMenu,
    busy,
    setBusy,
    error,
    setError,
    toast,
    setToast,
    reports,
    setReports,
    staff,
    setStaff,
    saved,
    setSaved,
    read,
    setRead,
    tracked,
    setTracked,
    code,
    setCode,
    success,
    setSuccess,
    photo,
    setPhoto,
    selected,
    setSelected,
    query,
    setQuery,
    filter,
    setFilter,
    role,
    setRole,
    notifications,
    setNotifications,
    showToast,
    navigateTo,
    loadSession,
    loadWorkspace,
    performAction,
    remember,
    trackReport,
    submitReport,
    login,
    setup,
    updateIncident,
    nav,
    unread,
    filtered,
    exportReports,
    openIncident,
  };
}
export type WaterServeController = ReturnType<typeof useWaterServe>;
