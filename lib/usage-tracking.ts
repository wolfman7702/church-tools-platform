import { supabase } from './supabase'

// Generate a browser fingerprint for anonymous tracking
export function getBrowserFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('fingerprint', 2, 2)
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height,
    canvas.toDataURL()
  ].join('|')
  
  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'fp_' + Math.abs(hash).toString(36)
}

// Get or create anonymous user
export async function getOrCreateUser(email?: string) {
  const fingerprint = getBrowserFingerprint()
  let userId = localStorage.getItem('churchkit_user_id')
  
  // If we have a stored user ID, try to fetch that user
  if (userId) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (existingUser) {
      // If email is provided and user doesn't have one, update it
      if (email && !existingUser.email) {
        await supabase
          .from('users')
          .update({ email, updated_at: new Date().toISOString() })
          .eq('id', userId)
        
        return { ...existingUser, email }
      }
      return existingUser
    }
  }
  
  // Check if user exists by email
  if (email) {
    const { data: emailUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (emailUser) {
      localStorage.setItem('churchkit_user_id', emailUser.id)
      return emailUser
    }
  }
  
  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      email: email || null,
      user_identifier: fingerprint,
      songs_processed: 0,
      is_pro: false
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating user:', error)
    throw error
  }
  
  localStorage.setItem('churchkit_user_id', newUser.id)
  return newUser
}

// Check if user can convert
export async function canUserConvert(): Promise<{
  canConvert: boolean
  conversionsUsed: number
  needsEmail: boolean
  isPro: boolean
}> {
  const user = await getOrCreateUser()
  
  return {
    canConvert: user.is_pro || user.songs_processed < 3,
    conversionsUsed: user.songs_processed,
    needsEmail: user.songs_processed >= 1 && !user.email,
    isPro: user.is_pro
  }
}

// Increment conversion count
export async function incrementConversionCount() {
  const userId = localStorage.getItem('churchkit_user_id')
  if (!userId) return
  
  await supabase.rpc('increment_conversions', { user_id_param: userId })
}

// Update user email
export async function updateUserEmail(email: string) {
  const userId = localStorage.getItem('churchkit_user_id')
  if (!userId) return
  
  const { data, error } = await supabase
    .from('users')
    .update({ email, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}
