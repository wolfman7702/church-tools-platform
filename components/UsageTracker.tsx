'use client'

import { Zap } from 'lucide-react'

interface UsageTrackerProps {
  songsProcessed: number
  isPro: boolean
}

export default function UsageTracker({ songsProcessed, isPro }: UsageTrackerProps) {
  const maxFree = 3
  const remaining = maxFree - songsProcessed
  const percentage = (songsProcessed / maxFree) * 100

  if (isPro) {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-4 py-3">
        <Zap className="w-5 h-5 text-yellow-500" />
        <div>
          <div className="text-sm font-medium text-gray-900">Pro Member ✨</div>
          <div className="text-xs text-gray-600">Unlimited songs</div>
        </div>
      </div>
    )
  }

  if (remaining <= 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm font-medium text-red-800">Limit reached!</span>
        </div>
        <p className="text-xs text-red-600 mt-1">
          Upgrade to Pro for unlimited songs
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {remaining} free songs remaining
        </span>
        <span className="text-xs text-gray-500">
          {songsProcessed}/{maxFree}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      {remaining === 1 && (
        <p className="text-xs text-amber-600 mt-2">
          Last free song! Consider upgrading for unlimited access.
        </p>
      )}
    </div>
  )
}
