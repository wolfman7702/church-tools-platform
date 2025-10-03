'use client'

import { useState, useEffect } from 'react'
import { Upload, Loader2, CheckCircle, AlertCircle, Copy, FileText, FileDown } from 'lucide-react'
import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import ImageUpload from '@/components/ImageUpload'
import UsageTracker from '@/components/UsageTracker'
import EmailGateModal from '@/components/EmailGateModal'
import UpgradeModal from '@/components/UpgradeModal'
import { UploadedFile, ProcessSheetResponse, TransposeResponse } from '@/lib/types'
import { canUserConvert, incrementConversionCount } from '@/lib/usage-tracking'
import { detectKey, transposeText } from '@/lib/music-theory'

const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

// Validation function for output quality
function validateOutput(text: string): { warnings: string[], fixed: string } {
  const warnings: string[] = []
  let fixed = text
  
  // Check for suspiciously high chord density
  const lines = text.split('\n')
  for (let line of lines) {
    const chordCount = (line.match(/\[/g) || []).length
    const wordCount = line.split(' ').length
    
    if (chordCount > wordCount * 0.5) {
      warnings.push(`Line has too many chords: "${line.substring(0, 50)}..."`)
    }
  }
  
  // Check for duplicate consecutive chords
  fixed = fixed.replace(/\[([^\]]+)\]\s*\[(\1)\]/g, '[$1]')
  
  return { warnings, fixed }
}

// Helper functions for manual editing
const getCurrentLine = (text: string, cursorPos: number): number => {
  return text.substring(0, cursorPos).split('\n').length - 1
}

const insertChordAtPosition = (text: string, position: number, chord: string): string => {
  return text.substring(0, position) + `[${chord}]` + text.substring(position)
}

const clearChordsFromLine = (text: string, lineIndex: number): string => {
  const lines = text.split('\n')
  if (lineIndex >= 0 && lineIndex < lines.length) {
    lines[lineIndex] = lines[lineIndex].replace(/\[[^\]]+\]/g, '')
  }
  return lines.join('\n')
}

