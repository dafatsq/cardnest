import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { CategoryList } from "@/components/CategoryList"
import { Plus, ChevronRight } from "lucide-react"

import { Flashcard } from "@/types"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const categoryList = categories ?? []
  const categoryIds = categoryList.map((c) => c.id)

  let flashcards: Flashcard[] = []
  if (categoryIds.length > 0) {
    const res = await supabase
      .from("flashcards")
      .select("*")
      .in("category_id", categoryIds)

    flashcards = (res.data as Flashcard[]) ?? []
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
      <Navbar user={user} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-900 dark:text-slate-100">All Categories</span>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              All Decks & Categories
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your flashcard collections, edit deck names, or jump straight into practice.
            </p>
          </div>

          <Link
            href="/categories/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Link>
        </div>

        <CategoryList
          categories={categoryList}
          flashcards={flashcards}
          error={error?.message}
        />
      </main>
    </div>
  )
}
