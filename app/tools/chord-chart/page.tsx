'use client'

import { useState, useRef } from 'react'
import { Copy, Download, Music, Plus, Trash2 } from 'lucide-react'

interface ChordPosition {
  id: string
  chord: string
  position: number
  wordIndex: number
}

const CHORD_OPTIONS = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
  'Cm', 'C#m', 'Dbm', 'Dm', 'D#m', 'Ebm', 'Em', 'Fm', 'F#m', 'Gbm', 'Gm', 'G#m', 'Abm', 'Am', 'A#m', 'Bbm', 'Bm',
  'C7', 'C#7', 'Db7', 'D7', 'D#7', 'Eb7', 'E7', 'F7', 'F#7', 'Gb7', 'G7', 'G#7', 'Ab7', 'A7', 'A#7', 'Bb7', 'B7',
  'Cmaj7', 'C#maj7', 'Dbmaj7', 'Dmaj7', 'D#maj7', 'Ebmaj7', 'Emaj7', 'Fmaj7', 'F#maj7', 'Gbmaj7', 'Gmaj7', 'G#maj7', 'Abmaj7', 'Amaj7', 'A#maj7', 'Bbmaj7', 'Bmaj7',
  'Cm7', 'C#m7', 'Dbm7', 'Dm7', 'D#m7', 'Ebm7', 'Em7', 'Fm7', 'F#m7', 'Gbm7', 'Gm7', 'G#m7', 'Abm7', 'Am7', 'A#m7', 'Bbm7', 'Bm7',
  'Csus2', 'Csus4', 'Dsus2', 'Dsus4', 'Esus2', 'Esus4', 'Fsus2', 'Fsus4', 'Gsus2', 'Gsus4', 'Asus2', 'Asus4', 'Bsus2', 'Bsus4',
  'Cdim', 'C#dim', 'Dbdim', 'Ddim', 'D#dim', 'Ebdim', 'Edim', 'Fdim', 'F#dim', 'Gbdim', 'Gdim', 'G#dim', 'Abdim', 'Adim', 'A#dim', 'Bbdim', 'Bdim',
  'Caug', 'C#aug', 'Dbaug', 'Daug', 'D#aug', 'Ebaug', 'Eaug', 'Faug', 'F#aug', 'Gbaug', 'Gaug', 'G#aug', 'Abaug', 'Aaug', 'A#aug', 'Bbaug', 'Baug'
]

export default function ChordChartPage() {
  const [lyrics, setLyrics] = useState('')
  const [chordPositions, setChordPositions] = useState<ChordPosition[]>([])
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null)
  const [showChordPicker, setShowChordPicker] = useState(false)
  const [chordPickerPosition, setChordPickerPosition] = useState({ x: 0, y: 0 })
  const [outputText, setOutputText] = useState('')
  const [copied, setCopied] = useState(false)
  const lyricsRef = useRef<HTMLTextAreaElement>(null)

  const words = lyrics.split(/\s+/).filter(word => word.length > 0)

  const addChord = (chord: string) => {
    if (selectedWordIndex === null) return

    const newChord: ChordPosition = {
      id: Date.now().toString(),
      chord,
      position: selectedWordIndex,
      wordIndex: selectedWordIndex
    }

    setChordPositions([...chordPositions, newChord])
    setShowChordPicker(false)
    setSelectedWordIndex(null)
    updateOutput()
  }

  const removeChord = (id: string) => {
    setChordPositions(chordPositions.filter(chord => chord.id !== id))
    updateOutput()
  }

  const handleWordClick = (wordIndex: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setChordPickerPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
    setSelectedWordIndex(wordIndex)
    setShowChordPicker(true)
  }

  const updateOutput = () => {
    if (!lyrics) {
      setOutputText('')
      return
    }

    const words = lyrics.split(/\s+/)
    let output = ''
    
    for (let i = 0; i < words.length; i++) {
      const chordsForWord = chordPositions
        .filter(chord => chord.wordIndex === i)
        .sort((a, b) => a.position - b.position)
      
      if (chordsForWord.length > 0) {
        const chordString = chordsForWord.map(chord => `[${chord.chord}]`).join('')
        output += chordString + words[i]
      } else {
        output += words[i]
      }
      
      if (i < words.length - 1) {
        output += ' '
      }
    }

    setOutputText(output)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const downloadText = () => {
    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chord-chart.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setLyrics('')
    setChordPositions([])
    setOutputText('')
  }

  // Update output when lyrics or chords change
  useState(() => {
    updateOutput()
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chord Chart Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create beautiful chord charts with visual chord placement and Planning Center export
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Lyrics Editor */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Lyrics Editor
                </h2>
                <button
                  onClick={clearAll}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              </div>
              
              <textarea
                ref={lyricsRef}
                value={lyrics}
                onChange={(e) => {
                  setLyrics(e.target.value)
                  updateOutput()
                }}
                placeholder="Paste your lyrics here... Each line will be treated as a separate line in the output."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Chord Placement Interface */}
            {lyrics && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Click on words to add chords
                </h3>
                
                <div className="space-y-4">
                  {words.map((word, index) => {
                    const chordsForWord = chordPositions.filter(chord => chord.wordIndex === index)
                    
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex flex-wrap items-center space-x-1">
                          {chordsForWord.map((chord) => (
                            <span
                              key={chord.id}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg"
                            >
                              <span>{chord.chord}</span>
                              <button
                                onClick={() => removeChord(chord.id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        
                        <button
                          onClick={(e) => handleWordClick(index, e)}
                          className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          {word}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Output */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Planning Center Output
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!outputText}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {copied ? (
                      <>
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadText}
                    disabled={!outputText}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                {outputText ? (
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-900">
                    {outputText}
                  </pre>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Your chord chart will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chord Statistics */}
            {chordPositions.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Chord Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {chordPositions.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Chords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {new Set(chordPositions.map(c => c.chord)).size}
                    </div>
                    <div className="text-sm text-gray-600">Unique Chords</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chord Picker Modal */}
        {showChordPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Chord
              </h3>
              
              <div className="grid grid-cols-4 gap-2">
                {CHORD_OPTIONS.map((chord) => (
                  <button
                    key={chord}
                    onClick={() => addChord(chord)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {chord}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowChordPicker(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How to create chord charts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Paste Lyrics</h4>
                <p className="text-sm text-gray-600">
                  Copy and paste your song lyrics into the editor
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Add Chords</h4>
                <p className="text-sm text-gray-600">
                  Click on words to add chords above them
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Export</h4>
                <p className="text-sm text-gray-600">
                  Copy or download your formatted chord chart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
