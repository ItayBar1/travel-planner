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

const TYPE_COLOR: Record<StopType, string> = {
  city: 'var(--color-primary)',
  attraction: 'var(--color-secondary)',
  transport_hub: 'var(--color-tertiary)',
};

const TYPE_BORDER: Record<StopType, string> = {
  city: 'rgba(82,242,245,0.22)',
  attraction: 'rgba(255,115,76,0.22)',
  transport_hub: 'rgba(255,155,248,0.22)',
};

const HERO_GRADIENTS = [
  'radial-gradient(circle at 30% 50%, rgba(82,242,245,0.18) 0%, transparent 65%), linear-gradient(135deg, #0d3d3e 0%, #111419 100%)',
  'radial-gradient(circle at 70% 40%, rgba(255,115,76,0.18) 0%, transparent 65%), linear-gradient(135deg, #3d1a0e 0%, #111419 100%)',
  'radial-gradient(circle at 40% 60%, rgba(255,155,248,0.15) 0%, transparent 65%), linear-gradient(135deg, #3d0039 0%, #111419 100%)',
  'radial-gradient(circle at 60% 30%, rgba(82,242,245,0.10) 0%, transparent 65%), linear-gradient(135deg, #0a2a2b 0%, #111419 100%)',
];

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
  index: number;
  onEdit: () => void;
  onOpenDrawer: () => void;
}

export function StopCard({ stop, index, onEdit, onOpenDrawer }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stop.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEven = index % 2 === 0;
  const heroGradient = HERO_GRADIENTS[index % HERO_GRADIENTS.length];
  const mobileTilt = isEven ? 'rotate-[1deg]' : '-rotate-[1.5deg]';
  const accentColor = TYPE_COLOR[stop.type];
  const borderColor = TYPE_BORDER[stop.type];

  function handleDelete() {
    startTransition(async () => {
      await deleteStop(stop.id);
    });
  }

  return (
    /*
     * Mobile:  flex justify-start/end  →  88% wide card, polaroid tilt
     * Desktop: block                   →  full width, no tilt (layout handled by TimelineView)
     */
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex ${isEven ? 'justify-start' : 'justify-end'} md:block`}
    >
      {/* Inner card — mobile: 88% + tilt; desktop: full-width, no tilt */}
      <div
        className={`relative w-[88%] md:w-full group ${mobileTilt} md:rotate-0 hover:rotate-0 transition-transform duration-500`}
      >
        {/* Hover glow */}
        <div
          className="absolute -inset-1 rounded-[2rem_1rem_3rem_1.5rem] blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `linear-gradient(135deg, ${accentColor}18, var(--color-tertiary)18)`,
          }}
        />

        {/* Card body */}
        <div
          className="relative bg-[var(--color-surface-container-high)] rounded-[2rem_1rem_3rem_1.5rem] shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.45)' }}
        >
          {/* Drag handle */}
          <div
            {...listeners}
            className="absolute start-3 top-3 z-10 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing touch-none p-1"
            onClick={(e) => e.stopPropagation()}
            aria-label="גרור לסידור מחדש"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="text-[var(--color-on-surface-variant)]"
            >
              <circle cx="5" cy="4" r="1.5" />
              <circle cx="11" cy="4" r="1.5" />
              <circle cx="5" cy="8" r="1.5" />
              <circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="11" cy="12" r="1.5" />
            </svg>
          </div>

          {/* Hero area */}
          <div
            className="relative h-44 md:h-52 overflow-hidden cursor-pointer"
            style={{ background: heroGradient }}
            onClick={onOpenDrawer}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-container-high)] to-transparent" />
            <div className="absolute bottom-3 end-4">
              <span
                className="font-label text-xs px-3 py-1 rounded-sm backdrop-blur-md"
                style={{
                  background: `${accentColor}22`,
                  color: accentColor,
                  border: `1px solid ${borderColor}`,
                }}
              >
                {formatDate(stop.start_date)} – {formatDate(stop.end_date)}
              </span>
            </div>
          </div>

          {/* Text content */}
          <div className="p-5 cursor-pointer" onClick={onOpenDrawer}>
            <h3
              className="font-headline text-2xl md:text-3xl mb-1 glow-cyan"
              style={{ color: accentColor }}
            >
              {stop.name}
            </h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm mb-4 leading-relaxed">
              {stop.country} · {stayDuration(stop.start_date, stop.end_date)}
            </p>

            <div className="flex items-center justify-between">
              <span
                className="font-label px-3 py-1 text-[10px] font-bold rounded-full"
                style={{
                  background: `${accentColor}18`,
                  color: accentColor,
                  border: `1px solid ${borderColor}`,
                }}
              >
                {TYPE_LABEL[stop.type]}
              </span>

              {/* Actions — visible on hover */}
              <div
                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={onEdit}
                  className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] px-2 py-1 rounded-lg hover:bg-[var(--color-primary-container)] transition-colors"
                >
                  ערוך
                </button>
                {confirmDelete ? (
                  <>
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="text-xs text-[var(--color-secondary)] px-2 py-1 rounded-lg bg-[var(--color-secondary-container)] transition-colors"
                    >
                      {isPending ? '...' : 'כן, מחק'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs text-[var(--color-on-surface-variant)] px-2 py-1 rounded-lg hover:bg-[var(--color-surface-container-highest)] transition-colors"
                    >
                      ביטול
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    aria-label="מחק"
                    className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] px-2 py-1 rounded-lg hover:bg-[var(--color-secondary-container)] transition-colors"
                  >
                    מחק
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
