import type { Metadata } from 'next'
import './globals.css'
import { UIProvider } from '@/context/UIContext'
import Nav from '@/components/Nav'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import QuoteModal from '@/components/QuoteModal'

export const metadata: Metadata = {
  title: 'Ziara-Sahla – Voyages culturels en groupe en Algérie',
  description: 'Ziara-Sahla organise des circuits culturels en groupe en Algérie pour clients européens et francophones. Sécurisés, authentiques et inoubliables.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <UIProvider>
          <Nav />
          <Sidebar />
          {children}
          <Footer />
          <QuoteModal />
        </UIProvider>
      </body>
    </html>
  )
}
