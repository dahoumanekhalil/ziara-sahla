'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUI } from '@/context/UIContext'
import { useLang, Lang } from '@/context/LangContext'
import { useTheme } from '@/context/ThemeContext'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  const isHome = pathname === '/'
  const { openModal, toggleSidebar, isSidebarOpen } = useUI()
  const { lang, setLang, tr } = useLang()
  const { theme, toggleTheme } = useTheme()

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
          <div className="logo-mark logo-mark--lg">
            <Image src="/assets/logo/logo.png" alt="Ziara-Sahla logo" width={60} height={60} draggable={false} />
          </div>
          Ziara-Sahla
        </Link>

        <ul className="nav-links">
          <li><Link href="/#about">{tr.nav.about}</Link></li>
          <li><Link href="/#services">{tr.nav.circuits}</Link></li>
          <li><Link href="/offres" className={pathname === '/offres' ? 'active' : ''}>{tr.nav.offers}</Link></li>
          <li><Link href="/galerie" className={pathname === '/galerie' ? 'active' : ''}>{tr.nav.gallery}</Link></li>
          <li><Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>{tr.nav.contact}</Link></li>
          <li>
            <button className="nav-cta" onClick={openModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {tr.nav.quote}
            </button>
          </li>
        </ul>

        <div className="nav-controls">
          <div className="lang-switch" role="group" aria-label="Language">
            {(['fr', 'en', 'ar'] as Lang[]).map((l) => (
              <button
                key={l}
                className={`lang-btn${lang === l ? ' active' : ''}`}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

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
