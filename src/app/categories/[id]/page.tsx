import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"
import { Flashcard } from "@/types"
import { Plus, Edit3, Trash2 } from "lucide-react"
import { deleteFlashcardAction } from "@/app/actions/flashcard-actions"

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

  const { data: flashcards, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("category_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <Link
          href={`/categories/${id}/flashcards/new`}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Flashcard
        </Link>
      </div>

      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!flashcards?.length ? (
        <p className="text-gray-500">
          No flashcards in this category yet. Click &ldquo;New Flashcard&rdquo; to create one!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(flashcards as Flashcard[]).map((card) => (
            <div
              key={card.id}
              className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="mb-3 flex items-start justify-between">
                <p className="line-clamp-2 text-sm text-gray-700">
                  {card.front_text?.slice(0, 60)}
                  {card.front_text && card.front_text.length > 60 && "…"}
                </p>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/categories/${id}/flashcards/${card.id}/edit`}
                    className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                  <form action={deleteFlashcardAction}>
                    <input type="hidden" name="id" value={card.id} />
                    <input type="hidden" name="category_id" value={id} />
                    <button
                      type="submit"
                      className="rounded p-1 text-red-500 hover:bg-red-100"
                      onClick={(e) => {
                        if (
                          !confirm(
                            "Delete this flashcard? This cannot be undone.",
                          )
                        ) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              {card.front_image_url && (
                <Image
                  src={card.front_image_url}
                  alt="Front"
                  width={200}
                  height={120}
                  className="mb-2 rounded-md object-cover"
                />
              )}

              <button className="mb-2 text-xs text-gray-400">
                ⇄ flip to see back
              </button>

              {card.back_image_url && (
                <Image
                  src={card.back_image_url}
                  alt="Back"
                  width={200}
                  height={120}
                  className="mb-2 rounded-md object-cover"
                />
              )}

              <p className="line-clamp-2 text-sm text-gray-700">
                {card.back_text?.slice(0, 80)}
                {card.back_text && card.back_text.length > 80 && "…"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
