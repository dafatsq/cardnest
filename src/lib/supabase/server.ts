import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./client"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const cookie of cookiesToSet) {
              cookieStore.set(cookie.name, cookie.value, cookie.options)
            }
          } catch {
            // The `set` method was called from a React Server Component.
            // This can be ignored if there is a standalone script that
            // loads the page.
          }
        },
      },
    },
  )
}
