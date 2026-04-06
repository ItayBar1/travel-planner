'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createTransport(formData: FormData) {
  const supabase = await createClient();

  const durationStr = formData.get('duration_hours') as string;
  const costStr = formData.get('cost') as string;

  await supabase.from('transport').insert({
    from_stop_id: formData.get('from_stop_id') as string,
    to_stop_id: formData.get('to_stop_id') as string,
    type: formData.get('type') as string,
    duration_hours: durationStr ? Number(durationStr) : null,
    cost: costStr ? Number(costStr) : null,
    notes: (formData.get('notes') as string) || null,
  });

  revalidatePath('/');
}

export async function deleteTransport(id: string) {
  const supabase = await createClient();
  await supabase.from('transport').delete().eq('id', id);
  revalidatePath('/');
}
