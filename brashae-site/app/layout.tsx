import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: "Brashae's Barber Beauty Supply — Houston TX",
  description: "Professional barber and beauty supply store. Salon suite complex with 30+ suites. 11902 S Gessner, Houston TX.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div style={{ paddingTop: 64 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
