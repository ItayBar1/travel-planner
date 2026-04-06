import { createClient } from '@/lib/supabase/server';
import { TimelineView } from '@/components/timeline/TimelineView';
import { Stop, Transport } from '@/lib/types';

export default async function TimelinePage() {
  const supabase = await createClient();

  const [stopsResult, transportResult] = await Promise.all([
    supabase.from('stops').select('*').order('order_index'),
    supabase.from('transport').select('*'),
  ]);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        <TimelineView
          stops={(stopsResult.data ?? []) as Stop[]}
          transports={(transportResult.data ?? []) as Transport[]}
        />
      </div>
    </main>
  );
}
