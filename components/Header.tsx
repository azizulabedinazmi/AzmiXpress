'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center text-lg font-bold text-white">
              🚀
            </div>
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Azmi<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Xpress</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Browse
            </Link>
            <Link href="/test" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Test Proxy
            </Link>
            <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Admin
            </Link>
            <a 
              href="https://github.com/azizulabedinazmi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              GitHub
            </a>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg border border-gray-300 dark:border-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                href="/test" 
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Test Proxy
              </Link>
              <Link 
                href="/admin" 
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <a 
                href="https://github.com/azizulabedinazmi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                GitHub
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
