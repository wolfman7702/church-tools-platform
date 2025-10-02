'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Heart, Music, Key, Clock, FileText } from 'lucide-react'
import ToolCard from '@/components/ToolCard'

const tools = [
  {
    id: 'sheet-music',
    title: 'Sheet Music Converter',
    description: 'Upload sheet music images and convert to Planning Center format with AI-powered accuracy.',
    icon: <Music className="w-6 h-6" />,
    href: '/tools/sheet-music',
    isPremium: false
  },
  {
    id: 'key-finder',
    title: 'Key Finder',
    description: 'Find the perfect key for your singer\'s vocal range with intelligent recommendations.',
    icon: <Key className="w-6 h-6" />,
    href: '/tools/key-finder',
    isPremium: false
  },
  {
    id: 'setlist-timer',
    title: 'Setlist Timer',
    description: 'Plan your worship set timing with drag-and-drop song management and time tracking.',
    icon: <Clock className="w-6 h-6" />,
    href: '/tools/setlist-timer',
    isPremium: false
  },
  {
    id: 'chord-chart',
    title: 'Chord Chart Generator',
    description: 'Create beautiful chord charts with visual chord placement and Planning Center export.',
    icon: <FileText className="w-6 h-6" />,
    href: '/tools/chord-chart',
    isPremium: true
  }
]

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary-600" />,
    title: 'AI-Powered Conversion',
    description: 'Advanced machine learning extracts chords and lyrics with precision'
  },
  {
    icon: <Zap className="w-8 h-8 text-primary-600" />,
    title: 'Instant Results',
    description: 'Get your converted sheet music in seconds, not hours'
  },
  {
    icon: <Heart className="w-8 h-8 text-primary-600" />,
    title: 'Free to Start',
    description: 'Try our tools with 3 free conversions, upgrade when you\'re ready'
  }
]

export default function HomePage() {
  const scrollToTools = () => {
    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Essential Tools for{' '}
              <span className="gradient-text">Worship Leaders</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto text-balance">
              Everything you need to prep for Sunday, in one place. AI-powered sheet music conversion, 
              key finding, setlist timing, and more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/tools/sheet-music" className="btn-primary text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <button 
                onClick={scrollToTools}
                className="btn-secondary text-lg px-8 py-4"
              >
                Browse All Tools
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              No credit card required • 3 free conversions • Start in seconds
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-200 to-primary-200 rounded-full translate-y-40 -translate-x-40 opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Worship Leaders Choose ChurchKit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the unique needs of worship teams and church musicians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools-section" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to streamline your worship preparation process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                href={tool.href}
                isPremium={tool.isPremium}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="card p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    3 sheet music conversions/month
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    All simple tools (key finder, timer)
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    Community support
                  </li>
                </ul>
                <Link href="/tools/sheet-music" className="btn-secondary w-full">
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="card p-8 relative border-2 border-primary-200">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">$9.99<span className="text-lg text-gray-500">/month</span></div>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    Unlimited sheet music conversions
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    Save favorite songs
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    No watermarks
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    Priority processing
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    Email support
                  </li>
                </ul>
                <Link href="/pricing" className="btn-primary w-full">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to simplify your worship prep?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of worship leaders who trust ChurchKit to streamline their Sunday preparation
          </p>
          <Link href="/tools/sheet-music" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center">
            Start Converting Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
