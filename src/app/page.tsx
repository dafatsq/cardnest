import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { CategoryList } from "@/components/CategoryList"
import { FlashcardList } from "@/components/FlashcardList"
import { Plus, Sparkles, Layers, AlertTriangle } from "lucide-react"
import { CardsDeckIcon } from "@/components/icons/CardsDeckIcon"

import { Flashcard } from "@/types"
import type { PostgrestError } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error: queryError, message: queryMessage } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's categories
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const categoryList = categories ?? []
  const categoryIds = categoryList.map((c) => c.id)

  // Fetch all flashcards only if user has categories
  let flashcards: Flashcard[] = []
  let flashcardsError: PostgrestError | null = null

  if (categoryIds.length > 0) {
    const res = await supabase
      .from("flashcards")
      .select("*")
      .in("category_id", categoryIds)
      .order("created_at", { ascending: false })

    flashcards = (res.data as Flashcard[]) ?? []
    flashcardsError = res.error
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Error / Alert banner */}
        {queryError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
            <p className="font-medium">{queryError}</p>
          </div>
        )}

        {queryMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <p className="font-medium">{queryMessage}</p>
          </div>
        )}

        {/* Dashboard Welcome & Stats - Clean, Open, Non-Card Header */}
        <div className="mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Smart Learning</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user.email?.split("@")[0]}!
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Create categories, memorize key concepts with 3D flip flashcards, and master your subjects with dedicated study sessions.
            </p>
          </div>

          {/* Inline Stats & Primary Action - Zero Card-ition */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <div className="flex items-center gap-5 divide-x divide-slate-200 dark:divide-slate-800">
              <div className="flex items-center gap-2.5">
                <CardsDeckIcon className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {categoryList.length}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {categoryList.length === 1 ? "Deck" : "Decks"}
                  </span>
                </div>
              </div>

              <div className="pl-5 flex items-center gap-2.5">
                <Layers className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {flashcards.length}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {flashcards.length === 1 ? "Card" : "Cards"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/categories/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/30 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>New Category</span>
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <CategoryList
          categories={categoryList}
          flashcards={flashcards}
          error={categoriesError?.message}
        />

        {/* Flashcards Section */}
        {categoryList.length > 0 && (
          <div className="mt-12">
            <FlashcardList
              flashcards={flashcards}
              categories={categoryList}
              error={flashcardsError?.message}
            />
          </div>
        )}
      </main>
    </div>
  )
}
