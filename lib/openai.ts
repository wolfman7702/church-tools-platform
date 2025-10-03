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

CRITICAL FORMATTING RULES:

1. SECTION HEADERS:
   - Use: INTRO, VERSE 1, VERSE 2, CHORUS, BRIDGE, ENDING, OUTRO
   - All caps, on their own line

2. CHORD PLACEMENT:
   - Place [Chord] BEFORE the syllable where it occurs
   - Example: We [Bb]worship (NOT [Bb]We worship)
   - Use exact syllable placement from the sheet music

3. CHORD PROGRESSIONS (Intro/Outro):
   - Format: [Bb] [/] [Bb2] [/] [|] [Eb] [/] [/] [/]
   - [/] means repeat previous chord
   - [|] means bar line
   - Show full progression, not just first chord

4. CHORD TYPES:
   - Include ALL variations: Bb2, Fsus, Gm7, F/A, Eb/F
   - Slash chords: bass note after slash (F/A means F chord over A bass)
   - Suspended: Fsus or Fsus4
   - 7th chords: Cm7, Gm7
   - Major 7: Cmaj7
   - 2nd: Bb2

5. LYRICS:
   - Keep natural line breaks from sheet music
   - Don't break lines awkwardly
   - Maintain verse structure

6. SPACING:
   - Chords positioned to align above correct syllables
   - Use spaces to align chord vertically above lyric

Output ONLY the formatted text. Be extremely precise with chord placement.`
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
