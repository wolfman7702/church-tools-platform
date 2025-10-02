'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Music, Key, Clock, FileText, Zap } from 'lucide-react'

const tools = [
  { name: 'Sheet Music Converter', href: '/tools/sheet-music', icon: Music },
  { name: 'Key Finder', href: '/tools/key-finder', icon: Key },
  { name: 'Setlist Timer', href: '/tools/setlist-timer', icon: Clock },
  { name: 'Chord Chart', href: '/tools/chord-chart', icon: FileText },
]

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ChurchKit
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-1">
                <span>Tools</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tool.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            <Link href="/pricing" className="text-gray-700 hover:text-primary-600 transition-colors">
              Pricing
            </Link>
          </div>

          {/* Right side - Usage & Upgrade */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Usage Tracker */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">0/3 free</span>
            </div>
            
            <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
              Upgrade to Pro
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tools</div>
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className="flex items-center space-x-3 text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tool.name}</span>
                    </Link>
                  )
                })}
              </div>
              
              <Link
                href="/pricing"
                className="block text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">0/3 free</span>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
