"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
  const router = useRouter()

  // Guard: don't initialize Supabase client if env vars are missing
  // (e.g. during static generation without env configured).
  const hasEnv =
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ""

  const supabase = hasEnv ? createClient() : null

  useEffect(() => {
    if (!supabase) {
      setUser(null)
      setLoading(false)
      return
    }

    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

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
