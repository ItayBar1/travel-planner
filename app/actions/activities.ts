'use server';

import { createClient } from '@/lib/supabase/server';

export async function createActivity(formData: FormData) {
  const supabase = await createClient();
  const dayStr = formData.get('day_index') as string;

  await supabase.from('activities').insert({
    stop_id: formData.get('stop_id') as string,
    name: formData.get('name') as string,
    type: (formData.get('type') as string) || 'activity',
    url: (formData.get('url') as string) || null,
    day_index: dayStr ? Number(dayStr) : null,
  });
}

export async function updateActivity(formData: FormData) {
  const supabase = await createClient();
  const dayStr = formData.get('day_index') as string;

  await supabase
    .from('activities')
    .update({
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      url: (formData.get('url') as string) || null,
      day_index: dayStr ? Number(dayStr) : null,
    })
    .eq('id', formData.get('id') as string);
}

export async function deleteActivity(id: string) {
  const supabase = await createClient();
  await supabase.from('activities').delete().eq('id', id);
}
