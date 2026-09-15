import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { CategoryForm } from "@/components/CategoryForm"
import { createCategoryAction } from "@/app/actions/category-actions"
import { ChevronRight, FolderPlus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewCategoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
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
          <Link href="/categories" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Decks
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-900 dark:text-slate-100">New Category</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FolderPlus className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                Create New Category Deck
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Group your flashcards by subject or exam topic.
              </p>
            </div>
          </div>
        </div>

        <CategoryForm action={createCategoryAction} />
      </main>
    </div>
  )
}
