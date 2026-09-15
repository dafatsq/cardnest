"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Flashcard } from "@/types"
import { Edit3, Trash2, RotateCw, Check, X, Layers } from "lucide-react"
import { deleteFlashcardAction } from "@/app/actions/flashcard-actions"

interface Props {
  card: Flashcard
  categoryName?: string
  categoryId?: string
  showCategoryBadge?: boolean
  index?: number
}

export function InteractiveFlashcard({
  card,
  categoryName,
  categoryId,
  showCategoryBadge = false,
  index = 0,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const effectiveCategoryId = categoryId || card.category_id

  const handleFlip = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest("a") || target.closest("form")) {
      return
    }
    setIsFlipped((prev) => !prev)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsFlipped((prev) => !prev)
    }
  }

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Flashcard: ${card.front_text || "Front side"}. Click or press space to flip.`}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      style={{
        animationDelay: `${Math.min(index * 45, 450)}ms`,
      }}
      className="perspective-1000 group relative h-72 w-full cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-2xl animate-card-enter active:scale-[0.985] transition-transform duration-200"
    >
      <div
        className={`transform-style-3d relative h-full w-full rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT SIDE */}
        <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800">
          <div>
            {/* Top Bar: Badges and Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  Front
                </span>
                {showCategoryBadge && categoryName && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Layers className="h-3 w-3" />
                    {categoryName}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href={`/categories/${effectiveCategoryId}/flashcards/${card.id}/edit`}
                  title="Edit flashcard"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 active:scale-90 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>

                {confirmDelete ? (
                  <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/50 p-1 rounded-lg border border-red-200 dark:border-red-900 animate-pop-in">
                    <form
                      action={async (formData) => {
                        setIsDeleting(true)
                        await deleteFlashcardAction(formData)
                      }}
                    >
                      <input type="hidden" name="id" value={card.id} />
                      <input
                        type="hidden"
                        name="category_id"
                        value={effectiveCategoryId}
                      />
                      <button
                        type="submit"
                        disabled={isDeleting}
                        title="Confirm delete"
                        className="rounded p-1 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/60 active:scale-90"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      title="Cancel"
                      className="rounded p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-90"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    title="Delete flashcard"
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-90 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Front Content */}
            <div className="mt-4 flex flex-col items-center justify-center text-center">
              {card.front_image_url && (
                <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-slate-50 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
                  <Image
                    src={card.front_image_url}
                    alt="Front of flashcard"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain"
                  />
                </div>
              )}
              {card.front_text ? (
                <p className="line-clamp-4 text-base font-medium text-slate-900 dark:text-slate-100 leading-snug">
                  {card.front_text}
                </p>
              ) : (
                !card.front_image_url && (
                  <p className="italic text-slate-400 text-sm">Empty card</p>
                )
              )}
            </div>
          </div>

          {/* Flip Hint Footer */}
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center text-xs font-medium text-indigo-600 dark:text-indigo-400 gap-1.5">
            <RotateCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
            <span>Click or press space to flip</span>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 dark:border-indigo-900/60 dark:from-slate-900 dark:to-indigo-950/20">
          <div>
            {/* Top Bar: Badges */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Answer / Back
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(false)
                }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                Back to Front ↵
              </button>
            </div>

            {/* Back Content */}
            <div className="mt-4 flex flex-col items-center justify-center text-center">
              {card.back_image_url && (
                <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-slate-50 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
                  <Image
                    src={card.back_image_url}
                    alt="Back of flashcard"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain"
                  />
                </div>
              )}
              {card.back_text ? (
                <p className="line-clamp-4 text-base font-normal text-slate-800 dark:text-slate-200 leading-relaxed">
                  {card.back_text}
                </p>
              ) : (
                !card.back_image_url && (
                  <p className="italic text-slate-400 text-sm">No answer provided</p>
                )
              )}
            </div>
          </div>

          {/* Flip Hint Footer */}
          <div className="mt-auto pt-3 border-t border-indigo-100/60 dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400 gap-1.5">
            <RotateCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
            <span>Click to flip to front</span>
          </div>
        </div>
      </div>
    </div>
  )
}
