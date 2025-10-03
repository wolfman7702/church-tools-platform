'use client'

import { useEffect, useState } from 'react'
import { Zap, Loader2 } from 'lucide-react'
import { canUserConvert } from '@/lib/usage-tracking'

export default function UsageTracker() {
  const [usage, setUsage] = useState<{
    conversionsUsed: number
    isPro: boolean
    hasEmail: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsage()
  }, [])

  const loadUsage = async () => {
    try {
      const result = await canUserConvert()
      setUsage({
        conversionsUsed: result.conversionsUsed,
        isPro: result.isPro,
        hasEmail: !result.needsEmail
      })
    } catch (error) {
      console.error('Failed to load usage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for storage events to update across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      loadUsage()
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('churchkit-usage-updated', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('churchkit-usage-updated', handleStorageChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (!usage) return null

  if (usage.isPro) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-semibold">Pro Member</span>
      </div>
    )
  }

  const remainingConversions = Math.max(0, 3 - usage.conversionsUsed)
  const progressPercent = (usage.conversionsUsed / 3) * 100

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium text-gray-700">
          {remainingConversions}/3 free
        </span>
        {!usage.hasEmail && usage.conversionsUsed >= 1 && (
          <span className="text-xs text-gray-500">Add email for more</span>
        )}
      </div>
      
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  )
}
