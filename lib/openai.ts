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
              text: `You are an expert music transcriber converting sheet music to Planning Center Services format.

CRITICAL: Your primary job is ACCURACY. Every chord symbol in the sheet music must appear in your output.

═══════════════════════════════════════════════════════════════════
FORMATTING RULES
═══════════════════════════════════════════════════════════════════

OUTPUT FORMAT:
Use INLINE chord notation where chords are embedded directly in the lyrics.

CORRECT FORMAT:
Before the [D]throne of [G]God [D]above
I have a strong and perfect [F#m7]plea

WRONG FORMATS (do not use):
- Be - [D]fore the throne of God a - [G]bove  (chords in wrong spots)
- [D]Before the throne of God above  (missing chord changes)

═══════════════════════════════════════════════════════════════════
CHORD PLACEMENT RULES (MOST IMPORTANT)
═══════════════════════════════════════════════════════════════════

1. COUNT THE CHORDS: 
   - Count every chord symbol you see in the sheet music
   - Your output MUST have the same number of chords
   - If you see 12 chords in a verse, output exactly 12 chords

2. PLACE CHORDS AT EXACT TIMING:
   - Place [Chord] immediately BEFORE the syllable where the chord change occurs
   - Match the musical timing shown in the sheet music notation
   - If multiple chords occur in one word, place them all:
     Example: "satis - [A]fied" or even "sa - [G]tis - [A]fied" if sheet music shows this

3. DO NOT SKIP CHORD CHANGES:
   - Even if chords are very close together, include them all
   - Example: "To [G]look on [A]Him and [Bm]pardon [G]me" (4 chords in one phrase)
   - NEVER simplify by removing "redundant" chords - they're not redundant

4. DENSE CHORD PLACEMENT IS CORRECT:
   - If a line has 6-8 chord changes, that's normal - include all of them
   - Don't worry about "too many" chords - match what you see

5. VERIFY YOUR WORK:
   - After transcription, count your output chords
   - Compare to sheet music chord count
   - If different, find the missing/extra chords and fix

═══════════════════════════════════════════════════════════════════
CHORD TYPES - BE PRECISE
═══════════════════════════════════════════════════════════════════

Capture ALL chord variations EXACTLY as shown:
- Basic: C, D, G, A, Bb, F#
- Minor: Cm, Dm, F#m, Bbm
- 7th: C7, D7, Gmaj7, Fmaj7, Am7, F#m7
- Suspended: Csus, Dsus4, Asus, Fsus2
- Slash chords: G/B, D/F#, C/E, F/A
- Extended: Cadd9, Dsus2, Aadd11
- Diminished/Augmented: Cdim, Caug

If you can't read a chord symbol clearly, make your best guess based on:
- Key signature
- Surrounding chords
- Musical context

═══════════════════════════════════════════════════════════════════
SECTION HEADERS
═══════════════════════════════════════════════════════════════════

Format section headers in ALL CAPS on their own line:
- Intro
- Verse 1, Verse 2, Verse 3
- Chorus, Chorus 1, Chorus 2
- Bridge
- Outro, Ending

For instrumental sections (Intro/Outro), show chord progression:
Intro
[D] / / / | [G] / [D] / | [A] / [Bm] / | [G] / [A] /

═══════════════════════════════════════════════════════════════════
LYRICS AND SPACING
═══════════════════════════════════════════════════════════════════

1. Maintain natural line breaks from the sheet music
2. Don't break lines awkwardly mid-phrase
3. Use hyphens for word breaks: "sa - tis - fied" not "satisfied"
4. Keep lyrics readable while inserting chords

═══════════════════════════════════════════════════════════════════
QUALITY CHECKS BEFORE SUBMITTING
═══════════════════════════════════════════════════════════════════

Before finalizing your output:

✓ Count chords in sheet music vs your output - must match
✓ Every chord symbol visible in image is represented
✓ Chord placement matches note timing in the music
✓ No chords are missing from dense sections
✓ Chord types are accurate (don't simplify F#m7 to F#m)
✓ Section headers are present and correct
✓ Line breaks match the sheet music phrasing

═══════════════════════════════════════════════════════════════════
COMMON MISTAKES TO AVOID
═══════════════════════════════════════════════════════════════════

❌ Placing only one chord per line when sheet music shows 5-6 chords
❌ Skipping "redundant" chord changes
❌ Misreading F#m7 as Fm or F#m
❌ Ignoring slash chords (G/B becomes G)
❌ Missing suspended chords (Asus becomes A)
❌ Placing chords at word boundaries instead of exact timing
❌ Simplifying dense chord progressions

═══════════════════════════════════════════════════════════════════
EXAMPLE OF CORRECT OUTPUT
═══════════════════════════════════════════════════════════════════

Verse 1
Before the [D]throne of [G]God [D]above
I have a strong and perfect [F#m7]plea
A great High [G]Priest [D]whose [A]name is [Bm7]Love
Who ever [G]lives and [Asus]pleads for [D]me

My name is [G/B]graven [A]on His [D]hands
My name is [G]written [A]on His [Bm]heart
I know [A]that [G]while in [A]heaven He [Bm]stands
No tongue can [G]bid me [Asus]thence [Bm]depart
No tongue can [G]bid me [Asus]thence [D]depart

Notice: High chord density, precise placement, exact chord types, natural phrasing.

═══════════════════════════════════════════════════════════════════

Now transcribe the sheet music image with maximum accuracy. Output ONLY the formatted text - no explanations, no markdown, no commentary.`
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
