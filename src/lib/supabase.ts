import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://placeholder.supabase.co' && 
  supabaseAnonKey !== 'placeholder_key'
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    })
  : null

// Admin email - in production, this would be managed through environment variables
export const ADMIN_EMAIL = 'admin@trekzone.com'

export const isAdmin = (email: string | undefined): boolean => {
  return email === ADMIN_EMAIL
}