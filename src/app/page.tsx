import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { CategoryList } from "@/components/CategoryList"

// Don't statically prerender — this page requires a user session.
export const dynamic = "force-dynamic"
import { FlashcardList } from "@/components/FlashcardList"

export default async function DashboardPage() {
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

  // Fetch all flashcards across all categories for the user
  const { data: flashcards, error: flashcardsError } =
    await supabase
      .from("flashcards")
      .select("*")
      .in(
        "category_id",
        (categories ?? []).map((c) => c.id),
      )
      .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen flex-col">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My CardNest</h1>
            <Link
              href="/categories/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              + New Category
            </Link>
          </div>

          <CategoryList
            categories={categories ?? []}
            error={categoriesError?.message}
          />

          <FlashcardList flashcards={flashcards ?? []} error={flashcardsError?.message} />
        </main>
      </div>
    </div>
  )
}
