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

CRITICAL: Planning Center uses INLINE chord notation, not chords-above-lyrics.

CORRECT FORMAT (what Planning Center actually uses):
Intro
[Bb] [/] [Bb2] [/] | [Bb] [/] [Fsus] [/] | [Eb] [/] [/] [/]

Verse 1
We [Bb]worship the God who was, we [Bb]worship the God who is
We worship the God who [Gm]ever - [F4]more [Eb2]will be
He [Bb]opened the prison doors, He parted the raging sea
My God, he [Gm]holds the [F4]vic - [Eb2]tory, yeah

Chorus 1
[Bb] There's joy in the house of the Lord
There's joy in the house of the [F]Lord to - [Eb]day
And we won't be quiet, we shout out [Eb/F]Your [Bb]praise

WRONG FORMAT (do NOT use this):
     [Bb]              [Gm]
We worship the God who was

FORMATTING RULES:

1. INLINE CHORDS: Place [Chord] directly before the syllable where it occurs
   - We [Bb]worship (chord before "worship")
   - [Gm]ever - [F4]more (chord before syllable)

2. INTRO/OUTRO: Show full chord progression with repeat markers
   - [Bb] [/] [Bb2] [/] | [Eb] [/] [/] [/]
   - [/] means repeat previous chord
   - | means bar line

3. SECTION HEADERS: All caps, on own line
   - Intro, Verse 1, Verse 2, Chorus 1, Bridge, Ending

4. CHORD TYPES: Preserve ALL variations exactly as shown
   - Slash chords: Eb/F, F/A
   - Suspended: Fsus, F4, Fsus4
   - 7th: Gm7, Cm7
   - 2nd: Bb2, Eb2
   - NO SHARPS if the key uses flats (Bb key = use Eb not D#)

5. CHORD PLACEMENT: Only place chords where they actually change
   - Don't add extra chords mid-phrase
   - Match the sheet music exactly

6. LINE BREAKS: Keep natural phrase boundaries
   - Don't break lines awkwardly
   - Match the lyric phrasing from sheet music

Output ONLY the formatted text. Be extremely precise - this must be copy/paste ready for Planning Center Services.`
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
