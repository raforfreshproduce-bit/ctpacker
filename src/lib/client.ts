import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function fetchData(table: string) {
  const client = createClient()
  const { data, error } = await client.from(table).select('*')
  if (error) throw error
  return data
}

export async function insertData(table: string, payload: object) {
  const client = createClient()
  const { data, error } = await client.from(table).insert(payload)
  if (error) throw error
  return data
}

export async function deleteData(table: string, condition: object) {
  const client = createClient()
  const { data, error } = await client.from(table).delete().match(condition)
  if (error) throw error
  return data
}