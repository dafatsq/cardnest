"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // We use a dynamic import to lazily create the Supabase client.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Lazily create the supabase client inside the effect so it only
    // runs on the client, not during static prerendering.
    const init = async () => {
      const { createClient } = await import("@/lib/supabase/client")
      const client = createClient()
      setSupabase(() => client)

      const {
        data: { user },
      } = await client.auth.getUser()
      setUser(user)
      setLoading(false)

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event: string, session: Session | null) => {
        setUser(session?.user ?? null)
        router.refresh()
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    const cleanup = init()

    return () => {
      cleanup.then((cb) => cb?.())
    }
  }, [router])

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
