import { NextRequest, NextResponse } from 'next/server'
import { transposeText, detectKey } from '@/lib/music-theory'

export async function POST(request: NextRequest) {
  try {
    const { text, semitones, targetKey } = await request.json()
    
    if (!text || typeof semitones !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }
    
    // If no targetKey provided, detect from current chords
    const key = targetKey || detectKey(text)
    
    const transposedText = transposeText(text, semitones, key)
    
    return NextResponse.json({
      success: true,
      text: transposedText
    })
    
  } catch (error: any) {
    console.error('Transpose error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
