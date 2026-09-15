"use client"

import { useState, useMemo } from "react"
import { Flashcard, Category } from "@/types"
import { InteractiveFlashcard } from "./InteractiveFlashcard"
import { StudyModal } from "./StudyModal"
import {
  Layers,
  Search,
  Play,
} from "lucide-react"

interface Props {
  flashcards: Flashcard[]
  categories?: Category[]
  error?: string
}

export function FlashcardList({
  flashcards,
  categories = [],
  error,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  const [isStudyOpen, setIsStudyOpen] = useState(false)

  // Map category id to name
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories) {
      map.set(c.id, c.name)
    }
    return map
  }, [categories])

  // Filtered flashcards
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter((card) => {
      const matchesCategory =
        selectedCategoryId === "all" || card.category_id === selectedCategoryId

      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCategory

      const matchesText =
        (card.front_text && card.front_text.toLowerCase().includes(query)) ||
        (card.back_text && card.back_text.toLowerCase().includes(query))

      return matchesCategory && matchesText
    })
  }, [flashcards, selectedCategoryId, searchQuery])

  const selectedCategoryName =
    selectedCategoryId === "all"
      ? "All Flashcards"
      : categoryMap.get(selectedCategoryId) || "Selected Deck"

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
        <p className="font-semibold">Error loading flashcards</p>
        <p className="mt-1">{error}</p>
      </div>
    )
  }

  if (!flashcards.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <Layers className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          No flashcards yet
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Select any category above or create one to start adding cards with text, images, and explanations.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header & Controls */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {selectedCategoryId === "all" ? "All Flashcards" : selectedCategoryName}
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {filteredFlashcards.length}
            </span>
          </div>

          {filteredFlashcards.length > 0 && (
            <button
              type="button"
              onClick={() => setIsStudyOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Practice Deck
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search front or back text..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategoryId === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            All Decks ({flashcards.length})
          </button>
          {categories.map((c) => {
            const count = flashcards.filter((f) => f.category_id === c.id).length
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategoryId(c.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategoryId === c.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {c.name} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Grid of Interactive Flashcards */}
      {filteredFlashcards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No flashcards match your current filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFlashcards.map((card, index) => (
            <InteractiveFlashcard
              key={`${selectedCategoryId}-${card.id}`}
              index={index}
              card={card}
              categoryName={categoryMap.get(card.category_id)}
              showCategoryBadge={selectedCategoryId === "all"}
            />
          ))}
        </div>
      )}

      {/* Study Modal */}
      {isStudyOpen && (
        <StudyModal
          isOpen={isStudyOpen}
          categoryName={selectedCategoryName}
          cards={filteredFlashcards}
          onClose={() => setIsStudyOpen(false)}
        />
      )}
    </div>
  )
}
