'use client';

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Activity } from '@/lib/types';

export function useActivities(stopId: string | null) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, startFetch] = useTransition();

  function doFetch(id: string) {
    startFetch(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('stop_id', id)
        .order('created_at');
      setActivities((data as Activity[]) ?? []);
    });
  }

  useEffect(() => {
    if (!stopId) return;
    doFetch(stopId);
  }, [stopId]);

  function refresh() {
    if (stopId) doFetch(stopId);
  }

  return { activities, loading, refresh };
}
