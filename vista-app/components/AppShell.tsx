"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_STORAGE_KEY = "vista-sidebar-open";

function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

const sidebarSections: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Модули",
    links: [
      { href: "/rca", label: "RCA" },
      { href: "/copilot", label: "Employee CoPilot" },
      { href: "/calculator", label: "HF-Calculator" },
      { href: "/anomalies", label: "Real-time Anomaly Detector" },
      { href: "/digital-twin", label: "Digital Twin & Strategic Simulator" },
    ],
  },
  {
    title: "Управление",
    links: [
      { href: "/analytics", label: "Аналитика" },
      { href: "/risk-management", label: "Риск-менеджмент" },
      { href: "/reports", label: "Отчеты" },
    ],
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) setSidebarOpen(stored === "true");
  }, []);

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    if (typeof localStorage !== "undefined") localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className="fixed left-0 top-14 z-40 w-10 h-10 flex items-center justify-center bg-[var(--sidebar)] text-white rounded-r shadow hover:bg-[var(--header-hover)] transition-colors"
        aria-label={sidebarOpen ? "Свернуть сайдбар" : "Развернуть сайдбар"}
      >
        {sidebarOpen ? <IconChevronLeft /> : <IconChevronRight />}
      </button>
      <aside
        className={`fixed left-0 top-14 bottom-0 z-30 bg-[var(--sidebar)] text-white transition-[width] duration-200 overflow-hidden flex flex-col ${
          sidebarOpen ? "w-[var(--sidebar-width)]" : "w-0"
        }`}
      >
        <div className="p-3 flex items-center gap-2 border-b border-white/10">
          <IconMenu />
          {sidebarOpen && <span className="text-sm font-medium">Навигация</span>}
        </div>
        <nav className="flex-1 overflow-y-auto sidebar-scroll p-3">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              {sidebarOpen && (
                <div className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </div>
              )}
              <ul className="space-y-0.5">
                {section.links.map(({ href, label }) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        title={label}
                        className={`block px-3 py-2 rounded text-sm transition-colors ${
                          isActive ? "bg-white/20" : "hover:bg-white/10"
                        }`}
                      >
                        {sidebarOpen ? label : ""}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main
        className="flex-1 min-h-[calc(100vh-3.5rem)] transition-[padding-left] duration-200"
        style={{ paddingLeft: sidebarOpen ? "var(--sidebar-width)" : "2.5rem" }}
      >
        <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </>
  );
}
