'use client'

import { useState, useEffect } from 'react'
import TestProxy from '@/components/TestProxy'

export default function TestPage() {
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  const testUrls = [
    {
      name: 'Sample Video (MP4)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video'
    },
    {
      name: 'Sample Audio (MP3)',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      type: 'audio'
    },
    {
      name: 'Sample PDF',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      type: 'document'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Proxy Test Center
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Test our proxy server with various file types. Enter any direct download URL to test.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quick Test</h2>
            <TestProxy />
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sample URLs</h2>
            <div className="space-y-4">
              {testUrls.map((test, index) => (
                <div 
                  key={index}
                  className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded mr-3 flex items-center justify-center ${
                        test.type === 'video' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' :
                        test.type === 'audio' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                        'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                      }`}>
                        {test.type === 'video' ? '🎬' : test.type === 'audio' ? '🎵' : '📄'}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{test.name}</span>
                    </div>
                    <a
                      href={`${baseUrl}/api/proxy/download?url=${encodeURIComponent(test.url)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Test
                    </a>
                  </div>
                  <code className="block text-sm text-gray-600 dark:text-gray-400 break-all mt-2">
                    {test.url}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">How to Use</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">1. Get Direct URL</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find the direct download link of the file you want to download. Right-click on download buttons and select "Copy link address".
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">2. Create Proxy URL</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <code className="text-sm break-all">
                  {baseUrl}/api/proxy/download?url=YOUR_DIRECT_URL_HERE
                </code>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Replace YOUR_DIRECT_URL_HERE with the actual file URL
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">3. Download File</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Open the proxy URL in your browser or use it in download managers. The file will download directly through our proxy.
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Supported File Types</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'Videos', ext: '.mp4, .avi, .mov, .mkv' },
                  { type: 'Audio', ext: '.mp3, .wav, .aac, .flac' },
                  { type: 'Documents', ext: '.pdf, .doc, .xlsx, .ppt' },
                  { type: 'Images', ext: '.jpg, .png, .gif, .webp' },
                  { type: 'Archives', ext: '.zip, .rar, .7z, .tar' },
                  { type: 'Others', ext: 'All binary files' },
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="font-medium text-gray-900 dark:text-white">{item.type}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.ext}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-300 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Proxy Information</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">No CORS</div>
            <p className="text-gray-600 dark:text-gray-400">Bypass all cross-origin restrictions</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">10+</div>
            <p className="text-gray-600 dark:text-gray-400">User Agents for rotation</p>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">∞</div>
            <p className="text-gray-600 dark:text-gray-400">Unlimited file size support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
