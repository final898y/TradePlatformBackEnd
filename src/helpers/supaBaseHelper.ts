import env from '../configs/env.js';
import { createClient } from '@supabase/supabase-js';
import { Database, Tables } from '../model/supabaseModel.js';

type users = Tables<'users'>;
type TableNames = keyof Database['public']['Tables'];

type QueryResult<T> = { success: true; data: T[] } | { success: false; error: string };
const SUPABASE_URL = 'https://mcvqgvjxfhohqrhwzkyq.supabase.co';

export const supabase = createClient<Database>(SUPABASE_URL, env.SUPABASE_KEY);

export async function getUserIdByUuid(userUuid: string): Promise<number | null> {
  const { data, error } = await supabase.from('users').select('id').eq('uuid', userUuid).single();

  if (error || !data) return null;
  return data.id;
}

export async function queryTable<T>(
  tableName: TableNames,
  selectColumn: string,
  filterColumn: string,
  filterValue: string,
): Promise<QueryResult<T>> {
  const { data, error } = await supabase
    .from(tableName)
    .select(selectColumn)
    .eq(filterColumn, filterValue);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as T[] };
}