export default function SheetMusicPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [outputText, setOutputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [currentKey, setCurrentKey] = useState('C')
  const [targetKey, setTargetKey] = useState('C')
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [showChordPicker, setShowChordPicker] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)

  // Manual editing functions
  const handleClearChordsFromLine = () => {
    const currentLine = getCurrentLine(outputText, cursorPosition)
    const updated = clearChordsFromLine(outputText, currentLine)
    setOutputText(updated)
    toast.success('Cleared chords from current line')
  }

  const handleInsertChord = (chord: string) => {
    const updated = insertChordAtPosition(outputText, cursorPosition, chord)
    setOutputText(updated)
    setShowChordPicker(false)
    toast.success(`Inserted chord: ${chord}`)
  }

  const handleReportError = async () => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quality: 'poor',
          issues: ['wrong chords', 'placement errors'],
          output: outputText.substring(0, 200) // First 200 chars for context
        })
      })
      toast.success('Error reported - thank you for the feedback!')
    } catch (error) {
      toast.error('Failed to report error')
    }
  }

  const processImages = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one image')
      return
    }

    setIsProcessing(true)
    setError('')
    setSuccess('')

    try {
      // === EXISTING IMAGE PROCESSING CODE ===
      let combinedOutput = ''
      
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i]
        
        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file.file)
        })

        // Call API
        const response = await fetch('/api/process-sheet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64 }),
        })

        const result: ProcessSheetResponse = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to process image')
        }

        if (result.text) {
          combinedOutput += result.text
          if (i < uploadedFiles.length - 1) {
            combinedOutput += '\n\n---\n\n' // Page break between songs
          }
        }
      }

      // Validate output quality
      const { warnings, fixed } = validateOutput(combinedOutput)
      setValidationWarnings(warnings)
      
      if (warnings.length > 0) {
        console.warn('Output validation warnings:', warnings)
        setOutputText(fixed) // Use the cleaned version
      } else {
        setOutputText(combinedOutput)
      }
      // === END EXISTING CODE ===
      
      // AFTER successful processing, THEN handle usage tracking
      const { conversionsUsed, isPro } = await canUserConvert()
      
      // Increment the count
      await incrementConversionCount()
      
      // Update UI
      window.dispatchEvent(new Event('churchkit-usage-updated'))
      
      // Check if they need email gate for NEXT time
      const updatedUsage = await canUserConvert()
      
      if (updatedUsage.needsEmail && !isPro) {
        // Show email gate modal for next time
        setTimeout(() => setShowEmailGate(true), 1000)
      } else if (!updatedUsage.canConvert && !isPro) {
        // They've hit the limit, show upgrade modal
        setTimeout(() => setShowUpgradeModal(true), 1000)
      }
      
      toast.success(`Successfully processed ${uploadedFiles.length} image${uploadedFiles.length > 1 ? 's' : ''}`)
      
    } catch (err) {
      console.error('Processing error:', err)
      // Only show error if we didn't get any output
      if (!outputText) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to process image. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsProcessing(false)
    }
  }


  const handleReset = () => {
    setOutputText('')
    setCurrentKey('C')
    setTargetKey('C')
  }

  // Detect key from output text
  useEffect(() => {
    if (outputText) {
      const key = detectKey(outputText)
      setCurrentKey(key)
      setTargetKey(key)
    }
  }, [outputText])

  // Handle key change
  const handleKeyChange = (newKey: string) => {
    const currentIndex = KEYS.indexOf(currentKey)
    const targetIndex = KEYS.indexOf(newKey)
    const semitones = targetIndex - currentIndex
    
    const transposed = transposeText(outputText, semitones, newKey)
    setOutputText(transposed)
    setCurrentKey(newKey)
    setTargetKey(newKey)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }


  const EXAMPLE_OUTPUT = `Intro
[Bb] [/] [Bb2] [/] | [Bb] [/] [Fsus] [/] | [Eb] [/] [/] [/]

Verse 1
We [Bb]worship the God who was, we [Bb]worship the God who is
We worship the God who [Gm]ever - [F4]more [Eb2]will be
He [Bb]opened the prison doors, He parted the raging sea
My God, he [Gm]holds the [F4]vic - [Eb2]tory, yeah

Chorus 1
[Bb] There's joy in the house of the Lord
There's joy in the house of the [F]Lord to - [Eb]day
And we won't be quiet, we shout out [Eb/F]Your [Bb]praise`

  const loadExample = () => {
    setOutputText(EXAMPLE_OUTPUT)
    toast.success('Example loaded!')
  }

  // Export functions
  const exportToTXT = () => {
    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sheet-music-converted.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('TXT file downloaded!')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Set font to monospace for chord alignment
    doc.setFont('courier')
    doc.setFontSize(10)
    
    // Split text into lines and add to PDF
    const lines = outputText.split('\n')
    let y = 20
    
    for (let line of lines) {
      if (y > 280) {
        doc.addPage()
        y = 20
      }
      doc.text(line, 10, y)
      y += 5
    }
    
    doc.save('sheet-music-converted.pdf')
    toast.success('PDF file downloaded!')
  }

  // Function to convert edit mode to preview mode
  const renderPreview = (text: string): string => {
    // Remove brackets and format chords above lyrics
    let lines = text.split('\n')
    let result: string[] = []
    
    for (let line of lines) {
      // Check if it's a section header (all caps, no chords)
      if (line.match(/^[A-Z\s\d]+$/) && !line.includes('[')) {
        result.push(line)
        continue
      }
      
      // Extract chords and lyrics
      const chords: string[] = []
      const positions: number[] = []
      let cleanLyric = ''
      let currentPos = 0
      
      // Find all [Chord] patterns and their positions
      const parts = line.split(/(\[[^\]]+\])/)
      
      for (let part of parts) {
        if (part.match(/\[([^\]]+)\]/)) {
          // It's a chord
          const chord = part.slice(1, -1)
          chords.push(chord)
          positions.push(currentPos)
        } else {
          // It's lyrics
          cleanLyric += part
          currentPos += part.length
        }
      }
      
      // Build chord line with spacing
      if (chords.length > 0) {
        let chordLine = ''
        for (let i = 0; i < chords.length; i++) {
          const pos = positions[i]
          while (chordLine.length < pos) {
            chordLine += ' '
          }
          chordLine += chords[i]
        }
        result.push(chordLine)
      }
      
      result.push(cleanLyric)
    }
    
    return result.join('\n')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sheet Music Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload sheet music images and convert to Planning Center format with AI-powered accuracy
          </p>
        </div>

        {/* Usage Tracker */}
        <div className="max-w-2xl mx-auto mb-8">
          <UsageTracker />
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-400px)]">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Sheet Music
              </h2>
              <ImageUpload 
                onFilesChange={setUploadedFiles}
                maxFiles={5}
              />
              
              <button
                onClick={processImages}
                disabled={uploadedFiles.length === 0 || isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Process Images
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6 flex flex-col">
            <div className="card p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Planning Center Output
                </h2>
                <div className="flex items-center gap-2">
                  {outputText ? (
                    <button
                      onClick={loadExample}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Load Example
                    </button>
                  ) : (
                    <button
                      onClick={loadExample}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      Load Example
                    </button>
                  )}
                </div>
              </div>

              {/* View Toggle */}
              {outputText && (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="inline-flex rounded-lg border border-gray-300 p-1">
                    <button
                      onClick={() => setViewMode('edit')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'edit'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      Edit Mode
                    </button>
                    <button
                      onClick={() => setViewMode('preview')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'preview'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              )}

              {/* Export Buttons */}
              {outputText && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(outputText)
                      toast.success('Copied to clipboard!')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  
                  <button
                    onClick={exportToTXT}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Export TXT
                  </button>
                  
                  <button
                    onClick={exportToPDF}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 flex items-center gap-2"
                  >
                    <FileDown className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              )}

              {/* Manual Editing Tools */}
              {outputText && viewMode === 'edit' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={handleClearChordsFromLine}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center gap-2"
                  >
                    Clear Chords from Line
                  </button>
                  
                  <button
                    onClick={() => setShowChordPicker(!showChordPicker)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
                  >
                    Insert Chord Here
                  </button>
                  
                  <button
                    onClick={handleReportError}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
                  >
                    Report Poor Quality
                  </button>
                </div>
              )}

              {/* Chord Picker */}
              {showChordPicker && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Select Chord to Insert:</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm', 'C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7', 'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7'].map(chord => (
                      <button
                        key={chord}
                        onClick={() => handleInsertChord(chord)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-500 text-sm"
                      >
                        {chord}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Warnings */}
              {validationWarnings.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Quality Warnings:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {validationWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex-1 flex flex-col">
                {viewMode === 'edit' ? (
                  <textarea
                    value={outputText}
                    onChange={(e) => setOutputText(e.target.value)}
                    onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
                    className="w-full h-[600px] p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-y"
                    placeholder="Processed output will appear here..."
                  />
                ) : (
                  <div className="w-full h-[600px] p-4 bg-gray-900 text-gray-100 rounded-lg overflow-y-auto">
                    <pre className="font-mono text-sm whitespace-pre">
                      {renderPreview(outputText)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Key Selector */}
            {outputText && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transpose
                </h3>
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Transpose to:
                  </label>
                  <select
                    value={targetKey}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    {KEYS.map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    Current key: {currentKey}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Images</h4>
                <p className="text-sm text-gray-600">
                  Upload clear photos or scans of your sheet music (JPG, PNG, PDF)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Processing</h4>
                <p className="text-sm text-gray-600">
                  Our AI analyzes the sheet music and extracts chords and lyrics
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Results</h4>
                <p className="text-sm text-gray-600">
                  Receive formatted text ready for Planning Center Services
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <EmailGateModal
          isOpen={showEmailGate}
          onClose={() => setShowEmailGate(false)}
          onEmailSubmit={(email) => {
            setUserEmail(email)
            setShowEmailGate(false)
            // After email is submitted, allow them to process
            processImages()
          }}
        />

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          conversionsUsed={3}
        />
      </div>
    </div>
  )
}
