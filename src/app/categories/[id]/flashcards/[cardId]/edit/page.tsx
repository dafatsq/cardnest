import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { updateFlashcardAction } from "@/app/actions/flashcard-actions"
import FlashcardForm from "@/components/FlashcardForm"
import { Flashcard } from "@/types"

export const dynamic = "force-dynamic"

export default async function EditFlashcardPage({
  params,
}: {
  params: Promise<{ id: string; cardId: string }>
}) {
  const { id, cardId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
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

  const { data: flashcard } = await supabase
    .from("flashcards")
    .select("*")
    .eq("id", cardId)
    .eq("category_id", id)
    .single()

  if (!flashcard) {
    notFound()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">
          Edit Flashcard in &ldquo;{category.name}&rdquo;
        </h1>

        <FlashcardForm
          categoryId={id}
          action={updateFlashcardAction}
          submitLabel="Save Changes"
          flashcard={flashcard as Flashcard}
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
