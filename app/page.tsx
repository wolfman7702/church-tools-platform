import Link from 'next/link'
import { Music, Sparkles, Zap, Heart, Key, FileText, Check, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Essential Tools for Worship Leaders
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Everything you need to prep for Sunday, in one place. AI-powered sheet music conversion, key finding, and chord charts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/tools/sheet-music"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#tools"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
            >
              Browse All Tools
            </a>
          </div>
          <p className="text-sm text-gray-500">
            No credit card required • 3 free conversions • Start in seconds
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Worship Leaders Choose ChurchKit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built specifically for the unique needs of worship teams and church musicians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Conversion</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced machine learning extracts chords and lyrics from sheet music with remarkable precision and accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Get your converted sheet music in seconds, not hours. Save time and focus on what matters most.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Free to Start</h3>
              <p className="text-gray-600 leading-relaxed">
                Try our tools with 3 free conversions every month. Upgrade when you're ready for unlimited access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to streamline your worship preparation process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tool 1 */}
            <Link href="/tools/sheet-music" className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Sheet Music Converter</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Upload sheet music images and convert to Planning Center format with AI-powered accuracy.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Try it now <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            {/* Tool 2 */}
            <Link href="/tools/key-finder" className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Key className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Key Finder</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Find the perfect key for your singer's vocal range with intelligent recommendations and capo suggestions.
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Try it now <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            {/* Tool 3 */}
            <Link href="/tools/chord-chart" className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:-translate-y-2 border border-gray-100 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Chord Chart Generator</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Create beautiful chord charts with visual chord placement and instant Planning Center export.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                  Try it now <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">3 sheet music conversions/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All simple tools (key finder, chord charts)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
              <Link
                href="/tools/sheet-music"
                className="block w-full py-3 px-6 text-center border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-2xl shadow-xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Unlimited sheet music conversions</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Save favorite songs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">No watermarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Email support</span>
                </li>
              </ul>
              <button className="block w-full py-3 px-6 text-center bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to simplify your worship prep?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of worship leaders who trust ChurchKit to streamline their Sunday preparation
          </p>
          <Link
            href="/tools/sheet-music"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-200 hover:scale-105"
          >
            Start Converting Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}