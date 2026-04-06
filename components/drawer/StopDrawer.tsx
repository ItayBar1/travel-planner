'use client';

import { useTransition } from 'react';
import { useState } from 'react';
import { Stop, Activity, ActivityType } from '@/lib/types';
import { deleteActivity } from '@/app/actions/activities';
import { useActivities } from '@/hooks/useActivities';
import { ActivityForm } from './ActivityForm';

interface Props {
  stop: Stop | null;
  onClose: () => void;
}

const SECTION_CONFIG: { type: ActivityType; title: string; emptyLabel: string; addLabel: string }[] = [
  { type: 'activity', title: 'פעילויות', emptyLabel: 'אין פעילויות עדיין', addLabel: 'הוסף פעילות' },
  { type: 'restaurant', title: 'מסעדות', emptyLabel: 'אין מסעדות עדיין', addLabel: 'הוסף מסעדה' },
  { type: 'reminder', title: 'תזכורות', emptyLabel: 'אין תזכורות עדיין', addLabel: 'הוסף תזכורת' },
];

export function StopDrawer({ stop, onClose }: Props) {
  const { activities, loading, refresh } = useActivities(stop?.id ?? null);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(undefined);
  const [addingType, setAddingType] = useState<ActivityType | null>(null);

  if (!stop) return null;

  function handleFormClose() {
    setEditingActivity(undefined);
    setAddingType(null);
  }

  function handleSaved() {
    refresh();
  }

  return (
    <>
      {/* Overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`פרטי עצירה: ${stop.name}`}
        className="fixed inset-0 z-50 flex"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="flex-1 bg-black/40 backdrop-blur-sm" />

        {/* Panel */}
        <div
          className="relative w-full max-w-lg h-full bg-[var(--color-surface)] flex flex-col shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-outline-variant)]/40">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-[var(--color-on-surface)] truncate">{stop.name}</h2>
              <p className="text-sm text-[var(--color-on-surface-variant)]">{stop.country}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="סגור"
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] hover:text-[var(--color-on-surface)] transition-colors text-lg"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
            {loading ? (
              <div className="flex flex-col gap-3 pt-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-[var(--color-surface-container)] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              SECTION_CONFIG.map(({ type, title, emptyLabel, addLabel }) => (
                <ActivitySection
                  key={type}
                  title={title}
                  emptyLabel={emptyLabel}
                  addLabel={addLabel}
                  items={activities.filter(a => a.type === type)}
                  onAdd={() => setAddingType(type)}
                  onEdit={setEditingActivity}
                  onDelete={refresh}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity form modal */}
      {(addingType !== null || editingActivity !== undefined) && (
        <ActivityForm
          stopId={stop.id}
          activity={editingActivity}
          defaultType={addingType ?? editingActivity?.type ?? 'activity'}
          onClose={handleFormClose}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}

interface SectionProps {
  title: string;
  emptyLabel: string;
  addLabel: string;
  items: Activity[];
  onAdd: () => void;
  onEdit: (activity: Activity) => void;
  onDelete: () => void;
}

function ActivitySection({ title, emptyLabel, addLabel, items, onAdd, onEdit, onDelete }: SectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wide">
          {title}
        </h3>
        <button
          onClick={onAdd}
          className="text-xs text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] px-3 py-1 rounded-full transition-colors"
        >
          + {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-on-surface-variant)] italic py-2">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map(item => (
            <ActivityItem
              key={item.id}
              activity={item}
              onEdit={onEdit}
              onDeleted={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

interface ItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDeleted: () => void;
}

function ActivityItem({ activity, onEdit, onDeleted }: ItemProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteActivity(activity.id);
      onDeleted();
    });
  }

  return (
    <li className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-surface-container)] group">
      <span className="flex-1 text-sm text-[var(--color-on-surface)] truncate">
        {activity.url ? (
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            {activity.name}
          </a>
        ) : (
          activity.name
        )}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(activity)}
          className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] px-2 py-0.5 rounded-lg hover:bg-[var(--color-primary-container)] transition-colors"
        >
          ערוך
        </button>
        {confirmDelete ? (
          <>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs text-[var(--color-secondary)] px-2 py-0.5 rounded-lg bg-[var(--color-secondary-container)] transition-colors"
            >
              {isPending ? '...' : 'כן'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-lg hover:bg-[var(--color-surface-container-highest)] transition-colors"
            >
              לא
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="מחק פריט"
            className="text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] px-2 py-0.5 rounded-lg hover:bg-[var(--color-secondary-container)] transition-colors"
          >
            מחק
          </button>
        )}
      </div>
    </li>
  );
}
