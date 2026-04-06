'use client';

import { useTransition } from 'react';
import { Stop, StopType } from '@/lib/types';
import { createStop, updateStop } from '@/app/actions/stops';

interface Props {
  stop?: Stop;
  onClose: () => void;
}

const STOP_TYPES: { value: StopType; label: string }[] = [
  { value: 'city', label: 'עיר' },
  { value: 'attraction', label: 'אטרקציה' },
  { value: 'transport_hub', label: 'צומת תחבורה' },
];

export function StopForm({ stop, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!stop;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isEdit) {
        await updateStop(formData);
      } else {
        await createStop(formData);
      }
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
        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-5">
          {isEdit ? 'עריכת עצירה' : 'עצירה חדשה'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isEdit && <input type="hidden" name="id" value={stop.id} />}

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">שם העצירה</span>
            <input
              type="text"
              name="name"
              required
              defaultValue={stop?.name}
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">מדינה</span>
            <input
              type="text"
              name="country"
              required
              defaultValue={stop?.country}
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-[var(--color-on-surface-variant)]">תאריך התחלה</span>
              <input
                type="date"
                name="start_date"
                required
                defaultValue={stop?.start_date}
                className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-[var(--color-on-surface-variant)]">תאריך סיום</span>
              <input
                type="date"
                name="end_date"
                required
                defaultValue={stop?.end_date}
                className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">סוג</span>
            <select
              name="type"
              defaultValue={stop?.type ?? 'city'}
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            >
              {STOP_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
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
