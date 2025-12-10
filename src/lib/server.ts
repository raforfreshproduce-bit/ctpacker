import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { mapKeysToCamel } from './utils'
import { cache } from 'react'

// This is the crucial change: we use React's `cache` function
// to ensure the client is only created once per request.
export const createServerClientInstance = cache(async () => {
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
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
})

export async function fetchServerData(table: string) {
  const client = await createServerClientInstance()
  const { data, error } = await client.from(table).select('*')
  if (error) throw error
  return mapKeysToCamel(data)
}

export async function insertServerData(table: string, payload: object) {
  const client = await createServerClientInstance()
  const { data, error } = await client.from(table).insert(payload)
  if (error) throw error
  return mapKeysToCamel(data)
}

export async function deleteServerData(table: string, condition: object) {
  const client = await createServerClientInstance()
  const { data, error } = await client.from(table).delete().match(condition)
  if (error) throw error
  return mapKeysToCamel(data)
}