import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { DeckDetailView } from "@/components/DeckDetailView"

export const dynamic = "force-dynamic"

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!category) {
    notFound()
  }

  const { data: flashcards, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("category_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950">
      <Navbar user={user} />
      <DeckDetailView
        category={category}
        flashcards={flashcards ?? []}
        error={error?.message}
      />
    </div>
  )
}
