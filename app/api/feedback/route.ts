import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { quality, issues, output } = await request.json()

    // Log feedback for analysis (in production, you'd save to database)
    console.log('User feedback received:', {
      quality,
      issues,
      output: output?.substring(0, 100) + '...', // Truncate for logging
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully'
    })

  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process feedback' },
      { status: 500 }
    )
  }
}
