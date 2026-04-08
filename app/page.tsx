import { createClient } from '@/lib/supabase/server';
import { TimelineView } from '@/components/timeline/TimelineView';
import { Stop, Transport, Activity } from '@/lib/types';

export default async function TimelinePage() {
  const supabase = await createClient();

  const [stopsResult, transportResult, activitiesResult] = await Promise.all([
    supabase.from('stops').select('*').order('order_index'),
    supabase.from('transport').select('*'),
    supabase
      .from('activities')
      .select('*')
      .not('event_date', 'is', null)
      .order('event_date')
      .order('event_time'),
  ]);

  return (
    <main className="flex-1 py-6">
      <TimelineView
        stops={(stopsResult.data ?? []) as Stop[]}
        transports={(transportResult.data ?? []) as Transport[]}
        timedActivities={(activitiesResult.data ?? []) as Activity[]}
      />
    </main>
  );
}
