"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Check } from "lucide-react"
import { CardsDeckIcon } from "@/components/icons/CardsDeckIcon"

interface Props {
  initialName?: string
  categoryId?: string
  action: (formData: FormData) => Promise<void>
  isEditing?: boolean
}

const PRESET_NAMES = [
  "Languages",
  "Biology",
  "Computer Science",
  "History",
  "Medical Terms",
  "Law & Ethics",
  "Math & Formulas",
]

export function CategoryForm({
  initialName = "",
  categoryId,
  action,
  isEditing = false,
}: Props) {
  const [name, setName] = useState(initialName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await action(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
      {/* Form Area - Zero artificial card container */}
      <div className="lg:col-span-7">
        <form action={handleSubmit} className="space-y-6">
          {categoryId && <input type="hidden" name="id" value={categoryId} />}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Category Deck Name
            </label>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Choose a clear, descriptive name for your study topic.
            </p>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spanish Vocabulary, Anatomy 101..."
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Suggestions */}
          {!isEditing && (
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Quick Ideas:
              </span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {PRESET_NAMES.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setName(preset)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-lg disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{isEditing ? "Save Changes" : "Create Deck"}</span>
                </>
              )}
            </button>
            <Link
              href={categoryId ? `/categories/${categoryId}` : "/categories"}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Live Preview - Pure deck card preview without redundant outer container */}
      <div className="lg:col-span-5">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Deck Card Preview</span>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-sm">
            <div className="flex items-start justify-between">
              <CardsDeckIcon className="h-9 w-9 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                0 cards
              </span>
            </div>
            <h4 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
              {name.trim() || "Untitled Deck"}
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Ready for your flashcards
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
