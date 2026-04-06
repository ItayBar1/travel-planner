'use client';

import { useTransition } from 'react';
import { Activity, ActivityType } from '@/lib/types';
import { createActivity, updateActivity } from '@/app/actions/activities';

interface Props {
  stopId: string;
  activity?: Activity;
  defaultType?: ActivityType;
  onClose: () => void;
  onSaved: () => void;
}

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'activity', label: 'פעילות' },
  { value: 'restaurant', label: 'מסעדה' },
  { value: 'reminder', label: 'תזכורת' },
];

export function ActivityForm({ stopId, activity, defaultType = 'activity', onClose, onSaved }: Props) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!activity;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      if (isEdit) {
        await updateActivity(formData);
      } else {
        await createActivity(formData);
      }
      onSaved();
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[var(--color-surface-container)] rounded-t-[2rem] md:rounded-[2rem_1rem_2rem_1.5rem] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[var(--color-on-surface)] mb-5">
          {isEdit ? 'עריכה' : 'הוסף פריט'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="stop_id" value={stopId} />
          {isEdit && <input type="hidden" name="id" value={activity.id} />}

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">שם</span>
            <input
              type="text"
              name="name"
              required
              defaultValue={activity?.name}
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">סוג</span>
            <select
              name="type"
              defaultValue={activity?.type ?? defaultType}
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            >
              {ACTIVITY_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-[var(--color-on-surface-variant)]">קישור (אופציונלי)</span>
            <input
              type="url"
              name="url"
              defaultValue={activity?.url ?? ''}
              placeholder="https://..."
              className="bg-[var(--color-surface-container-high)] rounded-xl px-3 py-2 text-[var(--color-on-surface)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
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
