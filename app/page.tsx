'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-app.vercel.app'

  const examples = [
    {
      title: 'Download Video',
      url: `${baseUrl}/api/proxy/download?url=https://example.com/video.mp4`,
      description: 'Direct video download proxy'
    },
    {
      title: 'Download Audio',
      url: `${baseUrl}/api/proxy/download?url=https://example.com/audio.mp3`,
      description: 'Audio file download proxy'
    },
    {
      title: 'Download Document',
      url: `${baseUrl}/api/proxy/download?url=https://example.com/document.pdf`,
      description: 'PDF and document proxy'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2"></span>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Public Proxy Server</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Unlimited File
          <span className="block text-blue-600 dark:text-blue-400 mt-2">Download Proxy</span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Bypass restrictions and download any file directly with our powerful proxy server. 
          No CORS, no errors, completely public.
        </p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <a
            href="/browse"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Browse Websites
          </a>
          <a
            href="/test"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Test Proxy
          </a>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proxy URL Format:</span>
              <button
                onClick={() => copyToClipboard(`${baseUrl}/api/proxy/download?url={YOUR_FILE_URL}`)}
                className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="block p-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded text-sm break-all">
              {baseUrl}/api/proxy/download?url=&#123;YOUR_FILE_URL&#125;
            </code>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          How to Use
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔗',
              title: 'Get File URL',
              description: 'Copy the direct download link of any file (video, audio, document)'
            },
            {
              icon: '⚡',
              title: 'Create Proxy URL',
              description: 'Prefix your URL with our proxy endpoint'
            },
            {
              icon: '📥',
              title: 'Download Directly',
              description: 'Use the proxy URL to download without restrictions'
            }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-2xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Usage Examples
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <div 
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all card-hover"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-3">
                  {index === 0 && '🎬'}
                  {index === 1 && '🎵'}
                  {index === 2 && '📄'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{example.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{example.description}</p>
              <div className="mt-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proxy URL:</div>
                <code className="block p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-xs break-all">
                  {example.url}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Test Section */}
      <section className="py-8 border border-gray-300 dark:border-gray-700 rounded-xl p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Quick Test
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter File URL to Test
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/file.mp4"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    if (url) {
                      window.open(`${baseUrl}/api/proxy/download?url=${encodeURIComponent(url)}`, '_blank')
                    }
                  }}
                  disabled={!url}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Test Download
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="/test" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Go to Advanced Test Page</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🌐', title: 'No CORS', desc: 'Bypass cross-origin restrictions' },
            { icon: '⚡', title: 'Fast', desc: 'High-speed proxy server' },
            { icon: '🔓', title: 'Public', desc: 'Completely open access' },
            { icon: '🛡️', title: 'Secure', desc: 'Safe file transfer' },
            { icon: '📱', title: 'Mobile Ready', desc: 'Responsive design' },
            { icon: '🔄', title: 'Auto Retry', desc: 'Automatic retry on failure' },
            { icon: '👤', title: 'User Agents', desc: 'Multiple user agents' },
            { icon: '🚀', title: 'Vercel Hosted', desc: 'Global edge network' },
          ].map((feature, index) => (
            <div 
              key={index}
              className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
      }
