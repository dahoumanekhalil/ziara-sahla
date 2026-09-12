'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUI } from '@/context/UIContext'
import { useLang } from '@/context/LangContext'
import type { GalleryImage } from '@/lib/gallery'
import type { Category } from '@/lib/categories'

export default function GaleriePage() {
  const { openModal } = useUI()
  const { tr } = useLang()
  const g = tr.galleryPage
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [allPhotos, setAllPhotos] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(setAllPhotos)
      .catch(() => {})
    fetch('/api/categories')
      .then(r => r.json())
      .then((cs: Category[]) => setCategories(cs.filter(c => c.kind === 'gallery' && !c.hidden)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => observer.observe(el))

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % allPhotos.length : null)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + allPhotos.length) % allPhotos.length : null)
    }
    document.addEventListener('keydown', onKey)
    return () => { observer.disconnect(); document.removeEventListener('keydown', onKey) }
  }, [allPhotos])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  function sectionHeader(cat: Category): { badge: string; title: string; sub: string } {
    if (cat.name === 'sahara') return { badge: g.saharaBadge, title: g.saharaTitle, sub: g.saharaSub }
    if (cat.name === 'ghardaia') return { badge: g.ghardaiaBadge, title: g.ghardaiaTitle, sub: g.ghardaiaSub }
    if (cat.name === 'hotels') return { badge: g.hotelsBadge, title: g.hotelsTitle, sub: g.hotelsSub }
    const nice = cat.name.charAt(0).toUpperCase() + cat.name.slice(1)
    return { badge: cat.emoji, title: `${cat.emoji} ${nice}`, sub: '' }
  }

  return (
    <>
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <span className="badge">{g.badge}</span>
          <h1>{g.title}</h1>
          <p>{g.sub}</p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-page">
        <div className="container">

          {categories.map(cat => {
            const photos = allPhotos.filter(p => p.category === cat.name)
            if (photos.length === 0) return null
            const h = sectionHeader(cat)
            return (
              <div className="cat-section reveal" key={cat.id}>
                <div className="cat-header">
                  <span className="badge">{h.badge}</span>
                  <h2>{h.title}</h2>
                  {h.sub && <p>{h.sub}</p>}
                </div>
                <div className="photo-grid">
                  {photos.map((photo) => (
                    <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(allPhotos.indexOf(photo))}>
                      <Image src={photo.src} alt={photo.alt} width={400} height={280} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span className="photo-label">{photo.label}</span>
                      <span className="photo-zoom">🔍</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Page CTA */}
          <div className="page-cta reveal">
            <h2>{g.ctaTitle}</h2>
            <p>{g.ctaSub}</p>
            <div className="page-cta-btns">
              <button className="btn btn-primary" onClick={openModal}>{g.ctaBtn1}</button>
              <a href="/#services" className="btn btn-outline" style={{ color: 'var(--orange)', border: '2px solid var(--orange)', background: 'transparent' }}>{g.ctaBtn2}</a>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && allPhotos[lightboxIndex] && (
        <div className="lightbox open" onClick={() => setLightboxIndex(null)}>
          <button className="lightbox-close" onClick={() => setLightboxIndex(null)} aria-label="Close">✕</button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + allPhotos.length) % allPhotos.length) }} aria-label="Previous">‹</button>
          <Image
            className="lightbox-img"
            src={allPhotos[lightboxIndex].src}
            alt={allPhotos[lightboxIndex].alt}
            width={1200}
            height={800}
            onClick={e => e.stopPropagation()}
            unoptimized
          />
          <p className="lightbox-caption">{allPhotos[lightboxIndex].label} — {lightboxIndex + 1} / {allPhotos.length}</p>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % allPhotos.length) }} aria-label="Next">›</button>
        </div>
      )}
    </>
  )
}
