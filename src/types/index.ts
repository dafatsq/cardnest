import type { Database } from "@/lib/supabase/client"

export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"]
