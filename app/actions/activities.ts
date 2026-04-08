'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const dayStr = formData.get('day_index') as string;
  const eventDate = (formData.get('event_date') as string) || null;
  const eventTime = (formData.get('event_time') as string) || null;

  await supabase.from('activities').insert({
    stop_id: formData.get('stop_id') as string,
    name: formData.get('name') as string,
    type: (formData.get('type') as string) || 'activity',
    url: (formData.get('url') as string) || null,
    day_index: dayStr ? Number(dayStr) : null,
    event_date: eventDate,
    event_time: eventTime,
  });

  revalidatePath('/');
}

export async function updateActivity(formData: FormData) {
  const supabase = await createClient();
  const dayStr = formData.get('day_index') as string;
  const eventDate = (formData.get('event_date') as string) || null;
  const eventTime = (formData.get('event_time') as string) || null;

  await supabase
    .from('activities')
    .update({
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      url: (formData.get('url') as string) || null,
      day_index: dayStr ? Number(dayStr) : null,
      event_date: eventDate,
      event_time: eventTime,
    })
    .eq('id', formData.get('id') as string);

  revalidatePath('/');
}

export async function deleteActivity(id: string) {
  const supabase = await createClient();
  await supabase.from('activities').delete().eq('id', id);
  revalidatePath('/');
}
