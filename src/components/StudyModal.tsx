"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Flashcard } from "@/types"
import {
  X,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Sparkles,
} from "lucide-react"

interface Props {
  cards: Flashcard[]
  categoryName: string
  isOpen: boolean
  onClose: () => void
}

function StudyModalContent({
  cards,
  categoryName,
  onClose,
}: {
  cards: Flashcard[]
  categoryName: string
  onClose: () => void
}) {
  const [deck, setDeck] = useState<Flashcard[]>(() => [...cards])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCount, setKnownCount] = useState(0)
  const [learningCount, setLearningCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const resetSession = () => {
    setDeck([...cards])
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCount(0)
    setLearningCount(0)
    setIsFinished(false)
  }

  const shuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const currentCard = deck[currentIndex]

  const nextCard = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
    } else {
      setIsFinished(true)
    }
  }, [currentIndex, deck.length])

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsFlipped(false)
    }
  }, [currentIndex])

  const handleMark = useCallback(
    (known: boolean) => {
      if (known) {
        setKnownCount((prev) => prev + 1)
      } else {
        setLearningCount((prev) => prev + 1)
      }
      nextCard()
    },
    [nextCard]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!isFinished) {
          setIsFlipped((prev) => !prev)
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        if (!isFinished) nextCard()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (!isFinished) prevCard()
      } else if (e.key === "1") {
        e.preventDefault()
        if (!isFinished) handleMark(false)
      } else if (e.key === "2") {
        e.preventDefault()
        if (!isFinished) handleMark(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFinished, nextCard, prevCard, handleMark, onClose])

  const progressPercent =
    deck.length > 0 ? Math.round(((currentIndex + 1) / deck.length) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-full max-h-[720px] w-full max-w-2xl flex-col rounded-3xl border border-slate-700/60 bg-slate-900 text-white shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-200">
                Studying: {categoryName}
              </h2>
              <p className="text-xs text-slate-400">
                {deck.length > 0 ? `Card ${currentIndex + 1} of ${deck.length}` : "0 cards"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished && deck.length > 1 && (
              <button
                type="button"
                onClick={shuffleDeck}
                title="Shuffle deck"
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isFinished && deck.length > 0 && (
          <div className="h-1 w-full bg-slate-800">
            <div
              className="h-full bg-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-6">
          {isFinished ? (
            /* COMPLETION SCREEN */
            <div className="flex max-w-md flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                <Trophy className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Great Session!</h3>
              <p className="mt-2 text-sm text-slate-300">
                You went through all {deck.length} flashcards in this deck.
              </p>

              {/* Stats Summary */}
              <div className="my-6 grid grid-cols-2 gap-3 w-full">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-center">
                  <span className="text-2xl font-bold text-emerald-400">
                    {knownCount}
                  </span>
                  <p className="mt-1 text-xs text-emerald-300 font-medium">
                    Got it right
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-950/30 p-4 text-center">
                  <span className="text-2xl font-bold text-amber-400">
                    {learningCount}
                  </span>
                  <p className="mt-1 text-xs text-amber-300 font-medium">
                    Still learning
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={resetSession}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                >
                  Restart Deck
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                >
                  Finish
                </button>
              </div>
            </div>
          ) : deck.length === 0 ? (
            <div className="text-center">
              <p className="text-slate-400">No cards in this deck to study.</p>
            </div>
          ) : (
            /* ACTIVE CARD DISPLAY */
            <div className="flex w-full flex-1 flex-col items-center justify-center">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsFlipped((prev) => !prev)}
                className="perspective-1000 group relative h-80 w-full max-w-lg cursor-pointer focus:outline-none"
              >
                <div
                  className={`transform-style-3d relative h-full w-full rounded-3xl transition-transform duration-500 ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-3xl border border-slate-700/80 bg-slate-800/90 p-8 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                        Question / Front
                      </span>
                      <span className="text-xs text-slate-400">Press [Space] to flip</span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center text-center">
                      {currentCard?.front_image_url && (
                        <div className="relative mb-4 h-36 w-full max-w-xs overflow-hidden rounded-xl bg-slate-900">
                          <Image
                            src={currentCard.front_image_url}
                            alt="Front image"
                            fill
                            sizes="300px"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className="text-xl font-medium tracking-wide text-slate-100 leading-snug">
                        {currentCard?.front_text || (
                          <span className="italic text-slate-500">Image card</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-400 font-medium">
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>Click card or press Space to reveal answer</span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-slate-800/95 p-8 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Answer / Back
                      </span>
                      <span className="text-xs text-slate-400">Press [Space] to flip back</span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center text-center">
                      {currentCard?.back_image_url && (
                        <div className="relative mb-4 h-36 w-full max-w-xs overflow-hidden rounded-xl bg-slate-900">
                          <Image
                            src={currentCard.back_image_url}
                            alt="Back image"
                            fill
                            sizes="300px"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className="text-xl font-medium text-slate-100 leading-relaxed">
                        {currentCard?.back_text || (
                          <span className="italic text-slate-500">No text answer</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                      <RotateCw className="h-3.5 w-3.5" />
                      <span>Click to flip back</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-lg">
                <button
                  type="button"
                  onClick={() => handleMark(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-2.5 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-900/40"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Still learning [1]</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMark(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-900/40"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Know it [2]</span>
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="mt-4 flex items-center justify-between w-full max-w-lg text-xs text-slate-400">
                <button
                  type="button"
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev [←]</span>
                </button>

                <span>
                  {currentIndex + 1} / {deck.length}
                </span>

                <button
                  type="button"
                  onClick={nextCard}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800"
                >
                  <span>Next [→]</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function StudyModal({ cards, categoryName, isOpen, onClose }: Props) {
  if (!isOpen) return null
  return (
    <StudyModalContent
      cards={cards}
      categoryName={categoryName}
      onClose={onClose}
    />
  )
}
