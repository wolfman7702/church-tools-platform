'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, ChevronDown } from 'lucide-react'
import { detectKey, getAllKeys, getSemitoneDifference } from '@/lib/music-theory'

interface TransposeControlsProps {
  text: string
  onTranspose: (semitones: number) => void
  onReset: () => void
}

export default function TransposeControls({ text, onTranspose, onReset }: TransposeControlsProps) {
  const [currentKey, setCurrentKey] = useState('C')
  const [selectedKey, setSelectedKey] = useState('C')
  const [isOpen, setIsOpen] = useState(false)
  const allKeys = getAllKeys()

  // Detect key from text when it changes
  useEffect(() => {
    if (text) {
      const detectedKey = detectKey(text)
      setCurrentKey(detectedKey)
      setSelectedKey(detectedKey)
    }
  }, [text])

  const handleKeySelect = (key: string) => {
    setSelectedKey(key)
    setIsOpen(false)
    
    if (key === currentKey) {
      onReset()
    } else {
      const semitones = getSemitoneDifference(currentKey, key)
      onTranspose(semitones)
    }
  }

  const handleReset = () => {
    setSelectedKey(currentKey)
    onReset()
  }

  const isTransposed = selectedKey !== currentKey

  return (
    <div className="space-y-4">
      {/* Key Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Transpose to Key</label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <span className="text-lg font-semibold text-gray-900">
              {allKeys.find(k => k.value === selectedKey)?.label || selectedKey}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {allKeys.map((key) => (
                <button
                  key={key.value}
                  onClick={() => handleKeySelect(key.value)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selectedKey === key.value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-900'
                  }`}
                >
                  {key.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Key Display */}
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Original Key</div>
        <div className="text-xl font-bold text-gray-900">{currentKey}</div>
        {isTransposed && (
          <div className="text-sm text-blue-600 font-medium mt-1">
            Transposed to {selectedKey}
          </div>
        )}
      </div>

      {/* Reset Button */}
      {isTransposed && (
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset to Original</span>
        </button>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center">
        Select a key to automatically transpose all chords
      </div>
    </div>
  )
}
