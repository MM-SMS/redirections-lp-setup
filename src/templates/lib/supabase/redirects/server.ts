import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase redirect environment variables. Set NEXT_PUBLIC_SUPABASE_REDIRECT_URL and NEXT_PUBLIC_SUPABASE_REDIRECT_ANON_KEY.'
    )
  }
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
