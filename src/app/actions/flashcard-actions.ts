"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_")
}

export async function createFlashcardAction(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const categoryId = formData.get("category_id") as string
  const frontText = formData.get("front_text") as string
  const backText = formData.get("back_text") as string
  const frontImage = formData.get("front_image") as File
  const backImage = formData.get("back_image") as File

  if (!categoryId) {
    redirect("/?error=Category+ID+is+required")
  }

  let frontImageUrl: string | null = null
  let backImageUrl: string | null = null

  // Upload front image
  if (frontImage && frontImage.size > 0) {
    const cleanName = sanitizeFilename(frontImage.name)
    const filePath = `${user.id}/${categoryId}/front-${Date.now()}-${cleanName}`
    const { error: uploadError } = await supabase.storage
      .from("flashcard-images")
      .upload(filePath, frontImage)

    if (uploadError) {
      redirect(`/categories/${categoryId}?error=${encodeURIComponent("Failed to upload front image")}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("flashcard-images").getPublicUrl(filePath)

    frontImageUrl = publicUrl
  }

  // Upload back image
  if (backImage && backImage.size > 0) {
    const cleanName = sanitizeFilename(backImage.name)
    const filePath = `${user.id}/${categoryId}/back-${Date.now()}-${cleanName}`
    const { error: uploadError } = await supabase.storage
      .from("flashcard-images")
      .upload(filePath, backImage)

    if (uploadError) {
      redirect(`/categories/${categoryId}?error=${encodeURIComponent("Failed to upload back image")}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("flashcard-images").getPublicUrl(filePath)

    backImageUrl = publicUrl
  }

  const { error: insertError } = await supabase.from("flashcards").insert({
    category_id: categoryId,
    front_text: frontText?.trim() || null,
    back_text: backText?.trim() || null,
    front_image_url: frontImageUrl,
    back_image_url: backImageUrl,
  })

  if (insertError) {
    redirect(`/categories/${categoryId}?error=${encodeURIComponent(insertError.message)}`)
  }

  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath(`/categories/${categoryId}`)
  redirect(`/categories/${categoryId}`)
}

export async function updateFlashcardAction(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string
  const categoryId = formData.get("category_id") as string
  const frontText = formData.get("front_text") as string
  const backText = formData.get("back_text") as string
  const frontImage = formData.get("front_image") as File
  const backImage = formData.get("back_image") as File
  const existingFrontImage = formData.get("existing_front_image") as string
  const existingBackImage = formData.get("existing_back_image") as string

  if (!categoryId || !id) {
    redirect("/?error=Card+and+Category+ID+are+required")
  }

  let frontImageUrl: string | null = existingFrontImage || null
  let backImageUrl: string | null = existingBackImage || null

  // Upload new front image
  if (frontImage && frontImage.size > 0) {
    const cleanName = sanitizeFilename(frontImage.name)
    const filePath = `${user.id}/${categoryId}/front-${Date.now()}-${cleanName}`
    const { error: uploadError } = await supabase.storage
      .from("flashcard-images")
      .upload(filePath, frontImage)

    if (uploadError) {
      redirect(`/categories/${categoryId}?error=${encodeURIComponent("Failed to upload front image")}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("flashcard-images").getPublicUrl(filePath)

    frontImageUrl = publicUrl
  }

  // Upload new back image
  if (backImage && backImage.size > 0) {
    const cleanName = sanitizeFilename(backImage.name)
    const filePath = `${user.id}/${categoryId}/back-${Date.now()}-${cleanName}`
    const { error: uploadError } = await supabase.storage
      .from("flashcard-images")
      .upload(filePath, backImage)

    if (uploadError) {
      redirect(`/categories/${categoryId}?error=${encodeURIComponent("Failed to upload back image")}`)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("flashcard-images").getPublicUrl(filePath)

    backImageUrl = publicUrl
  }

  const { error: updateError } = await supabase
    .from("flashcards")
    .update({
      front_text: frontText?.trim() || null,
      back_text: backText?.trim() || null,
      front_image_url: frontImageUrl,
      back_image_url: backImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("category_id", categoryId)

  if (updateError) {
    redirect(`/categories/${categoryId}?error=${encodeURIComponent(updateError.message)}`)
  }

  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath(`/categories/${categoryId}`)
  redirect(`/categories/${categoryId}`)
}

export async function deleteFlashcardAction(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string
  const categoryId = formData.get("category_id") as string

  await supabase
    .from("flashcards")
    .delete()
    .eq("id", id)
    .eq("category_id", categoryId)

  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath(`/categories/${categoryId}`)
  redirect(`/categories/${categoryId}`)
}
