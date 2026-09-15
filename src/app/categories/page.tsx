// Categories list page — redirects to dashboard for now, or shows all categories
// This page is a lightweight alternate view of categories.
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CategoryList } from "@/components/CategoryList"

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

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Categories</h1>
        <Link
          href="/categories/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + New Category
        </Link>
      </div>

      <CategoryList categories={categories ?? []} error={error?.message} />
    </div>
  )
}
