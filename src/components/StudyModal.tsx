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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionClass, setTransitionClass] = useState("")
  const [enterClass, setEnterClass] = useState("animate-card-enter-right")
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const resetSession = () => {
    setDeck([...cards])
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCount(0)
    setLearningCount(0)
    setIsFinished(false)
    setIsTransitioning(false)
    setTransitionClass("")
    setEnterClass("animate-card-enter-right")
  }

  const shuffleDeck = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTransitionClass("animate-card-exit-left")
    setTimeout(() => {
      const shuffled = [...deck].sort(() => Math.random() - 0.5)
      setDeck(shuffled)
      setCurrentIndex(0)
      setIsFlipped(false)
      setEnterClass("animate-pop-in")
      setTransitionClass("")
      setIsTransitioning(false)
    }, 240)
  }

  const currentCard = deck[currentIndex]

  const triggerSwitch = useCallback(
    (action: "next" | "prev" | "known" | "learning") => {
      if (isTransitioning) return

      if (action === "prev") {
        if (currentIndex <= 0) return
        setIsTransitioning(true)
        setTransitionClass("animate-card-exit-right")
        setTimeout(() => {
          setCurrentIndex((prev) => prev - 1)
          setIsFlipped(false)
          setEnterClass("animate-card-enter-left")
          setTransitionClass("")
          setIsTransitioning(false)
        }, 220)
        return
      }

      if (action === "known") {
        setKnownCount((prev) => prev + 1)
      } else if (action === "learning") {
        setLearningCount((prev) => prev + 1)
      }

      if (currentIndex >= deck.length - 1) {
        setIsTransitioning(true)
        setTransitionClass(
          action === "learning" ? "animate-card-exit-left" : "animate-card-exit-right"
        )
        setTimeout(() => {
          setIsFinished(true)
          setIsTransitioning(false)
          setTransitionClass("")
        }, 250)
        return
      }

      setIsTransitioning(true)
      const exitAnim =
        action === "learning"
          ? "animate-card-exit-left"
          : action === "known"
          ? "animate-card-exit-right"
          : "animate-card-exit-left"
      setTransitionClass(exitAnim)

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setIsFlipped(false)
        setEnterClass("animate-card-enter-right")
        setTransitionClass("")
        setIsTransitioning(false)
      }, 220)
    },
    [currentIndex, deck.length, isTransitioning]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!isFinished && !isTransitioning) {
          setIsFlipped((prev) => !prev)
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        if (!isFinished) triggerSwitch("next")
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        if (!isFinished) triggerSwitch("prev")
      } else if (e.key === "1") {
        e.preventDefault()
        if (!isFinished) triggerSwitch("learning")
      } else if (e.key === "2") {
        e.preventDefault()
        if (!isFinished) triggerSwitch("known")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFinished, isTransitioning, triggerSwitch, onClose])

  const progressPercent =
    deck.length > 0 ? Math.round(((currentIndex + 1) / deck.length) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-pop-in"
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
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-slate-800 hover:text-white active:scale-95"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Shuffle</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isFinished && deck.length > 0 && (
          <div className="h-1.5 w-full bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col items-center justify-center p-6 overflow-hidden">
          {isFinished ? (
            /* COMPLETION SCREEN */
            <div className="flex max-w-md flex-col items-center text-center animate-pop-in">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-400 shadow-inner">
                <Trophy className="h-10 w-10 text-amber-400 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Deck Completed!</h3>
              <p className="mt-2 text-sm text-slate-300">
                You went through all {deck.length} flashcards in this study deck.
              </p>

              {/* Stats Summary */}
              <div className="my-6 grid grid-cols-2 gap-3 w-full">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-center">
                  <span className="text-3xl font-bold text-emerald-400">
                    {knownCount}
                  </span>
                  <p className="mt-1 text-xs text-emerald-300 font-medium">
                    Mastered
                  </p>
                </div>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-950/30 p-4 text-center">
                  <span className="text-3xl font-bold text-amber-400">
                    {learningCount}
                  </span>
                  <p className="mt-1 text-xs text-amber-300 font-medium">
                    Needs Review
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={resetSession}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-3 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700 active:scale-95"
                >
                  Restart Deck
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 active:scale-95"
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
            /* ACTIVE CARD DISPLAY WITH CARD DECK STACK AND SWITCHING ANIMATION */
            <div className="relative flex w-full flex-1 flex-col items-center justify-center px-2">
              <div className="relative h-80 w-full max-w-lg flex items-center justify-center">
                {/* 2nd Card in Stack (deepest) */}
                {currentIndex + 2 < deck.length && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-3xl border border-slate-700/30 bg-slate-800/40 shadow-md translate-y-3 scale-[0.92] opacity-40 transition-all duration-300"
                  />
                )}

                {/* 1st Card in Stack (next card peek) */}
                {currentIndex + 1 < deck.length && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 rounded-3xl border border-slate-700/60 bg-slate-800/80 shadow-lg transition-all duration-300 ${
                      isTransitioning
                        ? "translate-y-0 scale-100 opacity-95"
                        : "translate-y-1.5 scale-[0.96] opacity-70"
                    }`}
                  />
                )}

                {/* Main Interactive Active Card */}
                <div
                  key={currentIndex}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!isTransitioning) setIsFlipped((prev) => !prev)
                  }}
                  onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchStartX === null || isTransitioning) return
                    const diff = touchStartX - e.changedTouches[0].clientX
                    if (diff > 50) {
                      triggerSwitch("next")
                    } else if (diff < -50 && currentIndex > 0) {
                      triggerSwitch("prev")
                    }
                    setTouchStartX(null)
                  }}
                  className={`perspective-card group relative h-full w-full cursor-pointer focus:outline-none select-none ${
                    transitionClass || enterClass
                  }`}
                >
                  <div
                    className={`card-flip-body relative h-full w-full rounded-3xl transition-all duration-[800ms] ${
                      isFlipped ? "rotate-y-180 shadow-2xl shadow-indigo-500/20" : ""
                    }`}
                  >
                    {/* FRONT SIDE */}
                    <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-3xl border border-slate-700/80 bg-slate-800/95 p-8 shadow-2xl transition-all duration-300 hover:border-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                          Question / Front
                        </span>
                        <span className="text-xs text-slate-400">[Space] to flip</span>
                      </div>

                      <div className="my-auto flex flex-col items-center justify-center text-center">
                        {currentCard?.front_image_url && (
                          <div className="relative mb-4 h-36 w-full max-w-xs overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10">
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
                        <RotateCw className="h-3.5 w-3.5 transition-transform duration-800 group-hover:rotate-180" />
                        <span>Click card or press Space to reveal answer</span>
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/50 to-slate-800/95 p-8 shadow-2xl transition-all duration-300 hover:border-indigo-400/60">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Answer / Back
                        </span>
                        <span className="text-xs text-slate-400">[Space] to flip back</span>
                      </div>

                      <div className="my-auto flex flex-col items-center justify-center text-center">
                        {currentCard?.back_image_url && (
                          <div className="relative mb-4 h-36 w-full max-w-xs overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10">
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
                        <RotateCw className="h-3.5 w-3.5 transition-transform duration-800 group-hover:rotate-180" />
                        <span>Click to flip back</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-lg">
                <button
                  type="button"
                  onClick={() => triggerSwitch("learning")}
                  disabled={isTransitioning}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-2.5 text-sm font-medium text-amber-300 transition-all hover:bg-amber-900/40 active:scale-95 disabled:opacity-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Still learning [1]</span>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSwitch("known")}
                  disabled={isTransitioning}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-900/40 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Know it [2]</span>
                </button>
              </div>

              {/* Navigation Controls */}
              <div className="mt-4 flex items-center justify-between w-full max-w-lg text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => triggerSwitch("prev")}
                  disabled={currentIndex === 0 || isTransitioning}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev [←]</span>
                </button>

                <span className="font-mono">
                  {currentIndex + 1} / {deck.length}
                </span>

                <button
                  type="button"
                  onClick={() => triggerSwitch("next")}
                  disabled={isTransitioning}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
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
