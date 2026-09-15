import { createBrowserClient } from "@supabase/ssr"

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          id: string
          category_id: string
          front_text: string | null
          back_text: string | null
          front_image_url: string | null
          back_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          front_text?: string | null
          back_text?: string | null
          front_image_url?: string | null
          back_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          front_text?: string | null
          back_text?: string | null
          front_image_url?: string | null
          back_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Relationships: []
  }
}

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a minimal stub during static generation / build.
    // Real auth happens on the client after hydration when env vars are present.
    throw new Error("Supabase URL and anon key are required.")
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
