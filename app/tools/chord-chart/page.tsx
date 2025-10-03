'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Download, Music, Plus, Trash2, X } from 'lucide-react'

interface ChordPosition {
  id: string
  chord: string
  position: number
  section: string
}

interface Section {
  id: string
  type: 'verse' | 'chorus' | 'bridge' | 'intro' | 'outro'
  title: string
  content: string
  chords: ChordPosition[]
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

const SECTION_TYPES = [
  { type: 'verse', label: 'Add Verse', icon: '📝' },
  { type: 'chorus', label: 'Add Chorus', icon: '🎵' },
  { type: 'bridge', label: 'Add Bridge', icon: '🌉' },
  { type: 'intro', label: 'Add Intro', icon: '🎼' },
  { type: 'outro', label: 'Add Outro', icon: '🎶' }
]

export default function ChordChartPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showChordPicker, setShowChordPicker] = useState(false)
  const [chordPickerPosition, setChordPickerPosition] = useState({ x: 0, y: 0 })
  const [selectedPosition, setSelectedPosition] = useState<{ sectionId: string; position: number } | null>(null)
  const [outputText, setOutputText] = useState('')
  const [copied, setCopied] = useState(false)
  const contentEditableRef = useRef<HTMLDivElement>(null)

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type,
      title: type.toUpperCase(),
      content: '',
      chords: []
    }
    setSections([...sections, newSection])
    setActiveSection(newSection.id)
  }

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, content }
        : section
    ))
    updateOutput()
  }

  const handleTextClick = (sectionId: string, event: React.MouseEvent) => {
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    
    // Calculate approximate character position based on click position
    const textContent = target.textContent || ''
    const charWidth = rect.width / textContent.length
    const position = Math.floor(clickX / charWidth)
    
    setChordPickerPosition({
      x: event.clientX,
      y: event.clientY - 10
    })
    setSelectedPosition({ sectionId, position })
    setShowChordPicker(true)
  }

  const addChord = (chord: string) => {
    if (!selectedPosition) return

    const newChord: ChordPosition = {
      id: Date.now().toString(),
      chord,
      position: selectedPosition.position,
      section: selectedPosition.sectionId
    }

    setSections(sections.map(section => 
      section.id === selectedPosition.sectionId
        ? { ...section, chords: [...section.chords, newChord] }
        : section
    ))

    setShowChordPicker(false)
    setSelectedPosition(null)
    updateOutput()
  }

  const removeChord = (chordId: string) => {
    setSections(sections.map(section => ({
      ...section,
      chords: section.chords.filter(chord => chord.id !== chordId)
    })))
    updateOutput()
  }

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
    if (activeSection === sectionId) {
      setActiveSection(sections.length > 1 ? sections[0].id : null)
    }
    updateOutput()
  }

  const updateOutput = () => {
    let output = ''
    
    sections.forEach(section => {
      if (section.type === 'intro' || section.type === 'outro') {
        // For intro/outro, just show chords
        if (section.chords.length > 0) {
          output += `${section.title}\n`
          const chordString = section.chords
            .sort((a, b) => a.position - b.position)
            .map(chord => `[${chord.chord}]`)
            .join(' ')
          output += `${chordString}\n\n`
        }
      } else {
        // For verses, chorus, bridge - show chords above lyrics
        if (section.content || section.chords.length > 0) {
          output += `${section.title}\n`
          
          if (section.chords.length > 0) {
            // Create chord line
            const chordLine = createChordLine(section.content, section.chords)
            output += `${chordLine}\n`
          }
          
          if (section.content) {
            output += `${section.content}\n`
          }
          output += '\n'
        }
      }
    })

    setOutputText(output)
  }

  const createChordLine = (content: string, chords: ChordPosition[]) => {
    if (!content) return ''
    
    const sortedChords = chords.sort((a, b) => a.position - b.position)
    let chordLine = ''
    let lastPosition = 0
    
    sortedChords.forEach(chord => {
      // Add spaces to align chord with text
      const spacesNeeded = Math.max(0, chord.position - lastPosition)
      chordLine += ' '.repeat(spacesNeeded) + `[${chord.chord}]`
      lastPosition = chord.position + chord.chord.length + 2 // +2 for brackets
    })
    
    return chordLine
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
    setSections([])
    setActiveSection(null)
    setOutputText('')
  }

  // Update output when sections change
  useEffect(() => {
    updateOutput()
  }, [sections])

  const getTotalChords = () => {
    return sections.reduce((total, section) => total + section.chords.length, 0)
  }

  const getUniqueChords = () => {
    const allChords = sections.flatMap(section => section.chords.map(chord => chord.chord))
    return new Set(allChords).size
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chord Chart Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create beautiful chord charts with click-to-insert chords and Planning Center export
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
          {/* Left Side - Editor */}
          <div className="space-y-6">
            {/* Section Header Buttons */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add Sections
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SECTION_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => addSection(type as Section['type'])}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                  >
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sections List */}
            {sections.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Song Sections
                  </h2>
                  <button
                    onClick={clearAll}
                    className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                          <span className="mr-2">
                            {SECTION_TYPES.find(s => s.type === section.type)?.icon}
                          </span>
                          {section.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setActiveSection(section.id)}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSection(section.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {activeSection === section.id && (
                        <div className="space-y-3">
                          {section.type === 'intro' || section.type === 'outro' ? (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">
                                Add chords for {section.type} (no lyrics needed):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {section.chords.map((chord) => (
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
                                <button
                                  onClick={() => {
                                    setSelectedPosition({ sectionId: section.id, position: 0 })
                                    setShowChordPicker(true)
                                  }}
                                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  + Add Chord
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div
                                ref={contentEditableRef}
                                contentEditable
                                onInput={(e) => updateSectionContent(section.id, e.currentTarget.textContent || '')}
                                onClick={(e) => handleTextClick(section.id, e)}
                                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none whitespace-pre-wrap"
                                style={{ minHeight: '100px' }}
                                suppressContentEditableWarning={true}
                              >
                                {section.content}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Click anywhere in the text to add chords
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Show chords for this section */}
                      {section.chords.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {section.chords
                              .sort((a, b) => a.position - b.position)
                              .map((chord) => (
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
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-6">
            <div className="card p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Planning Center Preview
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
              
              <div className="flex-1 bg-gray-50 rounded-lg p-4 min-h-[400px]">
                {outputText ? (
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-900 leading-relaxed">
                    {outputText}
                  </pre>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Music className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Your chord chart will appear here</p>
                    <p className="text-sm mt-2">Add sections and start creating your chord chart</p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            {sections.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {sections.length}
                    </div>
                    <div className="text-sm text-gray-600">Sections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {getTotalChords()}
                    </div>
                    <div className="text-sm text-gray-600">Total Chords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {getUniqueChords()}
                    </div>
                    <div className="text-sm text-gray-600">Unique Chords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {outputText.length}
                    </div>
                    <div className="text-sm text-gray-600">Characters</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chord Picker Modal */}
        {showChordPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Chord
              </h3>
              
              <div className="grid grid-cols-6 gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Add Sections</h4>
                <p className="text-sm text-gray-600">
                  Add verses, chorus, bridge, intro, or outro sections
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Add Lyrics</h4>
                <p className="text-sm text-gray-600">
                  Type or paste your lyrics into each section
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Add Chords</h4>
                <p className="text-sm text-gray-600">
                  Click anywhere in the text to insert chords
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-600 font-bold text-lg">4</span>
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