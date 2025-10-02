'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Clock, Download, Save, Upload, GripVertical } from 'lucide-react'

interface Song {
  id: string
  title: string
  duration: string // mm:ss format
  type: 'Worship' | 'Announcement' | 'Sermon' | 'Offering' | 'Other'
}

const SONG_TYPES = ['Worship', 'Announcement', 'Sermon', 'Offering', 'Other']

export default function SetlistTimerPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [newSong, setNewSong] = useState({ title: '', duration: '03:30', type: 'Worship' as const })
  const [isAdding, setIsAdding] = useState(false)

  // Calculate total time
  const totalTime = songs.reduce((total, song) => {
    const [minutes, seconds] = song.duration.split(':').map(Number)
    return total + minutes * 60 + seconds
  }, 0)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const parseTime = (timeString: string): number => {
    const [minutes, seconds] = timeString.split(':').map(Number)
    return minutes * 60 + seconds
  }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('setlist-songs')
    if (saved) {
      try {
        setSongs(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved setlist')
      }
    }
  }, [])

  // Save to localStorage when songs change
  useEffect(() => {
    localStorage.setItem('setlist-songs', JSON.stringify(songs))
  }, [songs])

  const addSong = () => {
    if (!newSong.title.trim()) return

    const song: Song = {
      id: Date.now().toString(),
      title: newSong.title.trim(),
      duration: newSong.duration,
      type: newSong.type
    }

    setSongs([...songs, song])
    setNewSong({ title: '', duration: '03:30', type: 'Worship' })
    setIsAdding(false)
  }

  const removeSong = (id: string) => {
    setSongs(songs.filter(song => song.id !== id))
  }

  const updateSong = (id: string, field: keyof Song, value: string) => {
    setSongs(songs.map(song => 
      song.id === id ? { ...song, [field]: value } : song
    ))
  }

  const moveSong = (fromIndex: number, toIndex: number) => {
    const newSongs = [...songs]
    const [movedSong] = newSongs.splice(fromIndex, 1)
    newSongs.splice(toIndex, 0, movedSong)
    setSongs(newSongs)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Worship': return 'bg-blue-100 text-blue-800'
      case 'Announcement': return 'bg-green-100 text-green-800'
      case 'Sermon': return 'bg-purple-100 text-purple-800'
      case 'Offering': return 'bg-yellow-100 text-yellow-800'
      case 'Other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeBreakdown = () => {
    const breakdown = songs.reduce((acc, song) => {
      const duration = parseTime(song.duration)
      acc[song.type] = (acc[song.type] || 0) + duration
      return acc
    }, {} as Record<string, number>)

    return Object.entries(breakdown).map(([type, duration]) => ({
      type,
      duration,
      percentage: (duration / totalTime) * 100
    }))
  }

  const exportToPDF = () => {
    // Simple text export - in a real app, you'd use a PDF library
    const content = songs.map((song, index) => 
      `${index + 1}. ${song.title} (${song.duration}) - ${song.type}`
    ).join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'setlist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearSetlist = () => {
    if (confirm('Are you sure you want to clear the entire setlist?')) {
      setSongs([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Setlist Timer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plan your worship set timing with drag-and-drop song management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Time Display */}
            <div className="card p-6 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {formatTime(totalTime)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Set Time
                  </div>
                </div>
              </div>
              
              {songs.length > 0 && (
                <div className="text-sm text-gray-600">
                  {songs.length} song{songs.length !== 1 ? 's' : ''} • Average: {formatTime(Math.round(totalTime / songs.length))} per song
                </div>
              )}
            </div>

            {/* Song List */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Songs ({songs.length})
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={exportToPDF}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                  {songs.length > 0 && (
                    <button
                      onClick={clearSetlist}
                      className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {songs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No songs yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Add your first song to get started
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Song
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 text-gray-400">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={song.title}
                          onChange={(e) => updateSong(song.id, 'title', e.target.value)}
                          className="w-full text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                          placeholder="Song title"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={song.duration}
                          onChange={(e) => updateSong(song.id, 'duration', e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="mm:ss"
                        />
                        <span className="text-sm text-gray-500">min</span>
                      </div>

                      <div className="flex-shrink-0">
                        <select
                          value={song.type}
                          onChange={(e) => updateSong(song.id, 'type', e.target.value as Song['type'])}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {SONG_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => removeSong(song.id)}
                        className="flex-shrink-0 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Song Form */}
              {isAdding && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add New Song
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Song Title
                      </label>
                      <input
                        type="text"
                        value={newSong.title}
                        onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter song title"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newSong.duration}
                        onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="mm:ss"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newSong.type}
                        onChange={(e) => setNewSong({ ...newSong, type: e.target.value as Song['type'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {SONG_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addSong}
                      disabled={!newSong.title.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Add Song
                    </button>
                  </div>
                </div>
              )}

              {!isAdding && songs.length > 0 && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Another Song</span>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Type Breakdown */}
            {songs.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Time Breakdown
                </h3>
                <div className="space-y-3">
                  {getTypeBreakdown().map(({ type, duration, percentage }) => (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{type}</span>
                        <span className="text-sm text-gray-600">{formatTime(duration)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getTypeColor(type).split(' ')[0]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage.toFixed(1)}% of total time
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Song</span>
                </button>
                
                <button
                  onClick={exportToPDF}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Setlist</span>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Include buffer time for transitions</li>
                <li>• Plan for announcements and offering</li>
                <li>• Consider your congregation's attention span</li>
                <li>• Leave room for the Holy Spirit to move</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
