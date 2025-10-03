'use client'

import { X, Check, Zap, Crown } from 'lucide-react'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  conversionsUsed: number
}

export default function UpgradeModal({ isOpen, onClose, conversionsUsed }: UpgradeModalProps) {
  if (!isOpen) return null

  const handleUpgrade = () => {
    // TODO: Integrate Stripe Checkout
    // For now, show coming soon message
    alert('Stripe integration coming soon! For early access, email joshl03@comcast.net')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            You've used all {conversionsUsed} free conversions!
          </h2>
          <p className="text-gray-600 text-lg">
            Upgrade to Pro for unlimited access
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold">$9.99</span>
            <span className="text-blue-100 text-lg">/month</span>
          </div>
          
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-white">Unlimited sheet music conversions</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-white">Save unlimited songs to your library</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-white">Planning Center integration (coming soon)</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-white">Team vocal range management</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-white">No watermarks on exports</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span className="text-white">Priority email support</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Upgrade to Pro
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Cancel anytime. No questions asked.
        </p>
      </div>
    </div>
  )
}
