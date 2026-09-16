"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Flashcard } from "@/types"
import {
  X,
  RotateCw,
  RotateCcw,
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
  const [isReviewRound, setIsReviewRound] = useState(false)
  const [cardStatusMap, setCardStatusMap] = useState<Record<string, "known" | "learning">>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionClass, setTransitionClass] = useState("")
  const [enterClass, setEnterClass] = useState("animate-card-enter-right")
  const [touchStartX, setTouchStartX] = useState<number | null>(null)



  const knownCount = useMemo(() => {
    return Object.values(cardStatusMap).filter((s) => s === "known").length
  }, [cardStatusMap])

  const learningCount = useMemo(() => {
    return Object.values(cardStatusMap).filter((s) => s === "learning").length
  }, [cardStatusMap])

  const needsReviewCards = useMemo(() => {
    return deck.filter((c) => cardStatusMap[c.id] === "learning")
  }, [deck, cardStatusMap])

  const resetSession = useCallback(() => {
    setDeck([...cards])
    setIsReviewRound(false)
    setCardStatusMap({})
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
    setIsTransitioning(false)
    setTransitionClass("")
    setEnterClass("animate-card-enter-right")
  }, [cards])

  const startReviewMissed = useCallback(() => {
    if (needsReviewCards.length === 0) return
    setDeck([...needsReviewCards])
    setCardStatusMap({})
    setIsReviewRound(true)
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
    setIsTransitioning(false)
    setTransitionClass("")
    setEnterClass("animate-card-enter-right")
  }, [needsReviewCards])

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

      if (action === "known" && currentCard) {
        setCardStatusMap((prev) => ({ ...prev, [currentCard.id]: "known" }))
      } else if (action === "learning" && currentCard) {
        setCardStatusMap((prev) => ({ ...prev, [currentCard.id]: "learning" }))
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
    [currentIndex, currentCard, deck.length, isTransitioning]
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      // Keyboard shortcuts on completion screen
      if (isFinished) {
        if (e.key === "1" || e.key === "r" || e.key === "R") {
          e.preventDefault()
          if (needsReviewCards.length > 0) {
            startReviewMissed()
          } else {
            resetSession()
          }
        } else if (e.key === "2") {
          e.preventDefault()
          resetSession()
        } else if (e.key === "Enter") {
          e.preventDefault()
          if (needsReviewCards.length > 0) {
            startReviewMissed()
          } else {
            resetSession()
          }
        }
        return
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        if (!isTransitioning) {
          setIsFlipped((prev) => !prev)
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        triggerSwitch("next")
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        triggerSwitch("prev")
      } else if (e.key === "1") {
        e.preventDefault()
        triggerSwitch("learning")
      } else if (e.key === "2") {
        e.preventDefault()
        triggerSwitch("known")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    isFinished,
    isTransitioning,
    triggerSwitch,
    onClose,
    needsReviewCards.length,
    startReviewMissed,
    resetSession,
  ])

  const progressPercent =
    deck.length > 0 ? Math.round(((currentIndex + 1) / deck.length) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl text-slate-100 overflow-y-auto sm:overflow-hidden select-none animate-pop-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Ambient Radial Spotlight Lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[140px] -z-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[100px] -z-10" />

      {/* Floating Top Navigation Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between px-6 py-4 sm:py-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-white">
                {categoryName}
              </h2>
              {isReviewRound && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-500/30">
                  <RotateCcw className="h-2.5 w-2.5" />
                  Review Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {deck.length > 0 ? `Card ${currentIndex + 1} of ${deck.length}` : "0 cards"}
            </p>
          </div>
        </div>

        {/* Center Progress Bar */}
        {!isFinished && deck.length > 0 && (
          <div className="hidden sm:flex flex-col items-center gap-1.5 w-64">
            <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden ring-1 ring-white/10">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">{progressPercent}% complete</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isReviewRound && (
            <button
              type="button"
              onClick={resetSession}
              title="Return to full deck"
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200 transition-all hover:bg-amber-500/20 active:scale-95"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Full Deck ({cards.length})</span>
            </button>
          )}
          {!isFinished && deck.length > 1 && (
            <button
              type="button"
              onClick={shuffleDeck}
              title="Shuffle deck"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Shuffle</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            title="Exit practice mode (Esc)"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 active:scale-95"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Exit [Esc]</span>
          </button>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      {!isFinished && deck.length > 0 && (
        <div className="sm:hidden h-1 w-full bg-slate-800 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Main Study Stage */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8">
        {isFinished ? (
          /* FULL SCREEN COMPLETION STAGE */
          <div className="my-auto flex max-w-lg flex-col items-center text-center animate-pop-in">
            <Trophy className="mb-6 h-16 w-16 text-amber-400 animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
            <h3 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {isReviewRound ? "Review Session Finished!" : "Deck Completed!"}
            </h3>
            <p className="mt-3 text-base text-slate-300 max-w-sm">
              {needsReviewCards.length > 0
                ? `You reviewed ${deck.length} ${deck.length === 1 ? "card" : "cards"}. You have ${needsReviewCards.length} ${needsReviewCards.length === 1 ? "card" : "cards"} marked for review.`
                : `Great job! You mastered all ${deck.length} ${deck.length === 1 ? "card" : "cards"} in this session.`}
            </p>

            {/* Stats Summary */}
            <div className="my-8 grid grid-cols-2 gap-4 w-full">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-5 text-center shadow-lg shadow-emerald-950/50">
                <span className="text-4xl font-black text-emerald-400">
                  {knownCount}
                </span>
                <p className="mt-1.5 text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  Mastered
                </p>
              </div>
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/40 p-5 text-center shadow-lg shadow-amber-950/50">
                <span className="text-4xl font-black text-amber-400">
                  {learningCount}
                </span>
                <p className="mt-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
                  Needs Review
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {needsReviewCards.length > 0 && (
                <button
                  type="button"
                  onClick={startReviewMissed}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-500/50 bg-amber-500/20 py-3.5 px-4 text-sm font-bold text-amber-200 shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-500/30 hover:border-amber-400 active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Review Missed ({needsReviewCards.length}) [1]</span>
                </button>
              )}
              <button
                type="button"
                onClick={resetSession}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-3.5 px-4 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95"
              >
                <RotateCw className="h-4 w-4" />
                <span>{isReviewRound ? "Restart Full Deck" : "Restart Deck"} {needsReviewCards.length > 0 ? "[2]" : ""}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finish & Return</span>
              </button>
            </div>
          </div>
        ) : deck.length === 0 ? (
          <div className="text-center">
            <p className="text-slate-400">No cards in this deck to study.</p>
          </div>
        ) : (
          /* THE HERO FLASHCARD ON IMMERSIVE STAGE */
          <div className="relative flex w-full flex-1 flex-col items-center justify-center">
            <div className="relative h-[380px] sm:h-[420px] w-full max-w-2xl flex items-center justify-center">
              {/* Subtle Deck Stack Backing for Physical Depth */}
              {currentIndex + 2 < deck.length && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5 bg-slate-900/60 shadow-lg translate-y-4 scale-[0.92] opacity-40 transition-all duration-300"
                />
              )}

              {currentIndex + 1 < deck.length && (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 rounded-3xl border border-white/10 bg-slate-900/80 shadow-xl transition-all duration-300 ${
                    isTransitioning
                      ? "translate-y-0 scale-100 opacity-95"
                      : "translate-y-2 scale-[0.96] opacity-70"
                  }`}
                />
              )}

              {/* Main Stand-Out Flashcard */}
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
                {/* Luminous Backlight Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-indigo-500/25 via-purple-500/20 to-pink-500/25 blur-xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

                <div
                  className={`card-flip-body relative h-full w-full rounded-3xl transition-all duration-[800ms] ${
                    isFlipped
                      ? "rotate-y-180 shadow-2xl shadow-indigo-500/30"
                      : "shadow-2xl shadow-black/70"
                  }`}
                >
                  {/* FRONT SIDE - High-Contrast, Luminous, Stand-Out Hero */}
                  <div className="backface-hidden absolute inset-0 flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 bg-white p-8 sm:p-10 shadow-2xl transition-all duration-300 dark:border-indigo-500/40 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 ring-1 ring-indigo-500/20">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        Question / Front
                      </span>
                      <span className="text-xs font-mono text-slate-400">[Space] to flip</span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center text-center px-4">
                      {currentCard?.front_image_url && (
                        <div className="relative mb-5 h-44 w-full max-w-sm overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-black/10 dark:bg-slate-800 dark:ring-white/10">
                          <Image
                            src={currentCard.front_image_url}
                            alt="Front image"
                            fill
                            sizes="400px"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-snug">
                        {currentCard?.front_text || (
                          <span className="italic text-slate-400">Image card</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <RotateCw className="h-4 w-4 transition-transform duration-800 group-hover:rotate-180" />
                      <span>Click card or press Space to reveal answer</span>
                    </div>
                  </div>

                  {/* BACK SIDE - Radiant, Distinct, Rewarding */}
                  <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col justify-between rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-8 sm:p-10 shadow-2xl text-white transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Answer / Back
                      </span>
                      <span className="text-xs font-mono text-slate-400">[Space] to flip back</span>
                    </div>

                    <div className="my-auto flex flex-col items-center justify-center text-center px-4">
                      {currentCard?.back_image_url && (
                        <div className="relative mb-5 h-44 w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/15">
                          <Image
                            src={currentCard.back_image_url}
                            alt="Back image"
                            fill
                            sizes="400px"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <p className="text-2xl sm:text-3xl font-medium tracking-normal text-slate-100 leading-relaxed">
                        {currentCard?.back_text || (
                          <span className="italic text-slate-500">No text answer</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                      <RotateCw className="h-4 w-4 transition-transform duration-800 group-hover:rotate-180" />
                      <span>Click to flip back</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Action Buttons */}
            <div className="mt-8 flex items-center justify-center gap-4 w-full max-w-2xl">
              <button
                type="button"
                onClick={() => triggerSwitch("learning")}
                disabled={isTransitioning}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 py-3.5 text-sm font-bold text-amber-300 shadow-lg shadow-amber-500/10 transition-all hover:bg-amber-500/20 hover:border-amber-400 hover:scale-[1.01] active:scale-95 disabled:opacity-40"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Still learning [1]</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="hidden sm:flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/10 active:scale-95"
              >
                <RotateCw className="h-4 w-4" />
                <span>Flip card</span>
              </button>

              <button
                type="button"
                onClick={() => triggerSwitch("known")}
                disabled={isTransitioning}
                className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 py-3.5 text-sm font-bold text-emerald-300 shadow-lg shadow-emerald-500/10 transition-all hover:bg-emerald-500/20 hover:border-emerald-400 hover:scale-[1.01] active:scale-95 disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Know it [2]</span>
              </button>
            </div>

            {/* Bottom Navigation Controls */}
            <div className="mt-4 flex items-center justify-between w-full max-w-2xl px-2 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => triggerSwitch("prev")}
                disabled={currentIndex === 0 || isTransitioning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous [←]</span>
              </button>

              <span className="font-mono text-xs text-slate-500">
                {currentIndex + 1} of {deck.length}
              </span>

              <button
                type="button"
                onClick={() => triggerSwitch("next")}
                disabled={isTransitioning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition-all disabled:opacity-30"
              >
                <span>Next [→]</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function StudyModal({ cards, categoryName, isOpen, onClose }: Props) {
  if (!isOpen) return null
  return (
    <StudyModalContent
      key={`${categoryName}-${cards.length}`}
      cards={cards}
      categoryName={categoryName}
      onClose={onClose}
    />
  )
}
