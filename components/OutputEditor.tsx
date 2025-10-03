'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Check, Moon, Sun } from 'lucide-react'

interface OutputEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function OutputEditor({ 
  value, 
  onChange, 
  placeholder = "Your converted sheet music will appear here...",
  className = ""
}: OutputEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getWordCount = () => {
    return value.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharacterCount = () => {
    return value.length
  }

  const getChordCount = () => {
    const chordMatches = value.match(/\[([^\]]+)\]/g)
    return chordMatches ? chordMatches.length : 0
  }

  // Syntax highlighting for Planning Center format
  const highlightChords = (text: string) => {
    return text
      // Highlight chords
      .replace(/\[([^\]]+)\]/g, '<span class="text-blue-600 font-semibold">[$1]</span>')
      // Highlight section headers
      .replace(/^(VERSE \d+|CHORUS|BRIDGE|INTRO|OUTRO|ENDING)$/gm, '<span class="text-purple-600 font-bold text-lg">$1</span>')
      // Highlight chord progressions
      .replace(/\[([^\]]*)\]\s*\[\/\]/g, '<span class="text-blue-500">[$1] [/]</span>')
      // Highlight bar lines
      .replace(/\[\|\]/g, '<span class="text-gray-500 font-bold">[|]</span>')
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{getCharacterCount()} characters</span>
          <span>{getWordCount()} words</span>
          <span>{getChordCount()} chords</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {/* Copy button */}
          <button
            onClick={handleCopy}
            disabled={!value}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            font-mono text-sm whitespace-pre-wrap w-full min-h-[600px] h-auto p-6 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none
            resize-y overflow-hidden leading-relaxed
            ${className.includes('flex-1') ? 'h-[calc(100vh-300px)]' : ''}
            ${isDarkMode 
              ? 'bg-gray-900 text-gray-100 border-gray-700 placeholder-gray-500' 
              : 'bg-white text-gray-900 placeholder-gray-400'
            }
          `}
          style={{ 
            lineHeight: '1.8',
            fontFamily: 'JetBrains Mono, Courier New, monospace',
            fontSize: '14px'
          }}
        />
        
        {/* Line numbers (optional - can be enabled for better UX) */}
        {value && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gray-50 border-r border-gray-200 rounded-l-lg pointer-events-none">
            {value.split('\n').map((_, index) => (
              <div key={index} className="text-xs text-gray-400 text-center leading-6">
                {index + 1}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Planning Center Format Preview */}
      {value && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="text-sm font-semibold text-blue-800">Planning Center Format Preview</div>
          </div>
          <div 
            className="text-sm font-mono leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: highlightChords(value.slice(0, 300) + (value.length > 300 ? '...' : '')) }}
          />
          {value.length > 300 && (
            <div className="text-xs text-blue-600 mt-2 font-medium">
              Showing first 300 characters • {value.length} total characters
            </div>
          )}
        </div>
      )}
    </div>
  )
}
