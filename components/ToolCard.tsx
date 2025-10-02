'use client'

import Link from 'next/link'
import { ArrowRight, Crown } from 'lucide-react'

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  isPremium: boolean
}

export default function ToolCard({ title, description, icon, href, isPremium }: ToolCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <Crown className="w-3 h-3" />
            <span>Premium</span>
          </div>
        )}

        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight className="w-5 h-5 text-primary-600" />
        </div>
      </div>
    </Link>
  )
}
