'use client';

import { useTransition } from 'react';
import { Stop, Transport, TransportType } from '@/lib/types';
import { deleteTransport } from '@/app/actions/transport';

const TYPE_LABEL: Record<TransportType, string> = {
  flight: 'טיסה',
  train: 'רכבת',
  bus: 'אוטובוס',
  car: 'מכונית',
  boat: 'ספינה',
  other: 'אחר',
};

const TYPE_ICON: Record<TransportType, string> = {
  flight: '✈',
  train: '🚂',
  bus: '🚌',
  car: '🚗',
  boat: '🚢',
  other: '→',
};

function computeArrival(fromStop: Stop, durationHours: number): string {
  const [y, m, d] = fromStop.end_date.split('-').map(Number);
  const departureMs = new Date(y, m - 1, d).getTime();
  const arrival = new Date(departureMs + durationHours * 3_600_000);
  return new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(arrival);
}

interface Props {
  transport: Transport | null;
  fromStop: Stop;
  toStopId: string;
  onAddTransport: () => void;
}

export function TransportRow({ transport, fromStop, onAddTransport }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!transport) return;
    startTransition(async () => {
      await deleteTransport(transport.id);
    });
  }

  return (
    <div className="flex justify-center py-6 relative z-10">
      {transport ? (
        <div className="flex items-center gap-3 bg-[var(--color-surface-container-low)] px-6 py-3 rounded-full border border-white/5 shadow-lg group">
          <span className="text-xl text-[var(--color-secondary)]">
            {TYPE_ICON[transport.type as TransportType]}
          </span>
          <div className="flex flex-col">
            <span className="font-label text-xs font-medium text-[var(--color-on-surface)]/80">
              {TYPE_LABEL[transport.type as TransportType]}
              {transport.duration_hours != null && ` · ${transport.duration_hours} ש׳`}
            </span>
            {transport.duration_hours != null && (
              <span className="font-label text-[10px] text-white/30">
                מגיע {computeArrival(fromStop, transport.duration_hours)}
              </span>
            )}
            {transport.cost != null && (
              <span className="font-label text-[10px] text-white/30">₪{transport.cost}</span>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={isPending}
            aria-label="מחק תחבורה"
            className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] text-xs ms-1 transition-opacity"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={onAddTransport}
          className="flex items-center gap-1 text-xs text-white/30 hover:text-[var(--color-primary)] px-4 py-2 rounded-full border border-white/5 hover:border-[var(--color-primary)]/20 hover:bg-[var(--color-surface-container-low)] transition-all"
        >
          <span>+</span>
          <span>הוסף תחבורה</span>
        </button>
      )}
    </div>
  );
}
