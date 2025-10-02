'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { detectKey } from '@/lib/music-theory'

interface TransposeControlsProps {
  text: string
  onTranspose: (semitones: number) => void
  onReset: () => void
}

export default function TransposeControls({ text, onTranspose, onReset }: TransposeControlsProps) {
  const [currentKey, setCurrentKey] = useState('C')
  const [semitones, setSemitones] = useState(0)

  // Detect key from text when it changes
  useEffect(() => {
    if (text) {
      const chords = text.match(/\[([^\]]+)\]/g)?.map(match => match.slice(1, -1)) || []
      const detectedKey = detectKey(chords)
      setCurrentKey(detectedKey)
    }
  }, [text])

  const handleTranspose = (newSemitones: number) => {
    setSemitones(newSemitones)
    onTranspose(newSemitones)
  }

  const handleReset = () => {
    setSemitones(0)
    onReset()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return // Don't trigger shortcuts when typing in inputs
      }
      
      if (e.key === '-') {
        e.preventDefault()
        handleTranspose(semitones - 1)
      } else if (e.key === '=') {
        e.preventDefault()
        handleTranspose(semitones + 1)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [semitones])

  const getNewKey = () => {
    if (semitones === 0) return currentKey
    
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const currentIndex = chromatic.indexOf(currentKey)
    if (currentIndex === -1) return currentKey
    
    const newIndex = (currentIndex + semitones) % 12
    const adjustedIndex = newIndex < 0 ? newIndex + 12 : newIndex
    return chromatic[adjustedIndex]
  }

  return (
    <div className="space-y-4">
      {/* Current Key Display */}
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Current Key</div>
        <div className="text-2xl font-bold text-gray-900">{currentKey}</div>
        {semitones !== 0 && (
          <div className="text-sm text-primary-600 font-medium">
            → {getNewKey()} ({semitones > 0 ? '+' : ''}{semitones})
          </div>
        )}
      </div>

      {/* Transpose Buttons */}
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => handleTranspose(semitones - 1)}
          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          title="Transpose down 1 semitone (- key)"
        >
          <Minus className="w-5 h-5 text-gray-600" />
        </button>

        <div className="px-4 py-2 bg-gray-50 rounded-lg min-w-[60px] text-center">
          <span className="text-lg font-mono font-bold text-gray-900">
            {semitones > 0 ? '+' : ''}{semitones}
          </span>
        </div>

        <button
          onClick={() => handleTranspose(semitones + 1)}
          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          title="Transpose up 1 semitone (= key)"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Quick Transpose Options */}
      <div className="grid grid-cols-3 gap-2">
        {[-2, -1, 0, 1, 2, 3].map((semitones) => (
          <button
            key={semitones}
            onClick={() => handleTranspose(semitones)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              semitones === 0
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {semitones > 0 ? '+' : ''}{semitones}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      {semitones !== 0 && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Original</span>
        </button>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="text-xs text-gray-500 text-center">
        Use <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">-</kbd> and <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">=</kbd> for quick transpose
      </div>
    </div>
  )
}
