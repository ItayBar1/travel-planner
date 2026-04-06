"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "ציר זמן", icon: TimelineIcon },
  { href: "/map", label: "מפה", icon: MapIcon },
  { href: "/budget", label: "תקציב", icon: BudgetIcon },
  { href: "/checklist", label: "צ'קליסט", icon: ChecklistIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar — right side (RTL) */}
      <aside className="hidden md:flex flex-col w-60 bg-[var(--color-surface-container)] border-l border-[var(--color-outline-variant)] shrink-0 order-last">
        <div className="px-6 py-8">
          <span className="text-[var(--color-primary)] font-bold text-xl tracking-tight">
            ✈ מתכנן הטיול
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[1.5rem_0.75rem_2rem_1rem] transition-colors text-sm font-medium ${
                  active
                    ? "bg-[var(--color-primary-container)] text-[var(--color-primary)]"
                    : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)]"
                }`}
              >
                <Icon active={active} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto min-w-0">
        <div className="flex-1 overflow-auto pb-16 md:pb-0">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 flex bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] z-50">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-on-surface-variant)]"
                }`}
              >
                <Icon active={active} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function BudgetIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function ChecklistIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
