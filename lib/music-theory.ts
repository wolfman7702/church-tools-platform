// Music theory utilities for chord transposition and key detection

const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const CHROMATIC_SCALE_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Convert between sharps and flats
const SHARP_TO_FLAT: { [key: string]: string } = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
}

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
  suspended: /^[A-G][#b]?sus[24]$/,
  diminished: /^[A-G][#b]?dim$/,
  augmented: /^[A-G][#b]?aug$/,
  slash: /^[A-G][#b]?\/[A-G][#b]?$/
}

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || semitones === 0) return chord

  // Handle slash chords (e.g., F/C)
  if (CHORD_PATTERNS.slash.test(chord)) {
    const [root, bass] = chord.split('/')
    const transposedRoot = transposeNote(root, semitones)
    const transposedBass = transposeNote(bass, semitones)
    return `${transposedRoot}/${transposedBass}`
  }

  // Extract root note and chord type
  const rootMatch = chord.match(/^([A-G][#b]?)/)
  if (!rootMatch) return chord

  const root = rootMatch[1]
  const chordType = chord.substring(root.length)
  const transposedRoot = transposeNote(root, semitones)

  return transposedRoot + chordType
}

export function transposeNote(note: string, semitones: number): string {
  if (!note) return note

  // Normalize to sharps for calculation
  const normalizedNote = FLAT_TO_SHARP[note] || note
  const currentIndex = CHROMATIC_SCALE.indexOf(normalizedNote)
  
  if (currentIndex === -1) return note

  let newIndex = (currentIndex + semitones) % 12
  if (newIndex < 0) newIndex += 12

  const newNote = CHROMATIC_SCALE[newIndex]
  
  // Convert back to flats if original was flat
  return SHARP_TO_FLAT[newNote] || newNote
}

export function transposeText(text: string, semitones: number): string {
  if (!text || semitones === 0) return text

  // Find all chord patterns [Chord] and transpose them
  return text.replace(/\[([^\]]+)\]/g, (match, chord) => {
    const transposedChord = transposeChord(chord.trim(), semitones)
    return `[${transposedChord}]`
  })
}

export function parseChords(text: string): string[] {
  if (!text) return []
  
  const chordMatches = text.match(/\[([^\]]+)\]/g)
  if (!chordMatches) return []
  
  return chordMatches.map(match => match.slice(1, -1).trim())
}

export function detectKey(chords: string[]): string {
  if (!chords || chords.length === 0) return 'C'

  // Simple key detection based on chord frequency
  const chordCounts: { [key: string]: number } = {}
  
  chords.forEach(chord => {
    const root = chord.match(/^([A-G][#b]?)/)?.[1]
    if (root) {
      chordCounts[root] = (chordCounts[root] || 0) + 1
    }
  })

  // Find the most common root note
  const mostCommon = Object.entries(chordCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0]

  return mostCommon || 'C'
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
