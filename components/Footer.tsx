import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-4">
              ChurchKit
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Essential tools for worship leaders. Everything you need to prep for Sunday, in one place.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons - Placeholder */}
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-xs">i</span>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/sheet-music" className="text-gray-400 hover:text-white transition-colors">
                  Sheet Music Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/key-finder" className="text-gray-400 hover:text-white transition-colors">
                  Key Finder
                </Link>
              </li>
              <li>
                <Link href="/tools/setlist-timer" className="text-gray-400 hover:text-white transition-colors">
                  Setlist Timer
                </Link>
              </li>
              <li>
                <Link href="/tools/chord-chart" className="text-gray-400 hover:text-white transition-colors">
                  Chord Chart Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ChurchKit. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Made with ❤️ for worship leaders
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
