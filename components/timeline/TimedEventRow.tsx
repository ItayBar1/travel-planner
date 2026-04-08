'use client';

import { Activity } from '@/lib/types';

function formatEventDateTime(eventDate: string, eventTime: string | null): string {
  const [y, m, d] = eventDate.split('-').map(Number);
  const dateStr = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'short' }).format(
    new Date(y, m - 1, d)
  );
  if (!eventTime) return dateStr;
  return `${dateStr} · ${eventTime.slice(0, 5)}`;
}

interface Props {
  activity: Activity;
}

export function TimedEventRow({ activity }: Props) {
  if (!activity.event_date) return null;

  return (
    <div className="flex items-center gap-3 mx-4 px-4 py-2.5 border-s-2 border-[var(--color-tertiary)] bg-[var(--color-tertiary-container)]/20 rounded-e-[1rem_0.5rem_1rem_0.5rem]">
      <span className="text-base shrink-0" aria-hidden>
        🗓
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-on-surface)] truncate">
          {activity.url ? (
            <a
              href={activity.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] underline-offset-2 hover:underline"
            >
              {activity.name}
            </a>
          ) : (
            activity.name
          )}
        </p>
        <p className="text-xs text-[var(--color-tertiary)] font-medium mt-0.5">
          {formatEventDateTime(activity.event_date, activity.event_time)}
        </p>
      </div>
    </div>
  );
}
