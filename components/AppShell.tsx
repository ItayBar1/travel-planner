'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Timeline', icon: TimelineIcon },
  { href: '/map', label: 'Map', icon: MapIcon },
  { href: '/budget', label: 'Budget', icon: BudgetIcon },
  { href: '/checklist', label: 'Checklist', icon: ChecklistIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Ambient glow blobs */}
      <div className="fixed top-1/4 -end-20 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -start-20 w-80 h-80 bg-[var(--color-secondary)]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Fixed top header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[var(--color-background)]/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <h1 className="font-headline font-bold text-xl tracking-tight text-[var(--color-primary)] glow-cyan">
            Digital Scripter
          </h1>
        </div>

        {/* Desktop inline nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-headline text-base tracking-wide hover:scale-105 transition-all ${
                  active
                    ? 'text-[var(--color-primary)] font-bold glow-cyan'
                    : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Scrollable content — padded for fixed header + bottom nav */}
      <div className="pt-20 pb-32 md:pb-10 min-h-screen relative z-10">{children}</div>

      {/* Mobile bottom nav — glassmorphism pill */}
      <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] z-50 bg-[var(--color-surface)]/90 backdrop-blur-lg rounded-[2rem_1rem_3rem_1.5rem] border border-white/5 shadow-[0_10px_40px_rgba(82,242,245,0.1)] flex justify-around items-center px-4 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-full transition-all ${
                active
                  ? 'bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-tertiary)]/10 text-[var(--color-primary)] shadow-[0_0_15px_rgba(82,242,245,0.2)]'
                  : 'text-white/40 hover:text-[var(--color-secondary)] hover:scale-110'
              }`}
            >
              <Icon active={active} />
              <span className="font-label text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function BudgetIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function ChecklistIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
