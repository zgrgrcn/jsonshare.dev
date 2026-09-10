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
        <div className="mx-auto w-[95vw] px-3 lg:w-[75vw] lg:px-0">
          <div className="flex flex-col">
            <main style={{ height: `calc(100vh - 69px)` }}>
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
