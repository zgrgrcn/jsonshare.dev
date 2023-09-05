import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from './components/Header'
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JSON Share',
  description: 'Create - Edit and View JSON files online!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="mx-auto max-w-3xl px-3 sm:px-6 xl:max-w-5xl xl:px-0">
          <div className="flex flex-col justify-between">
            <main style={{ minHeight: `calc(100vh - 69px)` }}>
              <Providers>
                {children}
              </Providers>
            </main>
            {/* <Footer /> */}
          </div>
        </div>
      </body>
    </html>
  )
}
