"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Category, Flashcard } from "@/types"
import {
  Edit3,
  Trash2,
  Play,
  Plus,
  Search,
  Check,
  X,
} from "lucide-react"
import { CardsDeckIcon } from "@/components/icons/CardsDeckIcon"
import { deleteCategoryAction } from "@/app/actions/category-actions"
import { StudyModal } from "./StudyModal"

interface Props {
  categories: Category[]
  flashcards?: Flashcard[]
  error?: string
}

export function CategoryList({ categories, flashcards = [], error }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [studyCategory, setStudyCategory] = useState<Category | null>(null)

  // Map card counts per category
  const cardCountMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const card of flashcards) {
      map.set(card.category_id, (map.get(card.category_id) || 0) + 1)
    }
    return map
  }, [flashcards])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter((c) => c.name.toLowerCase().includes(q))
  }, [categories, searchQuery])

  // Cards for the category being studied
  const cardsForStudy = useMemo(() => {
    if (!studyCategory) return []
    return flashcards.filter((c) => c.category_id === studyCategory.id)
  }, [studyCategory, flashcards])

  if (error) {
    return (
      <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        <p className="font-semibold">Error loading decks</p>
        <p className="mt-1">{error}</p>
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className="mb-10 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <CardsDeckIcon className="mx-auto h-12 w-12 text-indigo-500/80 dark:text-indigo-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          No categories yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Create your first category deck to start organizing your flashcards and studying efficiently.
        </p>
        <div className="mt-6">
          <Link
            href="/categories/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4" />
            Create First Category
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-10">
      {/* Header & Search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Your Decks
          </h2>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
            {categories.length}
          </span>
        </div>

        {categories.length > 3 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.map((category, index) => {
          const cardCount = cardCountMap.get(category.id) || 0
          const isConfirming = deletingId === category.id

          return (
            <div
              key={category.id}
              style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 animate-card-enter active:scale-[0.99]"
            >
              {/* Category info */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <CardsDeckIcon className="h-9 w-9 text-indigo-600 dark:text-indigo-400 shrink-0 transition-transform group-hover:scale-105" />

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/categories/${category.id}/edit`}
                      title="Edit category"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>

                    {isConfirming ? (
                      <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/50 p-1 rounded-lg border border-red-200 dark:border-red-900">
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="id" value={category.id} />
                          <button
                            type="submit"
                            title="Confirm delete"
                            className="rounded p-1 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/60"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        </form>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          title="Cancel"
                          className="rounded p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingId(category.id)}
                        title="Delete category"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <Link
                  href={`/categories/${category.id}`}
                  className="mt-3 block font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400 text-lg line-clamp-1"
                >
                  {category.name}
                </Link>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {cardCount === 1 ? "1 card" : `${cardCount} cards`}
                </p>
              </div>

              {/* Bottom Quick Actions */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <Link
                  href={`/categories/${category.id}`}
                  className="text-xs font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  View cards →
                </Link>

                {cardCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStudyCategory(category)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    Study
                  </button>
                ) : (
                  <Link
                    href={`/categories/${category.id}/flashcards/new`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                  >
                    <Plus className="h-3 w-3" />
                    Add card
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Study Modal */}
      {studyCategory && (
        <StudyModal
          isOpen={Boolean(studyCategory)}
          categoryName={studyCategory.name}
          cards={cardsForStudy}
          onClose={() => setStudyCategory(null)}
        />
      )}
    </div>
  )
}
