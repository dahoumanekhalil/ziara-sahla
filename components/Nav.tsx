'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUI } from '@/context/UIContext'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { openModal, toggleSidebar, isSidebarOpen } = useUI()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navClass = `${!isHome || scrolled ? 'scrolled' : ''}`

  return (
    <nav id="nav" className={navClass} role="navigation" aria-label="Navigation principale">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="logo-mark">
            <Image src="/assets/logo/logo.png" alt="Ziara-Sahla logo" width={42} height={42} draggable={false} />
          </div>
          Ziara-Sahla
        </Link>

        <ul className="nav-links">
          <li><Link href="/#about" className={pathname === '/' ? '' : ''}>À propos</Link></li>
          <li><Link href="/#services">Circuits</Link></li>
          <li><Link href="/offres" className={pathname === '/offres' ? 'active' : ''}>Nos offres</Link></li>
          <li><Link href="/galerie" className={pathname === '/galerie' ? 'active' : ''}>Galerie</Link></li>
          <li><Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          <li>
            <button className="nav-cta" onClick={openModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Devis gratuit
            </button>
          </li>
        </ul>

        <button
          className={`hamburger${isSidebarOpen ? ' open' : ''}`}
          id="hamburger"
          aria-label="Ouvrir le menu"
          aria-expanded={isSidebarOpen}
          onClick={toggleSidebar}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}
