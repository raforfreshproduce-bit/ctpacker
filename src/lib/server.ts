import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClientInstance() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function fetchServerData(table: string) {
  const client = await createServerClientInstance()
  const { data, error } = await client.from(table).select('*')
  if (error) throw error
  return data
}

export async function insertServerData(table: string, payload: object) {
  const client = await createServerClientInstance()
  const { data, error } = await client.from(table).insert(payload)
  if (error) throw error
  return data
}

export async function deleteServerData(table: string, condition: object) {
  const client = await createServerClientInstance()
  const { data, error } = await client.from(table).delete().match(condition)
  if (error) throw error
  return data
}