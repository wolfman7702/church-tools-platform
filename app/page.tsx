'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Heart, Music, Key, Clock, FileText, Check } from 'lucide-react'
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
    icon: <Sparkles className="w-8 h-8 text-blue-600" />,
    title: 'AI-Powered Conversion',
    description: 'Advanced machine learning extracts chords and lyrics with precision'
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-600" />,
    title: 'Instant Results',
    description: 'Get your converted sheet music in seconds, not hours'
  },
  {
    icon: <Heart className="w-8 h-8 text-blue-600" />,
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
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Essential Tools for Worship Leaders
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Everything you need to prep for Sunday, in one place
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                href="/tools/sheet-music" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button 
                onClick={scrollToTools}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Browse All Tools
              </button>
            </div>
            
            <p className="text-sm text-gray-500">
              No credit card required • 3 free conversions • Start in seconds
            </p>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-full translate-y-40 -translate-x-40 opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
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
      <section id="tools-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to streamline your worship preparation process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
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
      <section className="py-16 md:py-24 bg-gray-50">
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
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $0<span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">3 sheet music conversions/month</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">All simple tools (key finder, timer)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">Community support</span>
                  </li>
                </ul>
                <Link 
                  href="/tools/sheet-music" 
                  className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 inline-block text-center"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 relative border-2 border-blue-200">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  $9.99<span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <ul className="space-y-4 text-left mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">Unlimited sheet music conversions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">Save favorite songs</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">No watermarks</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">Priority processing</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-600">Email support</span>
                  </li>
                </ul>
                <Link 
                  href="/pricing" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 inline-block text-center"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to simplify your worship prep?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of worship leaders who trust ChurchKit to streamline their Sunday preparation
          </p>
          <Link 
            href="/tools/sheet-music" 
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            Start Converting Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}