import { NextRequest, NextResponse } from 'next/server'
import { transposeText } from '@/lib/music-theory'

export async function POST(request: NextRequest) {
  try {
    const { text, semitones } = await request.json()

    if (typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      )
    }

    if (typeof semitones !== 'number' || semitones < -12 || semitones > 12) {
      return NextResponse.json(
        { success: false, error: 'Semitones must be a number between -12 and 12' },
        { status: 400 }
      )
    }

    const transposedText = transposeText(text, semitones)

    return NextResponse.json({
      success: true,
      text: transposedText
    })

  } catch (error) {
    console.error('Error in transpose API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
