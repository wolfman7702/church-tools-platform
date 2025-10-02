export interface User {
  id: string
  email?: string
  songs_processed: number
  is_pro: boolean
  created_at: string
  updated_at: string
}

export interface Song {
  id: string
  user_id: string
  title: string
  artist?: string
  original_key: string
  chords_and_lyrics: string
  created_at: string
}

export interface Tool {
  id: string
  title: string
  description: string
  icon: string
  href: string
  isPremium: boolean
}

export interface ProcessSheetRequest {
  image: string
}

export interface ProcessSheetResponse {
  success: boolean
  text?: string
  error?: string
}

export interface TransposeRequest {
  text: string
  semitones: number
}

export interface TransposeResponse {
  success: boolean
  text?: string
  error?: string
}

export interface UploadedFile {
  id: string
  file: File
  preview: string
  name: string
  size: number
}
