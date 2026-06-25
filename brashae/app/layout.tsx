import type { Metadata } from 'next'
import './globals.css'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: "Brashae's Shop — Professional Barber & Beauty Supply",
  description: 'Shop professional barber and beauty supplies. Houston TX.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <Navbar />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  )
}
