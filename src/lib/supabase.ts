import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseSettingsMessage: string | null =
  !supabaseUrl || !supabaseAnonKey
    ? 'ToolLedger is not connected yet. The Supabase settings are missing. Copy .env.example to .env, add your project URL and anon key, then restart the app.'
    : null

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
