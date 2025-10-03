// Music theory utilities for chord transposition and key detection

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Convert between flats and sharps
const FLAT_TO_SHARP: { [key: string]: string } = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
}

// Chord type patterns
const CHORD_PATTERNS = {
  major: /^[A-G][#b]?$/,
  minor: /^[A-G][#b]?m$/,
  seventh: /^[A-G][#b]?7$/,
  majorSeventh: /^[A-G][#b]?maj7$/,
  minorSeventh: /^[A-G][#b]?m7$/,
  suspended: /^[A-G][#b]?sus[24]?$/,
  suspended2: /^[A-G][#b]?sus2$/,
  suspended4: /^[A-G][#b]?sus4$/,
  diminished: /^[A-G][#b]?dim$/,
  augmented: /^[A-G][#b]?aug$/,
  slash: /^[A-G][#b]?\/[A-G][#b]?$/,
  ninth: /^[A-G][#b]?9$/,
  eleventh: /^[A-G][#b]?11$/,
  thirteenth: /^[A-G][#b]?13$/,
  add2: /^[A-G][#b]?2$/,
  add4: /^[A-G][#b]?4$/,
  add9: /^[A-G][#b]?add9$/,
  major9: /^[A-G][#b]?maj9$/,
  minor9: /^[A-G][#b]?m9$/,
  dominant9: /^[A-G][#b]?9$/,
  halfDiminished: /^[A-G][#b]?m7b5$/,
  fullyDiminished: /^[A-G][#b]?dim7$/
}

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || semitones === 0) return chord
  
  // Handle slash chords (e.g., F/A)
  if (chord.includes('/')) {
    const [main, bass] = chord.split('/')
    return `${transposeChord(main, semitones)}/${transposeChord(bass, semitones)}`
  }
  
  // Extract root note and quality
  const match = chord.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return chord
  
  const [, root, quality] = match
  
  // Normalize to sharp notation
  let normalizedRoot = root.replace('Db', 'C#').replace('Eb', 'D#')
    .replace('Gb', 'F#').replace('Ab', 'G#').replace('Bb', 'A#')
  
  // Find index and transpose
  let index = NOTES.indexOf(normalizedRoot)
  if (index === -1) return chord
  
  index = (index + semitones + 12) % 12
  
  // Return with original flat/sharp preference
  const newRoot = root.includes('b') ? FLAT_NOTES[index] : NOTES[index]
  return newRoot + quality
}

export function transposeText(text: string, semitones: number): string {
  if (semitones === 0) return text
  
  // Find all chord patterns [Chord]
  return text.replace(/\[([^\]]+)\]/g, (match, chord) => {
    const transposed = transposeChord(chord, semitones)
    return `[${transposed}]`
  })
}

export function parseChords(text: string): string[] {
  if (!text) return []
  
  const chordMatches = text.match(/\[([^\]]+)\]/g)
  if (!chordMatches) return []
  
  return chordMatches.map(match => match.slice(1, -1).trim())
}

export function detectKey(text: string): string {
  const chords = text.match(/\[([^\]]+)\]/g) || []
  if (chords.length === 0) return 'C'
  
  // Get first chord, strip brackets - add safety check
  const firstChord = chords[0]?.replace(/[\[\]]/g, '')
  if (!firstChord) return 'C'
  
  const root = firstChord.match(/^([A-G][#b]?)/)?.[1] || 'C'
  return root
}

export function getChordNotes(chord: string): string[] {
  const rootMatch = chord.match(/^([A-G][#b]?)/)
  if (!rootMatch) return []

  const root = rootMatch[1]
  const chordType = chord.substring(root.length)
  
  // Convert root to index
  const normalizedRoot = FLAT_TO_SHARP[root] || root
  const rootIndex = CHROMATIC_SCALE.indexOf(normalizedRoot)
  
  if (rootIndex === -1) return []

  const notes = [normalizedRoot]

  // Add chord intervals based on type
  if (chordType.includes('maj7') || chordType.includes('M7')) {
    notes.push(CHROMATIC_SCALE[(rootIndex + 4) % 12]) // Major 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 7) % 12]) // Perfect 5th
    notes.push(CHROMATIC_SCALE[(rootIndex + 11) % 12]) // Major 7th
  } else if (chordType.includes('m7')) {
    notes.push(CHROMATIC_SCALE[(rootIndex + 3) % 12]) // Minor 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 7) % 12]) // Perfect 5th
    notes.push(CHROMATIC_SCALE[(rootIndex + 10) % 12]) // Minor 7th
  } else if (chordType.includes('7')) {
    notes.push(CHROMATIC_SCALE[(rootIndex + 4) % 12]) // Major 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 7) % 12]) // Perfect 5th
    notes.push(CHROMATIC_SCALE[(rootIndex + 10) % 12]) // Minor 7th
  } else if (chordType.includes('m')) {
    notes.push(CHROMATIC_SCALE[(rootIndex + 3) % 12]) // Minor 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 7) % 12]) // Perfect 5th
  } else if (chordType.includes('dim')) {
    notes.push(CHROMATIC_SCALE[(rootIndex + 3) % 12]) // Minor 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 6) % 12]) // Diminished 5th
  } else if (chordType.includes('aug')) {
    notes.push(CHROMATIC_SCALE[(rootIndex + 4) % 12]) // Major 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 8) % 12]) // Augmented 5th
  } else {
    // Major chord
    notes.push(CHROMATIC_SCALE[(rootIndex + 4) % 12]) // Major 3rd
    notes.push(CHROMATIC_SCALE[(rootIndex + 7) % 12]) // Perfect 5th
  }

  return notes
}

export function getKeySignature(key: string): string[] {
  const keySignatures: { [key: string]: string[] } = {
    'C': [],
    'G': ['F#'],
    'D': ['F#', 'C#'],
    'A': ['F#', 'C#', 'G#'],
    'E': ['F#', 'C#', 'G#', 'D#'],
    'B': ['F#', 'C#', 'G#', 'D#', 'A#'],
    'F#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'],
    'C#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'],
    'F': ['Bb'],
    'Bb': ['Bb', 'Eb'],
    'Eb': ['Bb', 'Eb', 'Ab'],
    'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
    'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb'],
    'Gb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
    'Cb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
  }

  return keySignatures[key] || []
}

// Get all 12 keys for key selector
export function getAllKeys(): Array<{ value: string; label: string }> {
  return [
    { value: 'C', label: 'C' },
    { value: 'C#', label: 'C# / Db' },
    { value: 'Db', label: 'C# / Db' },
    { value: 'D', label: 'D' },
    { value: 'D#', label: 'D# / Eb' },
    { value: 'Eb', label: 'D# / Eb' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'F#', label: 'F# / Gb' },
    { value: 'Gb', label: 'F# / Gb' },
    { value: 'G', label: 'G' },
    { value: 'G#', label: 'G# / Ab' },
    { value: 'Ab', label: 'G# / Ab' },
    { value: 'A', label: 'A' },
    { value: 'A#', label: 'A# / Bb' },
    { value: 'Bb', label: 'A# / Bb' },
    { value: 'B', label: 'B' }
  ]
}

// Calculate semitone difference between two keys
export function getSemitoneDifference(fromKey: string, toKey: string): number {
  const normalizedFrom = FLAT_TO_SHARP[fromKey] || fromKey
  const normalizedTo = FLAT_TO_SHARP[toKey] || toKey
  
  const fromIndex = CHROMATIC_SCALE.indexOf(normalizedFrom)
  const toIndex = CHROMATIC_SCALE.indexOf(normalizedTo)
  
  if (fromIndex === -1 || toIndex === -1) return 0
  
  return (toIndex - fromIndex + 12) % 12
}
