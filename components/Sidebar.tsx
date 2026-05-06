'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useUI } from '@/context/UIContext'

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar, openModal } = useUI()

  return (
    <>
      <div
        className={`sidebar-overlay${isSidebarOpen ? ' open' : ''}`}
        id="sidebar-overlay"
        onClick={closeSidebar}
      />

      <aside
        className={`sidebar${isSidebarOpen ? ' open' : ''}`}
        id="sidebar"
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="sidebar-head">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <Image src="/assets/logo/logo.png" alt="Ziara-Sahla logo" width={42} height={42} draggable={false} />
            </div>
            Ziara-Sahla
          </div>
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Fermer le menu">✕</button>
        </div>

        <nav className="sidebar-links">
          <Link href="/#about" onClick={closeSidebar}>À propos <span className="arrow">›</span></Link>
          <Link href="/#services" onClick={closeSidebar}>Nos circuits <span className="arrow">›</span></Link>
          <Link href="/#trust" onClick={closeSidebar}>Sécurité <span className="arrow">›</span></Link>
          <Link href="/#why" onClick={closeSidebar}>Pourquoi nous <span className="arrow">›</span></Link>
          <Link href="/offres" onClick={closeSidebar}>Nos offres <span className="arrow">›</span></Link>
          <Link href="/galerie" onClick={closeSidebar}>Galerie <span className="arrow">›</span></Link>
          <Link href="/contact" onClick={closeSidebar}>Contact <span className="arrow">›</span></Link>
        </nav>

        <div className="sidebar-foot">
          <button
            className="btn btn-primary"
            onClick={() => { openModal(); closeSidebar() }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Demandez un devis gratuit
          </button>
          <div className="sidebar-contact">
            <p>📞 <a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
            <p>📧 <a href="mailto:contact@ziara-sahla.com">contact@ziara-sahla.com</a></p>
          </div>
        </div>
      </aside>
    </>
  )
}
