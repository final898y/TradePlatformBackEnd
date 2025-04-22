import { createClient } from '@supabase/supabase-js';
import { Database, Tables } from '../model/supabaseModel.js';

type users = Tables<'users'>;
type TableNames = keyof Database['public']['Tables'];

type QueryResult<T> = { success: true; data: T[] } | { success: false; error: string };
const SUPABASE_URL = 'https://mcvqgvjxfhohqrhwzkyq.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdnFndmp4ZmhvaHFyaHd6a3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MDA3NDEsImV4cCI6MjA2MDQ3Njc0MX0.ilKmeMYh_1BUcKPNBihSCeCgmEEsLPiAyTGPMaHizpQ';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

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
