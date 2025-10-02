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
              text: `You are a music transcription expert. Analyze this sheet music and extract:

1. All chord symbols with precise placement
2. Lyrics with syllable-by-syllable chord alignment
3. Song structure sections using standard names: VERSE 1, VERSE 2, CHORUS, BRIDGE, etc.

Output in Planning Center Services format following these rules:
- Chords in square brackets: [C], [G7], [F/C], [Am]
- Place the chord bracket immediately before the syllable where the chord change occurs
- Break words into syllables when chords change mid-word: [C]A-[F/C]maz-[C]ing
- Section headers in ALL CAPS on their own line (use standard names: VERSE 1, VERSE 2, CHORUS, BRIDGE, INTRO, OUTRO, etc.)
- Preserve exact lyric spacing and line breaks
- Ensure chord placement is precise - chords should align with the exact syllable where the change happens

Example output:
VERSE 1
[C]My [F/C]Je-[C]sus, I [G]love [G7]Thee
[C]I [F/C]know [C]Thou art [G]mine[G7]

CHORUS
[C]For [G]Thee all the [Am]plea-[F]sures of [C]sin I re-[G]sign

Output ONLY the formatted text with no explanations, markdown, or extra commentary.`
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
