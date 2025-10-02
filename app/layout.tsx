import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChurchKit - Essential Tools for Worship Leaders',
  description: 'Everything you need to prep for Sunday, in one place. AI-powered sheet music conversion, key finding, setlist timing, and more.',
  keywords: 'worship, church, music, sheet music, chord charts, key finder, setlist timer',
  authors: [{ name: 'ChurchKit Team' }],
  openGraph: {
    title: 'ChurchKit - Essential Tools for Worship Leaders',
    description: 'Everything you need to prep for Sunday, in one place.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChurchKit - Essential Tools for Worship Leaders',
    description: 'Everything you need to prep for Sunday, in one place.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
