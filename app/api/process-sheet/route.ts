import { NextRequest, NextResponse } from 'next/server'
import { processSheetMusic } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    // Validate that it's a base64 data URL
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format' },
        { status: 400 }
      )
    }

    const result = await processSheetMusic(image)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const extractedText = result.text

    if (!extractedText) {
      return NextResponse.json(
        { success: false, error: 'No text extracted from image' },
        { status: 500 }
      )
    }

    // Basic validation
    const chordCount = (extractedText.match(/\[/g) || []).length

    if (chordCount < 5) {
      console.warn('Very few chords detected:', chordCount)
      // Still return it, but flag it
    }

    return NextResponse.json({ 
      success: true, 
      text: extractedText,
      chordCount: chordCount,
      warning: chordCount < 5 ? 'Low chord count detected - verify accuracy' : null
    })

  } catch (error) {
    console.error('Full error details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    )
  }
}
