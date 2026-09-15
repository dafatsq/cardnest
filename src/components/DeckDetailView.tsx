"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import { Category, Flashcard } from "@/types"
import { InteractiveFlashcard } from "./InteractiveFlashcard"
import { StudyModal } from "./StudyModal"
import {
  Play,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Layers,
  Sparkles,
  ArrowLeft,
  LayoutGrid,
  CreditCard,
} from "lucide-react"

interface Props {
  category: Category
  flashcards: Flashcard[]
  error?: string
}

export function DeckDetailView({ category, flashcards, error }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isStudyOpen, setIsStudyOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "single">("grid")
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isSwitching, setIsSwitching] = useState(false)
  const [switchClass, setSwitchClass] = useState("")
  const [enterClass, setEnterClass] = useState("animate-card-enter-right")
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return flashcards
    const q = searchQuery.toLowerCase().trim()
    return flashcards.filter(
      (c) =>
        (c.front_text && c.front_text.toLowerCase().includes(q)) ||
        (c.back_text && c.back_text.toLowerCase().includes(q))
    )
  }, [flashcards, searchQuery])

  // Clamped focusedIndex safe against filtered cards list changes
  const safeFocusedIndex = Math.min(
    focusedIndex,
    Math.max(0, filteredCards.length - 1)
  )

  const triggerFocusSwitch = useCallback(
    (action: "next" | "prev") => {
      if (isSwitching || filteredCards.length <= 1) return

      if (action === "prev") {
        if (safeFocusedIndex <= 0) return
        setIsSwitching(true)
        setSwitchClass("animate-card-exit-right")
        setTimeout(() => {
          setFocusedIndex(Math.max(0, safeFocusedIndex - 1))
          setEnterClass("animate-card-enter-left")
          setSwitchClass("")
          setIsSwitching(false)
        }, 220)
        return
      }

      if (action === "next") {
        if (safeFocusedIndex >= filteredCards.length - 1) return
        setIsSwitching(true)
        setSwitchClass("animate-card-exit-left")
        setTimeout(() => {
          setFocusedIndex(Math.min(filteredCards.length - 1, safeFocusedIndex + 1))
          setEnterClass("animate-card-enter-right")
          setSwitchClass("")
          setIsSwitching(false)
        }, 220)
        return
      }
    },
    [filteredCards.length, safeFocusedIndex, isSwitching]
  )

  // Keyboard navigation when in single card mode
  useEffect(() => {
    if (viewMode !== "single" || isStudyOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        triggerFocusSwitch("next")
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        triggerFocusSwitch("prev")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [viewMode, isStudyOpen, triggerFocusSwitch])

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

      {/* Header Banner - Open, breathable, non-boxed */}
      <div className="mb-8 flex flex-col gap-5 pb-6 border-b border-slate-200/80 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3.5">
            <Layers className="h-9 w-9 text-indigo-600 dark:text-indigo-400 shrink-0 stroke-[1.75]" />
            <div>
              <div className="flex items-center gap-2.5">
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
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
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
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-600/35 active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              Practice Deck
            </button>
          )}

          <Link
            href={`/categories/${category.id}/flashcards/new`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 active:scale-95"
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
          <Sparkles className="mx-auto h-12 w-12 text-indigo-500/80 dark:text-indigo-400 stroke-[1.5]" />
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
          {/* Toolbar: Search and View Mode Switcher */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Showing {filteredCards.length} of {flashcards.length} cards
              </span>

              {/* View Mode Toggle */}
              {filteredCards.length > 0 && (
                <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("single")}
                    title="Card Switcher"
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      viewMode === "single"
                        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Card Switcher</span>
                  </button>
                </div>
              )}
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

          {filteredCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No flashcards match &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
          ) : viewMode === "single" ? (
            /* ANIMATED SINGLE CARD SWITCHER */
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative h-80 w-full max-w-lg flex items-center justify-center">
                {/* 2nd Stack Card */}
                {safeFocusedIndex + 2 < filteredCards.length && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl border border-slate-200/40 bg-slate-100/60 shadow-sm translate-y-3 scale-[0.92] opacity-40 dark:border-slate-800 dark:bg-slate-800/40 transition-all duration-300"
                  />
                )}

                {/* 1st Stack Card */}
                {safeFocusedIndex + 1 < filteredCards.length && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 rounded-2xl border border-slate-200/80 bg-white/80 shadow-md transition-all duration-300 dark:border-slate-700/60 dark:bg-slate-800/70 ${
                      isSwitching
                        ? "translate-y-0 scale-100 opacity-95"
                        : "translate-y-1.5 scale-[0.96] opacity-70"
                    }`}
                  />
                )}

                {/* Current Card */}
                <div
                  key={filteredCards[safeFocusedIndex].id}
                  onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchStartX === null || isSwitching) return
                    const diff = touchStartX - e.changedTouches[0].clientX
                    if (diff > 50 && safeFocusedIndex < filteredCards.length - 1) {
                      triggerFocusSwitch("next")
                    } else if (diff < -50 && safeFocusedIndex > 0) {
                      triggerFocusSwitch("prev")
                    }
                    setTouchStartX(null)
                  }}
                  className={`w-full h-full ${switchClass || enterClass}`}
                >
                  <InteractiveFlashcard
                    index={safeFocusedIndex}
                    card={filteredCards[safeFocusedIndex]}
                    categoryName={category.name}
                    categoryId={category.id}
                  />
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 flex items-center justify-between w-full max-w-lg">
                <button
                  type="button"
                  onClick={() => triggerFocusSwitch("prev")}
                  disabled={safeFocusedIndex === 0 || isSwitching}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-white active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous [←]</span>
                </button>

                <div className="flex flex-col items-center">
                  <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                    Card {safeFocusedIndex + 1} of {filteredCards.length}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Use arrow keys to switch
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => triggerFocusSwitch("next")}
                  disabled={safeFocusedIndex === filteredCards.length - 1 || isSwitching}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-white active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>Next [→]</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card, index) => (
                <InteractiveFlashcard
                  key={card.id}
                  index={index}
                  card={card}
                  categoryName={category.name}
                  categoryId={category.id}
                />
              ))}
            </div>
          )}
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
