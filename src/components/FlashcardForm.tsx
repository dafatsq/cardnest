"use client"

import { useState, useRef, useEffect } from "react"
import type { FormEvent, ChangeEvent } from "react"
import Image from "next/image"
import { Flashcard } from "@/types"

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
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    flashcard?.front_image_url ?? null,
  )
  const [backImagePreview, setBackImagePreview] = useState<string | null>(
    flashcard?.back_image_url ?? null,
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use refs for input previews
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("category_id", categoryId)

    // Include hidden field for existing images
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

  // Preview handlers
  const handleFrontImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFrontImagePreview(url)
      // Store so form submission includes it
      // We need to re-add the file to the FormData — handled by the input
    } else {
      // If user cancels, clear
      if (!flashcard?.front_image_url) {
        setFrontImagePreview(null)
      }
    }
  }

  const handleBackImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setBackImagePreview(url)
    } else {
      if (!flashcard?.back_image_url) {
        setBackImagePreview(null)
      }
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

  // Cleanup object URLs on unmount
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
    <form action={action} onSubmit={handleSubmit} className="space-y-6">
      {/* Front side */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Front — Text
        </label>
        <textarea
          name="front_text"
          placeholder="What's on the front of the card? (optional if you have an image)"
          rows={3}
          defaultValue={flashcard?.front_text ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Front — Image
        </label>
        <input
          ref={frontInputRef}
          type="file"
          name="front_image"
          accept="image/*"
          onChange={handleFrontImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:hover:bg-blue-700"
        />
        {frontImagePreview && (
          <div className="mt-2 flex items-center gap-2">
            <div className="relative h-20 w-20 rounded-md border border-gray-200">
              <Image
                src={frontImagePreview}
                alt="Front preview"
                fill
                className="rounded-md object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeFrontImage}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Back side */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Back — Text
        </label>
        <textarea
          name="back_text"
          placeholder="What's on the back of the card? (the answer, definition, etc.)"
          rows={3}
          defaultValue={flashcard?.back_text ?? ""}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Back — Image
        </label>
        <input
          ref={backInputRef}
          type="file"
          name="back_image"
          accept="image/*"
          onChange={handleBackImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white file:hover:bg-blue-700"
        />
        {backImagePreview && (
          <div className="mt-2 flex items-center gap-2">
            <div className="relative h-20 w-20 rounded-md border border-gray-200">
              <Image
                src={backImagePreview}
                alt="Back preview"
                fill
                className="rounded-md object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeBackImage}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  )
}
