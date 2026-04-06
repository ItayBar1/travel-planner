'use client';

import { useTransition } from 'react';
import { TransportType } from '@/lib/types';
import { createTransport } from '@/app/actions/transport';

interface Props {
  fromStopId: string;
  toStopId: string;
  onClose: () => void;
}

const TRANSPORT_TYPES: { value: TransportType; label: string }[] = [
  { value: 'flight', label: '✈ טיסה' },
  { value: 'train', label: '🚂 רכבת' },
  { value: 'bus', label: '🚌 אוטובוס' },
  { value: 'car', label: '🚗 מכונית' },
  { value: 'boat', label: '🚢 ספינה' },
  { value: 'other', label: '→ אחר' },
];

export function TransportForm({ fromStopId, toStopId, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createTransport(formData);
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[var(--color-surface-container)] rounded-t-[2rem] md:rounded-[2rem_1rem_2rem_1.5rem] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-5">הוסף תחבורה</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="from_stop_id" value={fromStopId} />
          <input type="hidden" name="to_stop_id" value={toStopId} />

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">סוג תחבורה</span>
            <select
              name="type"
              required
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            >
              {TRANSPORT_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-[var(--color-on-surface-variant)]">משך (שעות)</span>
              <input
                type="number"
                name="duration_hours"
                min="0"
                step="0.5"
                placeholder="למשל 3.5"
                className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-[var(--color-on-surface-variant)]">עלות (₪)</span>
              <input
                type="number"
                name="cost"
                min="0"
                step="0.01"
                placeholder="למשל 250"
                className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">הערות (אופציונלי)</span>
            <textarea
              name="notes"
              rows={2}
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 resize-none"
            />
          </label>

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:bg-[var(--color-primary-dim)] disabled:opacity-50 transition-colors"
            >
              {isPending ? 'שומר...' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
