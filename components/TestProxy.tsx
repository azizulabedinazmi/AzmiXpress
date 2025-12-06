'use client'

import { useState } from 'react'

export default function TestProxy() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    proxyUrl?: string;
    details?: string;
  } | null>(null)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const testProxy = async () => {
    if (!url) {
      setResult({
        success: false,
        message: 'Please enter a URL'
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Validate URL format
      new URL(url)
      
      const proxyUrl = `${baseUrl}/api/proxy/download?url=${encodeURIComponent(url)}`
      
      // Test with a HEAD request first
      const testResponse = await fetch(proxyUrl, { method: 'HEAD' })
      
      if (testResponse.ok) {
        setResult({
          success: true,
          message: '✅ Proxy is working! Click the link below to download.',
          proxyUrl,
          details: `Status: ${testResponse.status} ${testResponse.statusText}`
        })
      } else {
        setResult({
          success: false,
          message: '❌ Proxy failed to fetch the file',
          proxyUrl,
          details: `Status: ${testResponse.status} ${testResponse.statusText}`
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: '❌ Error testing proxy',
        details: error.toString()
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter File URL to Test Proxy
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={testProxy}
            disabled={loading || !url}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Testing...
              </>
            ) : 'Test Proxy'}
          </button>
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Try examples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
              { label: 'Audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
              { label: 'PDF', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example.url)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className={`border rounded-xl p-6 ${
          result.success 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
            : 'border-red-500 bg-red-50 dark:bg-red-900/10'
        }`}>
          <div className="flex items-start">
            <div className={`mr-3 mt-1 ${
              result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {result.success ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                result.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
              }`}>
                {result.message}
              </h3>
              
              {result.proxyUrl && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proxy URL:</p>
                  <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-3">
                    <code className="text-sm break-all block mb-2">{result.proxyUrl}</code>
                    <a
                      href={result.proxyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      <span>Open in new tab to download</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
              
              {result.details && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{result.details}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Note:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Ensure the URL points directly to a file (ends with .mp4, .mp3, .pdf, etc.)</li>
          <li>• Some servers may block proxy requests</li>
          <li>• Large files may take time to start downloading</li>
          <li>• The proxy supports files up to 4GB (Vercel limit)</li>
        </ul>
      </div>
    </div>
  )
}
