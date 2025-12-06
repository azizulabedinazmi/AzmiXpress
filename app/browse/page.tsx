'use client'

import { useState } from 'react'

export default function BrowsePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const handleBrowse = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      setError('Please enter a URL')
      return
    }

    // Validate URL
    let targetUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      targetUrl = 'https://' + url
    }

    try {
      new URL(targetUrl)
      setError('')
      // Open in new tab using proxy API route
      const proxyUrl = `${baseUrl}/api/proxy/browse?url=${encodeURIComponent(targetUrl)}`
      window.open(proxyUrl, '_blank')
      setUrl('') // Clear the input
    } catch {
      setError('Invalid URL format')
    }
  }

  const quickLinks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mr-2"></span>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Web Proxy Browser</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Browse Any Website
          <span className="block text-purple-600 dark:text-purple-400 mt-2">Through Proxy</span>
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Access websites through our proxy server. Enter any URL below to start browsing.
        </p>
      </div>

      {/* Browser Controls */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-black">
        <form onSubmit={handleBrowse} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., example.com or https://example.com)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={!url}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Proxy
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Quick Links */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick links:</p>
            <div className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => {
                    setUrl(link.url)
                    setError('')
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              🌐 How It Works
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p>1. Enter any website URL in the browser bar above</p>
              <p>2. Click "Open in Proxy" to load the website in a new tab</p>
              <p>3. Our server fetches the content and serves it to you</p>
              <p>4. Bypass restrictions and access blocked content</p>
            </div>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              ⚠️ Important Notes
            </h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p>• Website opens in a new tab through our proxy</p>
              <p>• Works with most websites including Google, YouTube, etc.</p>
              <p>• Links within the page will open in their own tabs</p>
              <p>• Great for accessing news, videos, and documentation</p>
            </div>
          </div>
        </div>

      {/* Features */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-8 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-black">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Browser Features
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🔒', title: 'Privacy', desc: 'Anonymous browsing' },
            { icon: '🚀', title: 'Fast', desc: 'Quick page loads' },
            { icon: '🌍', title: 'Global', desc: 'Access any website' },
            { icon: '📱', title: 'Responsive', desc: 'Mobile friendly' },
          ].map((feature, index) => (
            <div key={index} className="text-center p-4">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
