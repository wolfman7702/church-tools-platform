import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for user management
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const incrementSongsProcessed = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('songs_processed')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return { error }
  }

  const newCount = (data.songs_processed || 0) + 1

  const { error: updateError } = await supabase
    .from('users')
    .update({ songs_processed: newCount })
    .eq('id', userId)

  if (updateError) {
    console.error('Error updating songs processed:', updateError)
    return { error: updateError }
  }

  return { success: true, newCount }
}

export const getUserUsage = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('songs_processed, is_pro')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user usage:', error)
    return { error }
  }

  return { 
    songsProcessed: data.songs_processed || 0, 
    isPro: data.is_pro || false 
  }
}
