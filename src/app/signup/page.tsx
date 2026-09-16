"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"

export const dynamic = "force-dynamic"

interface ParsedAuthError {
  message: string
  isDuplicateUser?: boolean
}

function parseSignupError(error: unknown): ParsedAuthError {
  if (!error) return { message: "An unexpected error occurred. Please try again." }

  const rawMessage =
    typeof error === "string"
      ? error
      : typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error)

  const lower = rawMessage.toLowerCase()

  if (
    lower.includes("user already registered") ||
    lower.includes("already exists") ||
    lower.includes("user_already_exists")
  ) {
    return {
      message: "An account with this email already exists.",
      isDuplicateUser: true,
    }
  }

  if (lower.includes("password should be at least")) {
    return { message: "Password must be at least 6 characters long." }
  }

  if (lower.includes("unable to validate email") || lower.includes("invalid format")) {
    return { message: "Please enter a valid email address." }
  }

  if (lower.includes("too many requests") || lower.includes("rate limit")) {
    return { message: "Too many signup attempts. Please wait a moment before trying again." }
  }

  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return {
      message: "Network error: Unable to connect to the server. Please check your internet connection.",
    }
  }

  return { message: rawMessage }
}

function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [email, setEmail] = useState(() => searchParams.get("email") || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<ParsedAuthError | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError({ message: "Please enter your email address." })
      return
    }

    if (password.length < 6) {
      setError({ message: "Password must be at least 6 characters long." })
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/`,
        },
      })

      if (signUpError) {
        setError(parseSignupError(signUpError))
        setLoading(false)
        return
      }

      // Email confirmation is disabled (mailer_autoconfirm enabled).
      // Check if session exists or sign in immediately.
      if (data?.session) {
        router.push("/")
        router.refresh()
      } else {
        // Automatically sign in with credentials
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })

        if (signInError) {
          router.push(
            `/login?email=${encodeURIComponent(trimmedEmail)}&message=${encodeURIComponent(
              "Account created! Please sign in."
            )}`
          )
        } else {
          router.push("/")
          router.refresh()
        }
      }
    } catch (err: unknown) {
      setError(parseSignupError(err))
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Left side: Branding & Hero (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-slate-200/80 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-12 text-white dark:border-slate-800">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold tracking-tight text-white text-xl">
            <Layers className="h-7 w-7 text-indigo-400 shrink-0" />
            CardNest
          </Link>
        </div>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Join CardNest Free</span>
          </div>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight leading-tight text-white">
            Build your personal nest of knowledge today.
          </h2>
          <p className="mt-3 text-sm text-indigo-200 leading-relaxed">
            Create categories for every subject, test yourself with 3D flip cards, upload reference photos, and master test material in record time.
          </p>

          <div className="mt-8 space-y-3 text-sm text-indigo-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Unlimited category decks & flashcards</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Interactive 3D card flips with keyboard shortcuts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Instant sync across all your devices</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-indigo-300">
          © {new Date().getFullYear()} CardNest. Free forever for students & lifelong learners.
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden text-center">
            <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight text-slate-900 dark:text-white text-xl">
              <Layers className="h-7 w-7 text-indigo-600 dark:text-indigo-400 shrink-0" />
              CardNest
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Start mastering your cards in seconds.
            </p>
          </div>

          {error && (
            <div
              className={`mt-6 flex items-start justify-between gap-2.5 rounded-2xl border p-4 text-xs font-medium animate-pop-in ${
                error.isDuplicateUser
                  ? "border-amber-200 bg-amber-50/90 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1">
                <AlertCircle
                  className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                    error.isDuplicateUser ? "text-amber-600 dark:text-amber-400" : "text-red-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="leading-relaxed font-semibold">{error.message}</p>
                  {error.isDuplicateUser ? (
                    <div className="pt-1">
                      <p className="text-amber-800/90 dark:text-amber-300/80 mb-2">
                        Did you mean to sign in? You can log in directly with this email.
                      </p>
                      <Link
                        href={`/login?email=${encodeURIComponent(email.trim())}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.98] transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
                      >
                        <span>Sign in to this account</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-0.5"
                aria-label="Dismiss error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mt-6 flex items-start justify-between gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 animate-pop-in">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5 dark:text-emerald-400" />
                <p className="leading-relaxed">{successMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200"
                aria-label="Dismiss message"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  className={`w-full rounded-xl border bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-800"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError(null)
                  }}
                  className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-800"
                  }`}
                  placeholder="At least 6 characters"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating your account...
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href={email.trim() ? `/login?email=${encodeURIComponent(email.trim())}` : "/login"}
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
