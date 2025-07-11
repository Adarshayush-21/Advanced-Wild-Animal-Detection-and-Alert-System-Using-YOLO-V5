import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WildGuard - AI Animal Detection System',
  description: 'Advanced wild animal detection and alert system using AI to prevent human-animal conflicts',
  keywords: 'animal detection, AI, YOLO, wildlife safety, alert system',
  authors: [{ name: 'WildGuard Team' }],
  themeColor: '#22c55e',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-green-50 to-blue-50 min-h-screen`}>
        <main>{children}</main>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}