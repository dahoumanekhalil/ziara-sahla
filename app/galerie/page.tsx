'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUI } from '@/context/UIContext'
import { useLang } from '@/context/LangContext'
import type { GalleryImage } from '@/lib/gallery'

export default function GaleriePage() {
  const { openModal } = useUI()
  const { tr } = useLang()
  const g = tr.galleryPage
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [allPhotos, setAllPhotos] = useState<GalleryImage[]>([])

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(setAllPhotos)
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

  const sahara = allPhotos.filter(p => p.category === 'sahara')
  const ghardaia = allPhotos.filter(p => p.category === 'ghardaia')
  const hotels = allPhotos.filter(p => p.category === 'hotels')

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

          {/* Sahara */}
          <div className="cat-section reveal">
            <div className="cat-header">
              <span className="badge">{g.saharaBadge}</span>
              <h2>{g.saharaTitle}</h2>
              <p>{g.saharaSub}</p>
            </div>
            <div className="photo-grid">
              {sahara.map((photo) => (
                <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(allPhotos.indexOf(photo))}>
                  <Image src={photo.src} alt={photo.alt} width={400} height={280} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="photo-label">{photo.label}</span>
                  <span className="photo-zoom">🔍</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ghardaïa */}
          <div className="cat-section reveal">
            <div className="cat-header">
              <span className="badge">{g.ghardaiaBadge}</span>
              <h2>{g.ghardaiaTitle}</h2>
              <p>{g.ghardaiaSub}</p>
            </div>
            <div className="photo-grid">
              {ghardaia.map((photo) => (
                <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(allPhotos.indexOf(photo))}>
                  <Image src={photo.src} alt={photo.alt} width={400} height={280} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="photo-label">{photo.label}</span>
                  <span className="photo-zoom">🔍</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hotels */}
          <div className="cat-section reveal">
            <div className="cat-header">
              <span className="badge">{g.hotelsBadge}</span>
              <h2>{g.hotelsTitle}</h2>
              <p>{g.hotelsSub}</p>
            </div>
            <div className="photo-grid">
              {hotels.map((photo) => (
                <div className="photo-item" key={photo.id} onClick={() => setLightboxIndex(allPhotos.indexOf(photo))}>
                  <Image src={photo.src} alt={photo.alt} width={400} height={280} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="photo-label">{photo.label}</span>
                  <span className="photo-zoom">🔍</span>
                </div>
              ))}
            </div>
          </div>

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
