'use client'

import { useState } from 'react'
import { Copy, Plus } from 'lucide-react'

const CHORDS = [
  'C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
  'Cm', 'C#m', 'Dm', 'Ebm', 'Em', 'Fm', 'F#m', 'Gm', 'Abm', 'Am', 'Bbm', 'Bm',
  'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7',
  'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7',
  'Csus', 'Dsus', 'Esus', 'Fsus', 'Gsus', 'Asus', 'Bsus',
  'Csus4', 'Dsus4', 'Esus4', 'Fsus4', 'Gsus4', 'Asus4', 'Bsus4'
]

const SECTIONS = ['Intro', 'Verse 1', 'Verse 2', 'Chorus', 'Bridge', 'Outro']

export default function ChordChartPage() {
  const [lyrics, setLyrics] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showChordPicker, setShowChordPicker] = useState(false)

  const handleLyricsClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setCursorPosition(target.selectionStart)
    setShowChordPicker(true)
  }

  const insertChord = (chord: string) => {
    const before = lyrics.slice(0, cursorPosition)
    const after = lyrics.slice(cursorPosition)
    const newLyrics = before + `[${chord}]` + after
    setLyrics(newLyrics)
    setCursorPosition(cursorPosition + chord.length + 2)
    setShowChordPicker(false)
  }

  const insertSection = (section: string) => {
    const newLyrics = lyrics + `\n${section}\n`
    setLyrics(newLyrics)
    setCursorPosition(newLyrics.length)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lyrics)
    alert('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chord Chart Generator
          </h1>
          <p className="text-lg text-gray-600">
            Paste lyrics, click to add chords, export to Planning Center format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Input Side */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Lyrics & Chords</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowChordPicker(!showChordPicker)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Chord
                </button>
              </div>
            </div>

            {/* Section Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {SECTIONS.map(section => (
                <button
                  key={section}
                  onClick={() => insertSection(section)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600"
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Chord Picker */}
            {showChordPicker && (
              <div className="mb-4 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Select Chord:</h3>
                  <button
                    onClick={() => setShowChordPicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {CHORDS.map(chord => (
                    <button
                      key={chord}
                      onClick={() => insertChord(chord)}
                      className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-blue-100 hover:border-blue-500"
                    >
                      {chord}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lyrics Textarea */}
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              onClick={handleLyricsClick}
              placeholder="Paste your lyrics here, then click where you want to add chords...

Example:
Verse 1
We worship the God who was

Click before 'worship' to add [Bb]: We [Bb]worship"
              className="w-full h-[500px] p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
            />

            <p className="text-sm text-gray-600 mt-2">
              Click anywhere in the text to position your cursor, then click "Add Chord" or choose from the picker above.
            </p>
          </div>

          {/* RIGHT: Preview Side */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Planning Center Preview</h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>

            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg h-[600px] overflow-y-auto">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {lyrics || 'Your formatted chord chart will appear here...'}
              </pre>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">How to use:</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Paste or type your song lyrics on the left</li>
                <li>Click where you want to add a chord</li>
                <li>Select the chord from the picker</li>
                <li>The chord is inserted as [Bb] at that position</li>
                <li>Copy the final output to Planning Center</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}