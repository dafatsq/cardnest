"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import {
  Layers,
  LogOut,
  Plus,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react"
import { CardsDeckIcon } from "@/components/icons/CardsDeckIcon"
import type { User } from "@supabase/supabase-js"

export function Navbar({ user }: { user: User }) {
  const { signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
  }

  const userInitial = user.email ? user.email[0].toUpperCase() : "U"

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90 dark:text-slate-100"
          >
            <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-lg">CardNest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/categories"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === "/categories"
                  ? "bg-slate-100 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              }`}
            >
              <CardsDeckIcon className="h-4 w-4" />
              All Decks
            </Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/categories/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-md"
          >
            <Plus className="h-3.5 w-3.5" />
            New Category
          </Link>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {userInitial}
            </div>
            <span className="max-w-[140px] truncate text-xs font-medium text-slate-600 dark:text-slate-400">
              {user.email}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            title="Sign out"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:border-red-900 dark:hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isSigningOut ? "..." : "Sign Out"}</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/categories/new"
            className="rounded-lg bg-indigo-600 p-2 text-white"
          >
            <Plus className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {userInitial}
              </div>
              <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                {user.email}
              </span>
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <CardsDeckIcon className="h-4 w-4" />
              All Decks
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
