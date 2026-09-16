"use client"

import { useState, useRef, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Flashcard } from "@/types"
import {
  Upload,
  X,
  Check,
} from "lucide-react"

type Props = {
  categoryId: string
  action: (formData: FormData) => Promise<void>
  submitLabel: string
  flashcard?: Flashcard
}

export default function FlashcardForm({
  categoryId,
  action,
  submitLabel,
  flashcard,
}: Props) {
  const [frontText, setFrontText] = useState(flashcard?.front_text ?? "")
  const [backText, setBackText] = useState(flashcard?.back_text ?? "")
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    flashcard?.front_image_url ?? null,
  )
  const [backImagePreview, setBackImagePreview] = useState<string | null>(
    flashcard?.back_image_url ?? null,
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!frontText.trim() && !frontImagePreview) {
      setError("Please provide at least front text or an image for the question.")
      return
    }

    if (!backText.trim() && !backImagePreview) {
      setError("Please provide at least back text or an image for the answer.")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("category_id", categoryId)

    if (flashcard) {
      formData.set("id", flashcard.id)
      if (!frontImagePreview) {
        formData.set("existing_front_image", "")
      }
      if (!backImagePreview) {
        formData.set("existing_back_image", "")
      }
    }

    try {
      await action(formData)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  const handleFrontImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Front image file is too large (max 10MB)")
        return
      }
      const url = URL.createObjectURL(file)
      setFrontImagePreview(url)
    }
  }

  const handleBackImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Back image file is too large (max 10MB)")
        return
      }
      const url = URL.createObjectURL(file)
      setBackImagePreview(url)
    }
  }

  const removeFrontImage = () => {
    setFrontImagePreview(null)
    if (frontInputRef.current) {
      frontInputRef.current.value = ""
    }
  }

  const removeBackImage = () => {
    setBackImagePreview(null)
    if (backInputRef.current) {
      backInputRef.current.value = ""
    }
  }

  useEffect(() => {
    return () => {
      if (frontImagePreview && frontImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(frontImagePreview)
      }
      if (backImagePreview && backImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(backImagePreview)
      }
    }
  }, [frontImagePreview, backImagePreview])

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <p className="font-semibold">Validation Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* FRONT CARD SIDE */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                Front Side (Question / Prompt)
              </span>
              <span className="text-xs text-slate-400">Card face</span>
            </div>

            {/* Front Text */}
            <div className="mt-5">
              <label
                htmlFor="front_text"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Question or Term
              </label>
              <textarea
                id="front_text"
                name="front_text"
                rows={4}
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder="What is the concept, word, or question you want to test?"
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
              />
            </div>

            {/* Front Image Upload */}
            <div className="mt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Front Image (Optional)
              </label>

              {frontImagePreview ? (
                <div className="relative mt-2 h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  <Image
                    src={frontImagePreview}
                    alt="Front preview"
                    fill
                    sizes="400px"
                    className="object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={removeFrontImage}
                    title="Remove image"
                    className="absolute right-2 top-2 rounded-xl bg-slate-900/70 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-indigo-800">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upload image for front
                  </span>
                  <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 10MB</span>
                  <input
                    ref={frontInputRef}
                    type="file"
                    name="front_image"
                    accept="image/*"
                    onChange={handleFrontImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* BACK CARD SIDE */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-200/80 bg-white p-6 shadow-sm dark:border-indigo-900/60 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Back Side (Answer / Solution)
              </span>
              <span className="text-xs text-slate-400">Revealed on flip</span>
            </div>

            {/* Back Text */}
            <div className="mt-5">
              <label
                htmlFor="back_text"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Answer or Explanation
              </label>
              <textarea
                id="back_text"
                name="back_text"
                rows={4}
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder="What is the answer, definition, mnemonic, or explanation?"
                className="mt-2 block w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-900"
              />
            </div>

            {/* Back Image Upload */}
            <div className="mt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Back Image (Optional)
              </label>

              {backImagePreview ? (
                <div className="relative mt-2 h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  <Image
                    src={backImagePreview}
                    alt="Back preview"
                    fill
                    sizes="400px"
                    className="object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={removeBackImage}
                    title="Remove image"
                    className="absolute right-2 top-2 rounded-xl bg-slate-900/70 p-1.5 text-white backdrop-blur-md transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-indigo-800">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Upload image for back
                  </span>
                  <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 10MB</span>
                  <input
                    ref={backInputRef}
                    type="file"
                    name="back_image"
                    accept="image/*"
                    onChange={handleBackImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Saving Card...</span>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>{submitLabel}</span>
            </>
          )}
        </button>

        <Link
          href={`/categories/${categoryId}`}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
