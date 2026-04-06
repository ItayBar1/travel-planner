'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createStop(formData: FormData) {
  const supabase = await createClient();

  const { data: maxStop } = await supabase
    .from('stops')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle();

  const order_index = (maxStop?.order_index ?? -1) + 1;

  await supabase.from('stops').insert({
    name: formData.get('name') as string,
    country: formData.get('country') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
    type: (formData.get('type') as string) || 'city',
    order_index,
  });

  revalidatePath('/');
}

export async function updateStop(formData: FormData) {
  const supabase = await createClient();

  await supabase
    .from('stops')
    .update({
      name: formData.get('name') as string,
      country: formData.get('country') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      type: formData.get('type') as string,
    })
    .eq('id', formData.get('id') as string);

  revalidatePath('/');
}

export async function deleteStop(id: string) {
  const supabase = await createClient();
  await supabase.from('stops').delete().eq('id', id);
  revalidatePath('/');
}

export async function reorderStops(items: { id: string; order_index: number }[]) {
  const supabase = await createClient();
  await Promise.all(
    items.map(({ id, order_index }) =>
      supabase.from('stops').update({ order_index }).eq('id', id)
    )
  );
  revalidatePath('/');
}
