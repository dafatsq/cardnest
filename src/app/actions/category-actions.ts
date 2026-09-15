"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCategoryAction(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string

  if (!name || name.trim().length === 0) {
    redirect("/?error=Category+name+is+required")
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name: name.trim(),
    })
    .select()
    .single()

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/")
  revalidatePath("/categories")
  if (data?.id) {
    redirect(`/categories/${data.id}`)
  } else {
    redirect("/")
  }
}

export async function updateCategoryAction(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string

  if (!name || name.trim().length === 0) {
    redirect("/?error=Category+name+is+required")
  }

  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/")
  revalidatePath("/categories")
  revalidatePath(`/categories/${id}`)
  redirect(`/categories/${id}`)
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string

  await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  revalidatePath("/")
  revalidatePath("/categories")
  redirect("/?message=Category+deleted+successfully")
}
