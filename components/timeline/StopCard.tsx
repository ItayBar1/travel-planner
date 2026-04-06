'use client';

import { useState, useTransition } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Stop, StopType } from '@/lib/types';
import { deleteStop } from '@/app/actions/stops';

const TYPE_LABEL: Record<StopType, string> = {
  city: 'עיר',
  attraction: 'אטרקציה',
  transport_hub: 'צומת תחבורה',
};

const TYPE_STYLE: Record<StopType, string> = {
  city: 'bg-[var(--color-primary-container)] text-[var(--color-primary)]',
  attraction: 'bg-[var(--color-secondary-container)] text-[var(--color-secondary)]',
  transport_hub: 'bg-[var(--color-tertiary-container)] text-[var(--color-tertiary)]',
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'short' }).format(
    new Date(y, m - 1, d)
  );
}

function stayDuration(start: string, end: string): string {
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  const nights = Math.round(
    (new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime()) / 86400000
  );
  return nights === 1 ? 'לילה אחד' : `${nights} לילות`;
}

interface Props {
  stop: Stop;
  onEdit: () => void;
  onOpenDrawer: () => void;
}

export function StopCard({ stop, onEdit, onOpenDrawer }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stop.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleDelete() {
    startTransition(async () => {
      await deleteStop(stop.id);
    });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group bg-[var(--color-surface-container)] rounded-[1.5rem_0.75rem_2rem_1rem] p-4 cursor-pointer hover:bg-[var(--color-surface-container-high)] transition-colors"
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute start-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing touch-none p-1"
        onClick={e => e.stopPropagation()}
        aria-label="גרור לסידור מחדש"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--color-on-surface-variant)]">
          <circle cx="5" cy="4" r="1.5" /><circle cx="11" cy="4" r="1.5" />
          <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" />
        </svg>
      </div>

      {/* Card content */}
      <div className="ps-4" onClick={onOpenDrawer}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_STYLE[stop.type]}`}>
            {TYPE_LABEL[stop.type]}
          </span>
          <h3 className="font-semibold text-[var(--color-on-surface)] flex-1 text-base leading-snug">
            {stop.name}
          </h3>
          {/* Action buttons */}
          <button
            onClick={e => { e.stopPropagation(); onEdit(); }}
            className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] px-2 py-1 rounded-lg hover:bg-[var(--color-primary-container)] transition-colors"
          >
            ערוך
          </button>
          {confirmDelete ? (
            <span className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs text-[var(--color-secondary)] hover:text-[var(--color-secondary)] px-2 py-1 rounded-lg bg-[var(--color-secondary-container)] transition-colors"
              >
                {isPending ? '...' : 'כן, מחק'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[var(--color-on-surface-variant)] px-2 py-1 rounded-lg hover:bg-[var(--color-surface-container-highest)] transition-colors"
              >
                ביטול
              </button>
            </span>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
              aria-label="מחק"
              className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] px-2 py-1 rounded-lg hover:bg-[var(--color-secondary-container)] transition-colors"
            >
              מחק
            </button>
          )}
        </div>

        <p className="text-sm text-[var(--color-on-surface-variant)]">{stop.country}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
          {formatDate(stop.start_date)} — {formatDate(stop.end_date)}
          {' '}·{' '}
          {stayDuration(stop.start_date, stop.end_date)}
        </p>
      </div>
    </div>
  );
}
