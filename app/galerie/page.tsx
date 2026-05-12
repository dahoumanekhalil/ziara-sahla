'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUI } from '@/context/UIContext'
import { useLang } from '@/context/LangContext'

const allPhotos = [
  { src: '/assets/sahara/sahara-desert.jpg', alt: 'Grand Erg Oriental – Sahara algérien', label: 'Grand Erg Oriental' },
  { src: '/assets/sahara/images.jpg', alt: 'Dunes du Sahara', label: 'Dunes' },
  { src: '/assets/sahara/-1x-1.webp', alt: 'Sahara algérien', label: 'Sahara' },
  { src: '/assets/sahara/a-saharan-oasis.jpg', alt: 'Oasis saharienne', label: 'Oasis' },
  { src: '/assets/sahara/ghardaia.jpg', alt: 'Paysage désertique près de Ghardaïa', label: 'Paysage désertique' },
  { src: '/assets/sahara/96449.jpg', alt: 'Désert algérien', label: 'Désert' },
  { src: '/assets/sahara/algeria-desert-landscape-at-sunny-day-wallpaper-1920x540_70.jpg', alt: 'Paysage algérien ensoleillé', label: 'Paysage algérien' },
  { src: '/assets/gherdaia/ghardaia-Par-VisualEyze-min.jpg', alt: "Ghardaïa – Vallée du M'Zab", label: "Vallée du M'Zab" },
  { src: '/assets/gherdaia/Ghardaia-1.jpeg', alt: 'Ghardaïa panorama', label: 'Panorama' },
  { src: '/assets/gherdaia/association-d-orientation.jpg', alt: 'Visite culturelle guidée', label: 'Visite guidée' },
  { src: '/assets/gherdaia/guided-tours-with-algerian.jpg', alt: 'Circuit touristique en groupe', label: 'Circuit en groupe' },
  { src: '/assets/hotels/algiers-marriott-hotel.jpg', alt: 'Marriott Alger', label: 'Marriott Alger' },
  { src: '/assets/hotels/sheraton-club-des-pins-resort-general-1267fc26.jpg', alt: 'Sheraton Club des Pins', label: 'Sheraton Club des Pins' },
  { src: '/assets/hotels/getlstd-property-photo.jpg', alt: 'Hôtel de charme', label: 'Hôtel de charme' },
  { src: '/assets/hotels/649232884.jpg', alt: 'Piscine hôtel Algérie', label: 'Piscine' },
  { src: '/assets/hotels/4de8805405a9d2deb1ded672b3c4371cd996655229816595b538429ece31.webp', alt: 'Hôtel luxe Algérie', label: 'Hôtel luxe' },
  { src: '/assets/hotels/exterior.jpg', alt: 'Extérieur hôtel', label: 'Extérieur' },
]

export default function GaleriePage() {
  const { openModal } = useUI()
  const { tr } = useLang()
  const g = tr.galleryPage
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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
  }, [])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  const sahara = allPhotos.slice(0, 7)
  const ghardaia = allPhotos.slice(7, 11)
  const hotels = allPhotos.slice(11)

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
              {sahara.map((photo, i) => (
                <div className="photo-item" key={i} onClick={() => setLightboxIndex(i)}>
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
              {ghardaia.map((photo, i) => (
                <div className="photo-item" key={i} onClick={() => setLightboxIndex(i + 7)}>
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
              {hotels.map((photo, i) => (
                <div className="photo-item" key={i} onClick={() => setLightboxIndex(i + 11)}>
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
      {lightboxIndex !== null && (
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
