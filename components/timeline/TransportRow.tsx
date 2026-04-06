'use client';

import { useTransition } from 'react';
import { Transport, TransportType } from '@/lib/types';
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

interface Props {
  transport: Transport | null;
  fromStopId: string;
  toStopId: string;
  onAddTransport: () => void;
}

export function TransportRow({ transport, onAddTransport }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!transport) return;
    startTransition(async () => {
      await deleteTransport(transport.id);
    });
  }

  return (
    <div className="flex flex-col items-center py-1 gap-1">
      {/* Vertical connector line */}
      <div className="w-px h-3 bg-[var(--color-outline-variant)]" />

      {transport ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-container-low)] rounded-full text-sm group">
          <span>{TYPE_ICON[transport.type as TransportType]}</span>
          <span className="text-[var(--color-on-surface-variant)]">{TYPE_LABEL[transport.type as TransportType]}</span>
          {transport.duration_hours != null && (
            <span className="text-[var(--color-on-surface-variant)]">· {transport.duration_hours} ש׳</span>
          )}
          {transport.cost != null && (
            <span className="text-[var(--color-on-surface-variant)]">· ₪{transport.cost}</span>
          )}
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
          className="flex items-center gap-1 text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] px-3 py-1 rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
        >
          <span>+</span>
          <span>הוסף תחבורה</span>
        </button>
      )}

      <div className="w-px h-3 bg-[var(--color-outline-variant)]" />
    </div>
  );
}
