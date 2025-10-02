'use client'

import { Check, Star, Crown, Users } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      '3 sheet music conversions per month',
      'Unlimited access to simple tools',
      'Key finder for vocalists',
      'Setlist timer',
      'Basic chord chart generator',
      'Community support',
      'No credit card required'
    ],
    limitations: [
      'Limited to 3 conversions',
      'No saved songs',
      'Basic support only'
    ],
    cta: 'Get Started Free',
    ctaLink: '/tools/sheet-music',
    popular: false
  },
  {
    name: 'Pro',
    price: 9.99,
    period: 'month',
    description: 'For individual worship leaders',
    features: [
      'Unlimited sheet music conversions',
      'Save favorite songs',
      'No watermarks',
      'Priority processing',
      'Advanced chord chart generator',
      'Email support',
      'Export to multiple formats',
      'Transpose functionality',
      'Batch processing'
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    ctaLink: '/pricing',
    popular: true
  },
  {
    name: 'Church',
    price: 49,
    period: 'year',
    description: 'For worship teams and churches',
    features: [
      'Everything in Pro',
      '5 team member accounts',
      'Shared song library',
      'Custom branding',
      'Priority support',
      'Advanced analytics',
      'Team collaboration',
      'Bulk import/export',
      'Custom integrations',
      'Phone support'
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
    badge: 'Most Popular'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade when you're ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-primary-500 scale-105' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-xl text-gray-500 ml-1">
                      /{plan.period}
                    </span>
                  </div>
                  {plan.name === 'Church' && (
                    <div className="mt-2">
                      <span className="text-sm text-green-600 font-semibold">
                        Save 58% vs monthly Pro
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Limitations
                    </h4>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-start">
                          <span className="text-gray-400 mr-3 mt-0.5">•</span>
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={plan.ctaLink}
                  className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your data is safe! We keep your converted songs and settings for 30 days after cancellation. 
                You can export everything before your subscription ends.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer discounts for churches?
              </h3>
              <p className="text-gray-600">
                Yes! Our Church plan is specifically designed for worship teams and includes significant 
                savings compared to individual Pro subscriptions. Contact us for custom pricing for larger teams.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a free trial for Pro features?
              </h3>
              <p className="text-gray-600">
                You can try our Pro features with the free plan (3 conversions). If you need more, 
                you can upgrade anytime. No credit card required to start.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to streamline your worship prep?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of worship leaders who trust ChurchKit to make their Sunday preparation easier
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tools/sheet-music"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-8">Trusted by worship leaders at</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Placeholder for church logos */}
            <div className="w-24 h-12 bg-gray-200 rounded"></div>
            <div className="w-24 h-12 bg-gray-200 rounded"></div>
            <div className="w-24 h-12 bg-gray-200 rounded"></div>
            <div className="w-24 h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
