'use client'

import { useState, useEffect } from 'react'
import { Music, TrendingUp, AlertTriangle } from 'lucide-react'

interface KeyResult {
  key: string
  capo: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  strainedNotes: number
  range: {
    low: string
    high: string
  }
}

const NOTE_ORDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const OCTAVE_RANGE = ['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6']

export default function KeyFinderPage() {
  const [vocalistName, setVocalistName] = useState('')
  const [lowestNote, setLowestNote] = useState('C3')
  const [highestNote, setHighestNote] = useState('C5')
  const [originalKey, setOriginalKey] = useState('C')
  const [results, setResults] = useState<KeyResult[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const getNoteIndex = (note: string): number => {
    return OCTAVE_RANGE.indexOf(note)
  }

  const getNoteFromIndex = (index: number): string => {
    return OCTAVE_RANGE[index] || note
  }

  const transposeNote = (note: string, semitones: number): string => {
    const currentIndex = getNoteIndex(note)
    if (currentIndex === -1) return note
    
    const newIndex = currentIndex + semitones
    if (newIndex < 0 || newIndex >= OCTAVE_RANGE.length) return note
    
    return getNoteFromIndex(newIndex)
  }

  const calculateKeyResults = (): KeyResult[] => {
    const lowIndex = getNoteIndex(lowestNote)
    const highIndex = getNoteIndex(highestNote)
    
    if (lowIndex === -1 || highIndex === -1 || lowIndex >= highIndex) {
      return []
    }

    const vocalRange = highIndex - lowIndex
    const results: KeyResult[] = []

    // Test all 12 keys
    for (let semitones = -6; semitones <= 6; semitones++) {
      const newLow = transposeNote(lowestNote, semitones)
      const newHigh = transposeNote(highestNote, semitones)
      
      const newLowIndex = getNoteIndex(newLow)
      const newHighIndex = getNoteIndex(newHigh)
      
      if (newLowIndex === -1 || newHighIndex === -1) continue

      // Calculate how many notes would be strained
      let strainedNotes = 0
      const comfortableLow = lowIndex
      const comfortableHigh = highIndex
      
      if (newLowIndex < comfortableLow) {
        strainedNotes += comfortableLow - newLowIndex
      }
      if (newHighIndex > comfortableHigh) {
        strainedNotes += newHighIndex - comfortableHigh
      }

      // Determine difficulty
      let difficulty: 'Easy' | 'Medium' | 'Hard'
      if (strainedNotes === 0) {
        difficulty = 'Easy'
      } else if (strainedNotes <= 2) {
        difficulty = 'Medium'
      } else {
        difficulty = 'Hard'
      }

      // Calculate capo position (assuming guitar)
      const capo = semitones < 0 ? 12 + semitones : semitones

      const keyName = NOTE_ORDER[(NOTE_ORDER.indexOf(originalKey) + semitones + 12) % 12]

      results.push({
        key: keyName,
        capo,
        difficulty,
        strainedNotes,
        range: {
          low: newLow,
          high: newHigh
        }
      })
    }

    // Sort by difficulty and strained notes
    return results.sort((a, b) => {
      const difficultyOrder = { 'Easy': 0, 'Medium': 1, 'Hard': 2 }
      if (difficultyOrder[a.difficulty] !== difficultyOrder[b.difficulty]) {
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      }
      return a.strainedNotes - b.strainedNotes
    })
  }

  const findKeys = () => {
    setIsCalculating(true)
    setTimeout(() => {
      const calculatedResults = calculateKeyResults()
      setResults(calculatedResults)
      setIsCalculating(false)
    }, 500)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRangePercentage = (low: string, high: string) => {
    const lowIndex = getNoteIndex(low)
    const highIndex = getNoteIndex(high)
    const totalRange = OCTAVE_RANGE.length
    
    if (lowIndex === -1 || highIndex === -1) return 0
    
    const startPercent = (lowIndex / totalRange) * 100
    const widthPercent = ((highIndex - lowIndex) / totalRange) * 100
    
    return { startPercent, widthPercent }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Key Finder for Vocalists
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect key for your singer's range with intelligent recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Vocal Range Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vocalist Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={vocalistName}
                    onChange={(e) => setVocalistName(e.target.value)}
                    placeholder="e.g., Sarah, Lead Singer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lowest Comfortable Note
                  </label>
                  <select
                    value={lowestNote}
                    onChange={(e) => setLowestNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {OCTAVE_RANGE.slice(0, 24).map(note => (
                      <option key={note} value={note}>{note}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highest Comfortable Note
                  </label>
                  <select
                    value={highestNote}
                    onChange={(e) => setHighestNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {OCTAVE_RANGE.slice(12, 36).map(note => (
                      <option key={note} value={note}>{note}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Song Key
                  </label>
                  <select
                    value={originalKey}
                    onChange={(e) => setOriginalKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {NOTE_ORDER.map(note => (
                      <option key={note} value={note}>{note}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={findKeys}
                  disabled={isCalculating}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isCalculating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Music className="w-5 h-5 mr-2" />
                      Find Keys
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Current Range Display */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Range
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Lowest: {lowestNote}</span>
                  <span className="text-gray-600">Highest: {highestNote}</span>
                </div>
                <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg"
                    style={{
                      left: `${(getNoteIndex(lowestNote) / OCTAVE_RANGE.length) * 100}%`,
                      width: `${((getNoteIndex(highestNote) - getNoteIndex(lowestNote)) / OCTAVE_RANGE.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recommended Keys
                </h2>
                
                <div className="space-y-4">
                  {results.slice(0, 6).map((result, index) => {
                    const range = getRangePercentage(result.range.low, result.range.high)
                    const isRecommended = index < 3
                    
                    return (
                      <div 
                        key={result.key}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          isRecommended 
                            ? 'border-primary-200 bg-primary-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl font-bold text-gray-900">
                              {result.key}
                            </div>
                            {isRecommended && (
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(result.difficulty)}`}>
                              {result.difficulty}
                            </span>
                            {result.capo > 0 && (
                              <span className="text-xs text-gray-600">
                                Capo {result.capo}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{result.range.low}</span>
                            <span>{result.range.high}</span>
                          </div>
                          
                          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="absolute top-0 h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                              style={{
                                left: `${range.startPercent}%`,
                                width: `${range.widthPercent}%`
                              }}
                            ></div>
                          </div>

                          {result.strainedNotes > 0 && (
                            <div className="flex items-center text-xs text-amber-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {result.strainedNotes} note{result.strainedNotes > 1 ? 's' : ''} outside comfortable range
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {results.length === 0 && !isCalculating && (
              <div className="card p-6 text-center">
                <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Find Your Keys
                </h3>
                <p className="text-gray-600">
                  Set your vocal range and click "Find Keys" to see recommendations
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How to use the Key Finder
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Set Your Range</h4>
                <p className="text-sm text-gray-600">
                  Choose your lowest and highest comfortable notes
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Enter Original Key</h4>
                <p className="text-sm text-gray-600">
                  Tell us what key the song is originally in
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Recommendations</h4>
                <p className="text-sm text-gray-600">
                  See which keys work best for your vocal range
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
