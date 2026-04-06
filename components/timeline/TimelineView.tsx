'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Stop, Transport } from '@/lib/types';
import { reorderStops } from '@/app/actions/stops';
import { StopCard } from './StopCard';
import { TransportRow } from './TransportRow';
import { StopForm } from './StopForm';
import { TransportForm } from './TransportForm';
import { StopDrawer } from '../drawer/StopDrawer';

interface Props {
  stops: Stop[];
  transports: Transport[];
}

export function TimelineView({ stops: initialStops, transports }: Props) {
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [openStopId, setOpenStopId] = useState<string | null>(null);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [addTransportBetween, setAddTransportBetween] = useState<{
    fromId: string;
    toId: string;
  } | null>(null);
  const [, startReorderTransition] = useTransition();

  // Sync with server-refreshed data (after mutations via revalidatePath)
  useEffect(() => {
    setStops(initialStops);
  }, [initialStops]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex(s => s.id === active.id);
    const newIndex = stops.findIndex(s => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newStops = arrayMove(stops, oldIndex, newIndex);
    setStops(newStops); // Optimistic update

    startReorderTransition(async () => {
      await reorderStops(newStops.map((s, i) => ({ id: s.id, order_index: i })));
    });
  }

  const openStop = stops.find(s => s.id === openStopId) ?? null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">ציר זמן</h1>
        <button
          onClick={() => setShowAddStop(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:bg-[var(--color-primary-dim)] transition-colors"
        >
          <span>+</span>
          <span>הוסף עצירה</span>
        </button>
      </div>

      {/* Empty state */}
      {stops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">✈</div>
          <p className="text-[var(--color-on-surface-variant)] mb-2">אין עצירות עדיין</p>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            לחץ על &quot;הוסף עצירה&quot; כדי להתחיל את התכנון
          </p>
        </div>
      )}

      {/* Timeline list */}
      {stops.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stops.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col">
              {stops.map((stop, index) => {
                const prevStop = index > 0 ? stops[index - 1] : null;
                const transportBefore = prevStop
                  ? transports.find(
                      t => t.from_stop_id === prevStop.id && t.to_stop_id === stop.id
                    ) ?? null
                  : null;

                return (
                  <div key={stop.id}>
                    {index > 0 && prevStop && (
                      <TransportRow
                        transport={transportBefore}
                        fromStopId={prevStop.id}
                        toStopId={stop.id}
                        onAddTransport={() =>
                          setAddTransportBetween({ fromId: prevStop.id, toId: stop.id })
                        }
                      />
                    )}
                    <StopCard
                      stop={stop}
                      onEdit={() => setEditingStop(stop)}
                      onOpenDrawer={() => setOpenStopId(stop.id)}
                    />
                  </div>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      {showAddStop && <StopForm onClose={() => setShowAddStop(false)} />}
      {editingStop && <StopForm stop={editingStop} onClose={() => setEditingStop(null)} />}
      {addTransportBetween && (
        <TransportForm
          fromStopId={addTransportBetween.fromId}
          toStopId={addTransportBetween.toId}
          onClose={() => setAddTransportBetween(null)}
        />
      )}

      {/* Stop details drawer */}
      <StopDrawer stop={openStop} onClose={() => setOpenStopId(null)} />
    </div>
  );
}
