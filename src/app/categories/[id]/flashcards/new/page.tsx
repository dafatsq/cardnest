import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { createFlashcardAction } from "@/app/actions/flashcard-actions"
import FlashcardForm from "@/components/FlashcardForm"

export const dynamic = "force-dynamic"

export default async function NewFlashcardPage({
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
    notFound()
  }

  // Verify the category belongs to this user
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">
          New Flashcard in &ldquo;{category.name}&rdquo;
        </h1>

        <FlashcardForm
          categoryId={id}
          action={createFlashcardAction}
          submitLabel="Create Flashcard"
        />

        <div className="mt-4">
          <Link
            href={`/categories/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to {category.name}
          </Link>
        </div>
      </div>
    </div>
  )
}
