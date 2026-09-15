"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Category, Flashcard } from "@/types"
import { InteractiveFlashcard } from "./InteractiveFlashcard"
import { StudyModal } from "./StudyModal"
import {
  Play,
  Plus,
  Search,
  ChevronRight,
  Edit3,
  Layers,
  Sparkles,
  ArrowLeft,
} from "lucide-react"

interface Props {
  category: Category
  flashcards: Flashcard[]
  error?: string
}

export function DeckDetailView({ category, flashcards, error }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isStudyOpen, setIsStudyOpen] = useState(false)

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return flashcards
    const q = searchQuery.toLowerCase().trim()
    return flashcards.filter(
      (c) =>
        (c.front_text && c.front_text.toLowerCase().includes(q)) ||
        (c.back_text && c.back_text.toLowerCase().includes(q))
    )
  }, [flashcards, searchQuery])

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/categories" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Decks
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900 dark:text-slate-100">{category.name}</span>
      </div>

      {/* Header Banner */}
      <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Layers className="h-6 w-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
                  {category.name}
                </h1>
                <Link
                  href={`/categories/${category.id}/edit`}
                  title="Rename deck"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {flashcards.length === 1 ? "1 flashcard in deck" : `${flashcards.length} flashcards in deck`}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {flashcards.length > 0 && (
            <button
              type="button"
              onClick={() => setIsStudyOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-lg"
            >
              <Play className="h-4 w-4 fill-current" />
              Practice Deck
            </button>
          )}

          <Link
            href={`/categories/${category.id}/flashcards/new`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Plus className="h-4 w-4" />
            New Flashcard
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Cards Section */}
      {flashcards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            This deck is empty
          </h3>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Add your first flashcard to &ldquo;{category.name}&rdquo; to begin memorizing definitions, formulas, or vocabulary.
          </p>
          <div className="mt-6">
            <Link
              href={`/categories/${category.id}/flashcards/new`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Create Flashcard
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Search bar inside deck */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Showing {filteredCards.length} of {flashcards.length} cards
            </div>

            {flashcards.length > 2 && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in this deck..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
              <InteractiveFlashcard
                key={card.id}
                card={card}
                categoryName={category.name}
                categoryId={category.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Study Modal */}
      {isStudyOpen && (
        <StudyModal
          isOpen={isStudyOpen}
          categoryName={category.name}
          cards={flashcards}
          onClose={() => setIsStudyOpen(false)}
        />
      )}
    </div>
  )
}
