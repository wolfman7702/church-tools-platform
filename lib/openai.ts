import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const processSheetMusic = async (imageBase64: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are converting sheet music to Planning Center Services format.

CRITICAL: Chords must be positioned ABOVE lyrics using spaces for alignment.

CORRECT FORMAT EXAMPLE:
VERSE 1
    [Bb]                    [Bb]
We worship the God who was, we worship the God who is
                     [Gm]  [F]   [Eb]
We worship the God who ever-more will be

INCORRECT FORMAT (DO NOT USE):
[Bb]We worship the God who was

FORMATTING RULES:

1. Section headers: INTRO, VERSE 1, CHORUS, BRIDGE, ENDING (all caps, alone on line)

2. For intro/outro chord progressions:
[Bb] [/] [Bb2] [/] | [Eb] [/] [/] [/]

3. For verses with lyrics:
   - First line: chords with spacing
   - Second line: lyrics that align under the chords
   - Use spaces to position chords directly above syllables
   
4. Preserve all chord variations:
   - Slash chords: F/A, Eb/F
   - Suspended: Fsus, Fsus4
   - 7th chords: Gm7, Cm7
   - 2nd chords: Bb2
   
5. Include ALL chords from the sheet music, even if multiple per word

6. Maintain proper line breaks and verse structure

Output ONLY the formatted text with proper spacing. Be precise with alignment.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })

    const text = response.choices[0]?.message?.content || ''
    return { success: true, text }
  } catch (error) {
    console.error('Error processing sheet music:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
