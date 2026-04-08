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
import { Stop, Transport, Activity } from '@/lib/types';
import { reorderStops } from '@/app/actions/stops';
import { StopCard } from './StopCard';
import { TransportRow } from './TransportRow';
import { TimedEventRow } from './TimedEventRow';
import { StopForm } from './StopForm';
import { TransportForm } from './TransportForm';
import { StopDrawer } from '../drawer/StopDrawer';

interface Props {
  stops: Stop[];
  transports: Transport[];
  timedActivities?: Activity[];
}

// Desktop side-notebook panel shown next to each stop card
function SideNotebook({
  stop,
  timedEvents,
  isEven,
}: {
  stop: Stop;
  timedEvents: Activity[];
  isEven: boolean;
}) {
  const tilt = isEven ? 'rotate-[3deg]' : '-rotate-[2deg]';
  const borderSide = isEven ? 'border-s-4' : 'border-e-4';

  return (
    <div
      className={`${tilt} bg-[var(--color-surface-container-low)] p-6 rounded-[3rem_1rem_2rem_1rem] ${borderSide} border-[var(--color-primary)]/30 shadow-inner mt-6 transition-transform hover:rotate-0 duration-500`}
    >
      <h4 className="font-headline text-base text-[var(--color-primary)] mb-3 flex items-center gap-2">
        <span>📓</span>
        <span>מחברת פנימית</span>
      </h4>

      {timedEvents.length > 0 ? (
        <ul className="space-y-2">
          {timedEvents.slice(0, 4).map((e) => (
            <li
              key={e.id}
              className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]"
            >
              <span className="w-1.5 h-1.5 mt-1.5 bg-[var(--color-primary)] rounded-full shrink-0" />
              <span className="truncate">{e.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--color-on-surface-variant)] italic leading-relaxed">
          {stop.country} — לחץ על הכרטיס לפרטים ופעילויות
        </p>
      )}
    </div>
  );
}

export function TimelineView({
  stops: initialStops,
  transports,
  timedActivities: initialTimedActivities = [],
}: Props) {
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [timedActivities, setTimedActivities] = useState<Activity[]>(initialTimedActivities);
  const [openStopId, setOpenStopId] = useState<string | null>(null);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [showAddStop, setShowAddStop] = useState(false);
  const [addTransportBetween, setAddTransportBetween] = useState<{
    fromId: string;
    toId: string;
  } | null>(null);
  const [, startReorderTransition] = useTransition();

  useEffect(() => {
    setStops(initialStops);
  }, [initialStops]);
  useEffect(() => {
    setTimedActivities(initialTimedActivities);
  }, [initialTimedActivities]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = stops.findIndex((s) => s.id === active.id);
    const newIndex = stops.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newStops = arrayMove(stops, oldIndex, newIndex);
    setStops(newStops);
    startReorderTransition(async () => {
      await reorderStops(newStops.map((s, i) => ({ id: s.id, order_index: i })));
    });
  }

  function getStopTimedEvents(stopId: string): Activity[] {
    return timedActivities
      .filter((a) => a.stop_id === stopId)
      .sort((a, b) =>
        ((a.event_date ?? '') + (a.event_time ?? '')).localeCompare(
          (b.event_date ?? '') + (b.event_time ?? '')
        )
      );
  }

  const openStop = stops.find((s) => s.id === openStopId) ?? null;

  return (
    <div className="px-4 md:px-8 lg:px-12 max-w-2xl md:max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-10 text-right">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-[var(--color-on-surface)] mb-1">
          טיול דרום מזרח אסיה
        </h2>
        <p className="font-label text-sm text-white/40 tracking-[0.15em] uppercase">
          ציר הזמן של המסע
        </p>
      </div>

      {/* Empty state */}
      {stops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">✈</div>
          <p className="text-[var(--color-on-surface-variant)] mb-2">אין עצירות עדיין</p>
          <p className="text-sm text-[var(--color-on-surface-variant)]">לחץ על + כדי להתחיל</p>
        </div>
      )}

      {/* Timeline */}
      {stops.length > 0 && (
        <div className="relative">
          {/* SVG winding path — mobile only (desktop uses side-notebook layout) */}
          <svg
            className="md:hidden absolute top-0 start-1/2 -translate-x-1/2 w-full pointer-events-none z-0"
            style={{ height: `${stops.length * 340}px` }}
            viewBox={`0 0 100 ${stops.length * 340}`}
            preserveAspectRatio="none"
          >
            <path
              d={`M50,0 ${stops
                .map((_, i) => {
                  const y = (i + 1) * 340;
                  const x = i % 2 === 0 ? 20 : 80;
                  return `Q${x},${y - 170} 50,${y}`;
                })
                .join(' ')}`}
              fill="none"
              stroke="url(#windingMobile)"
              strokeDasharray="8 12"
              strokeWidth="2"
              opacity="0.18"
            />
            <defs>
              <linearGradient id="windingMobile" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#52f2f5" />
                <stop offset="0.5" stopColor="#ff734c" />
                <stop offset="1" stopColor="#ff9bf8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Desktop: vertical center line */}
          <div
            className="hidden md:block absolute start-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-0"
            style={{
              background: 'linear-gradient(to bottom, #52f2f5, #ff734c, #ff9bf8)',
              opacity: 0.15,
            }}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={stops.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col relative z-10">
                {stops.map((stop, index) => {
                  const prevStop = index > 0 ? stops[index - 1] : null;
                  const transportBefore = prevStop
                    ? (transports.find(
                        (t) => t.from_stop_id === prevStop.id && t.to_stop_id === stop.id
                      ) ?? null)
                    : null;
                  const stopTimedEvents = getStopTimedEvents(stop.id);
                  const isEven = index % 2 === 0;
                  const nodeColor = isEven ? '#52f2f5' : '#ff734c';

                  return (
                    <div key={stop.id}>
                      {index > 0 && prevStop && (
                        <TransportRow
                          transport={transportBefore}
                          fromStop={prevStop}
                          toStopId={stop.id}
                          onAddTransport={() =>
                            setAddTransportBetween({ fromId: prevStop.id, toId: stop.id })
                          }
                        />
                      )}

                      {/* Desktop connector node */}
                      <div className="hidden md:flex justify-center mb-4">
                        <div
                          className="w-4 h-4 rounded-full z-20 ring-4 ring-[var(--color-background)]"
                          style={{ background: nodeColor, boxShadow: `0 0 14px ${nodeColor}` }}
                        />
                      </div>

                      {/*
                       * MOBILE:  StopCard handles its own stagger (justify-start/end + tilt)
                       * DESKTOP: 2-column layout — card (flex-1) + side notebook (w-56)
                       *          alternates: even = card right / note left; odd = card left / note right
                       */}
                      <div
                        className={`md:flex md:items-start md:gap-10 mb-6 md:mb-16 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                      >
                        {/* Stop card */}
                        <div className="md:flex-1 md:min-w-0">
                          <StopCard
                            stop={stop}
                            index={index}
                            onEdit={() => setEditingStop(stop)}
                            onOpenDrawer={() => setOpenStopId(stop.id)}
                          />
                          {/* Timed events — shown below card on both viewports */}
                          {stopTimedEvents.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-1 mb-2 px-3">
                              {stopTimedEvents.map((a) => (
                                <TimedEventRow key={a.id} activity={a} />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Desktop-only side notebook */}
                        <div className="hidden md:block md:w-56 md:shrink-0">
                          <SideNotebook stop={stop} timedEvents={stopTimedEvents} isEven={isEven} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
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

      <StopDrawer stop={openStop} onClose={() => setOpenStopId(null)} />

      {/* FAB — add stop */}
      <button
        onClick={() => setShowAddStop(true)}
        className="fixed bottom-24 md:bottom-8 end-6 w-14 h-14 rounded-full flex items-center justify-center text-[var(--color-on-primary)] text-2xl font-bold hover:scale-110 active:scale-95 transition-all z-40 shadow-[0_0_20px_rgba(82,242,245,0.35)]"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
        }}
        aria-label="הוסף עצירה"
      >
        +
      </button>
    </div>
  );
}
