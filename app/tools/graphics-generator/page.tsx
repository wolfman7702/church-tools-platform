'use client'

import { useState, useRef, useEffect } from 'react'
import { Download, RefreshCw } from 'lucide-react'

interface GraphicOptions {
  title: string
  subtitle?: string
  scripture?: string
  date?: string
  speaker?: string
  theme: 'modern' | 'minimal' | 'bold' | 'elegant' | 'dark'
  colorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'teal'
}

const COLOR_SCHEMES = {
  blue: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
  purple: { primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA' },
  green: { primary: '#10B981', secondary: '#059669', accent: '#34D399' },
  orange: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
  red: { primary: '#EF4444', secondary: '#DC2626', accent: '#F87171' },
  teal: { primary: '#14B8A6', secondary: '#0D9488', accent: '#2DD4BF' }
}

export default function GraphicsGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [options, setOptions] = useState<GraphicOptions>({
    title: 'Finding Hope',
    subtitle: 'A Journey Through Psalms',
    scripture: 'Psalm 23:1-6',
    date: 'January 12, 2025',
    speaker: 'Pastor John Smith',
    theme: 'modern',
    colorScheme: 'blue'
  })

  useEffect(() => {
    generateGraphic()
  }, [options])

  const generateGraphic = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size (1920x1080 for slides, 1080x1080 for social)
    canvas.width = 1920
    canvas.height = 1080

    const colors = COLOR_SCHEMES[options.colorScheme]

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render based on theme
    switch (options.theme) {
      case 'modern':
        renderModernTheme(ctx, canvas, options, colors)
        break
      case 'minimal':
        renderMinimalTheme(ctx, canvas, options, colors)
        break
      case 'bold':
        renderBoldTheme(ctx, canvas, options, colors)
        break
      case 'elegant':
        renderElegantTheme(ctx, canvas, options, colors)
        break
      case 'dark':
        renderDarkTheme(ctx, canvas, options, colors)
        break
    }
  }

  const renderModernTheme = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, opts: GraphicOptions, colors: any) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(1, colors.secondary)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Decorative shapes
    ctx.fillStyle = colors.accent + '40'
    ctx.beginPath()
    ctx.arc(1600, 200, 300, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(300, 900, 250, 0, Math.PI * 2)
    ctx.fill()

    // Title
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 120px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(opts.title, canvas.width / 2, 450)

    // Subtitle
    if (opts.subtitle) {
      ctx.font = '48px Arial'
      ctx.fillText(opts.subtitle, canvas.width / 2, 540)
    }

    // Scripture
    if (opts.scripture) {
      ctx.font = 'italic 36px Arial'
      ctx.fillStyle = '#F0F0F0'
      ctx.fillText(opts.scripture, canvas.width / 2, 650)
    }

    // Date
    if (opts.date) {
      ctx.font = '32px Arial'
      ctx.fillText(opts.date, canvas.width / 2, 750)
    }

    // Speaker
    if (opts.speaker) {
      ctx.font = '32px Arial'
      ctx.fillText(opts.speaker, canvas.width / 2, 800)
    }
  }

  const renderMinimalTheme = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, opts: GraphicOptions, colors: any) => {
    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Simple accent line
    ctx.fillStyle = colors.primary
    ctx.fillRect(canvas.width / 2 - 300, 400, 600, 8)

    // Title
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 100px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(opts.title, canvas.width / 2, 550)

    // Subtitle
    if (opts.subtitle) {
      ctx.font = '42px Arial'
      ctx.fillStyle = '#6B7280'
      ctx.fillText(opts.subtitle, canvas.width / 2, 630)
    }

    // Scripture
    if (opts.scripture) {
      ctx.font = 'italic 34px Arial'
      ctx.fillStyle = colors.primary
      ctx.fillText(opts.scripture, canvas.width / 2, 720)
    }

    // Date/Speaker
    if (opts.date || opts.speaker) {
      ctx.font = '28px Arial'
      ctx.fillStyle = '#9CA3AF'
      const info = [opts.date, opts.speaker].filter(Boolean).join(' • ')
      ctx.fillText(info, canvas.width / 2, 800)
    }
  }

  const renderBoldTheme = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, opts: GraphicOptions, colors: any) => {
    // Solid color background
    ctx.fillStyle = colors.primary
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Large geometric shapes
    ctx.fillStyle = colors.secondary
    ctx.fillRect(0, 0, 500, canvas.height)
    ctx.fillStyle = colors.accent + '60'
    ctx.fillRect(canvas.width - 400, 0, 400, canvas.height)

    // Title (large and bold)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 140px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = 20
    ctx.fillText(opts.title.toUpperCase(), canvas.width / 2, 500)
    ctx.shadowBlur = 0

    // Other text
    if (opts.subtitle) {
      ctx.font = 'bold 52px Arial'
      ctx.fillText(opts.subtitle.toUpperCase(), canvas.width / 2, 600)
    }

    if (opts.scripture) {
      ctx.font = '40px Arial'
      ctx.fillText(opts.scripture, canvas.width / 2, 700)
    }

    if (opts.date) {
      ctx.font = '36px Arial'
      ctx.fillText(opts.date, canvas.width / 2, 800)
    }
  }

  const renderElegantTheme = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, opts: GraphicOptions, colors: any) => {
    // Soft gradient
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, 800)
    gradient.addColorStop(0, '#FFFFFF')
    gradient.addColorStop(1, colors.primary + '30')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Elegant border
    ctx.strokeStyle = colors.primary
    ctx.lineWidth = 4
    ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200)

    // Title with serif feel
    ctx.fillStyle = colors.primary
    ctx.font = 'bold 110px Georgia'
    ctx.textAlign = 'center'
    ctx.fillText(opts.title, canvas.width / 2, 500)

    // Ornamental line
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 250, 550)
    ctx.lineTo(canvas.width / 2 + 250, 550)
    ctx.stroke()

    // Subtitle
    if (opts.subtitle) {
      ctx.font = 'italic 44px Georgia'
      ctx.fillStyle = colors.secondary
      ctx.fillText(opts.subtitle, canvas.width / 2, 620)
    }

    // Scripture
    if (opts.scripture) {
      ctx.font = '36px Georgia'
      ctx.fillText(opts.scripture, canvas.width / 2, 720)
    }

    // Date/Speaker
    if (opts.date || opts.speaker) {
      ctx.font = '30px Georgia'
      ctx.fillStyle = '#6B7280'
      const info = [opts.date, opts.speaker].filter(Boolean).join(' • ')
      ctx.fillText(info, canvas.width / 2, 820)
    }
  }

  const renderDarkTheme = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, opts: GraphicOptions, colors: any) => {
    // Dark background
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Glowing accent
    ctx.fillStyle = colors.primary + '20'
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 600, 0, Math.PI * 2)
    ctx.fill()

    // Title with glow
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 120px Arial'
    ctx.textAlign = 'center'
    ctx.shadowColor = colors.primary
    ctx.shadowBlur = 30
    ctx.fillText(opts.title, canvas.width / 2, 480)
    ctx.shadowBlur = 0

    // Subtitle
    if (opts.subtitle) {
      ctx.font = '48px Arial'
      ctx.fillStyle = colors.accent
      ctx.fillText(opts.subtitle, canvas.width / 2, 570)
    }

    // Scripture
    if (opts.scripture) {
      ctx.font = 'italic 38px Arial'
      ctx.fillStyle = '#D1D5DB'
      ctx.fillText(opts.scripture, canvas.width / 2, 670)
    }

    // Date/Speaker
    if (opts.date || opts.speaker) {
      ctx.font = '32px Arial'
      ctx.fillStyle = '#9CA3AF'
      const info = [opts.date, opts.speaker].filter(Boolean).join(' • ')
      ctx.fillText(info, canvas.width / 2, 770)
    }
  }

  const downloadGraphic = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `sermon-graphic-${options.title.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sermon Graphics Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create professional sermon and series graphics in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sermon Title *
                </label>
                <input
                  type="text"
                  value={options.title}
                  onChange={(e) => setOptions({ ...options, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Finding Hope"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle / Series Name
                </label>
                <input
                  type="text"
                  value={options.subtitle}
                  onChange={(e) => setOptions({ ...options, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="A Journey Through Psalms"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scripture Reference
                </label>
                <input
                  type="text"
                  value={options.scripture}
                  onChange={(e) => setOptions({ ...options, scripture: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Psalm 23:1-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={options.date}
                  onChange={(e) => setOptions({ ...options, date: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="January 12, 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker
                </label>
                <input
                  type="text"
                  value={options.speaker}
                  onChange={(e) => setOptions({ ...options, speaker: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Pastor John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={options.theme}
                  onChange={(e) => setOptions({ ...options, theme: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="bold">Bold</option>
                  <option value="elegant">Elegant</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Scheme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(COLOR_SCHEMES).map((color) => (
                    <button
                      key={color}
                      onClick={() => setOptions({ ...options, colorScheme: color as any })}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        options.colorScheme === color
                          ? 'border-gray-900 scale-105'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: COLOR_SCHEMES[color as keyof typeof COLOR_SCHEMES].primary }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview & Download */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Preview</h2>
                <div className="flex gap-2">
                  <button
                    onClick={generateGraphic}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                  <button
                    onClick={downloadGraphic}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                </div>
              </div>

              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ maxHeight: '600px' }}
                />
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Resolution:</strong> 1920x1080px (perfect for ProPresenter, social media, and projection)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
