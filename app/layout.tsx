import Header from '@/components/Header'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🚀 AzmiXpress - Advanced Proxy Server | Download & Browse',
  description: '⚡ Lightning-fast proxy server with file downloads, web browsing, and testing. No CORS restrictions, download any file, browse any website anonymously.',
  keywords: ['proxy', 'file downloader', 'web browser', 'bypass restrictions', 'CORS'],
  authors: [
    {
      name: 'Azizul Abedin Azmi',
      url: 'https://github.com/azizulabedinazmi',
    },
  ],
  openGraph: {
    title: '🚀 AzmiXpress - Advanced Proxy Server',
    description: 'Download files and browse websites through a powerful proxy',
    url: 'https://azmixpress.vercel.app',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} antialiased`}>
        <div className="min-h-screen bg-white dark:bg-black">
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            <div className="max-w-6xl mx-auto px-4">
              <p>🚀 <strong>AzmiXpress</strong> - Advanced Proxy Server</p>
              <p className="mt-2">⚡ Download | 🌐 Browse | 🧪 Test</p>
              <p className="mt-2 text-xs">Made with ❤️ by <a href="https://github.com/azizulabedinazmi" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Azizul Abedin Azmi</a></p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
