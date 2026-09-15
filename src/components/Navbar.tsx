"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { LogOut, Home } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export function Navbar({ user }: { user: User }) {
  const { signOut } = useAuth()

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-4 py-3 text-white">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          CardNest
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{user?.email}</span>
        <button
          onClick={signOut}
          className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </nav>
  )
}
