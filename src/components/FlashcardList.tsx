import { Flashcard } from "@/types"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { deleteFlashcardAction } from "@/app/actions/flashcard-actions"

export function FlashcardList({
  flashcards,
  error,
}: {
  flashcards: Flashcard[]
  error?: string
}) {
  if (error) {
    return <p className="text-red-500">Error loading flashcards: {error}</p>
  }

  if (!flashcards.length) {
    return (
      <div>
        <p className="text-gray-500">No flashcards yet. Cards will appear here when you create them inside a category.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">All Flashcards</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className="group rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="mb-2 flex items-start justify-between">
              <p className="line-clamp-2 text-sm text-gray-700">
                {card.front_text || card.front_image_url ? "Front: " : ""}
                {card.front_text?.slice(0, 60)}
                {card.front_text && card.front_text.length > 60 && "…"}
              </p>
              <form action={deleteFlashcardAction}>
                <input type="hidden" name="id" value={card.id} />
                <input
                  type="hidden"
                  name="category_id"
                  value={card.category_id}
                />
                <button
                  type="submit"
                  className="rounded p-1 text-red-500 opacity-0 hover:bg-red-100 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>

            {card.front_image_url && (
              <div className="mb-2">
                <Image
                  src={card.front_image_url}
                  alt="Front image"
                  width={200}
                  height={120}
                  className="rounded-md object-cover"
                />
              </div>
            )}

            <button className="mb-2 text-left text-xs text-gray-400">
              ⇄ to see back
            </button>

            <p className="line-clamp-2 text-sm text-gray-700">
              {card.back_text
                ? `Back: ${card.back_text.slice(0, 60)}${card.back_text.length > 60 ? "…" : ""}`
                : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
