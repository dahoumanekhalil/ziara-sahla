'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUI } from '@/context/UIContext'
import type { Offer } from '@/lib/types'

const filterLabels = [
  { key: 'all', label: 'Toutes les offres' },
  { key: 'sahara', label: '🏜️ Sahara' },
  { key: 'culture', label: '🏛️ Culture' },
  { key: 'premium', label: '👑 Premium' },
  { key: 'corporate', label: '🏢 Corporate' },
]

const catDisplayLabels: Record<string, string> = {
  sahara: 'Sahara',
  culture: 'Culture',
  premium: 'Premium',
  corporate: 'Corporate',
}

export default function OffresClient({ offers }: { offers: Offer[] }) {
  const { openModal } = useUI()
  const [activeFilter, setActiveFilter] = useState('all')
  const [detailIdx, setDetailIdx] = useState<number | null>(null)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); observer.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => observer.observe(el))

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDetailIdx(null); setQuoteOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => { observer.disconnect(); document.removeEventListener('keydown', onKey) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = (detailIdx !== null || quoteOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [detailIdx, quoteOpen])

  const filtered = activeFilter === 'all' ? offers : offers.filter(o => o.cat === activeFilter)

  function openQuote(name = '') {
    setSelectedOffer(name)
    setDetailIdx(null)
    setQuoteOpen(true)
  }

  function submitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = '✓ Demande envoyée !'
    btn.style.background = '#2E7D32'
    btn.disabled = true
    setTimeout(() => {
      setQuoteOpen(false)
      btn.textContent = 'Envoyer ma demande →'
      btn.style.background = ''
      btn.disabled = false
      ;(e.currentTarget as HTMLFormElement)?.reset()
    }, 3200)
  }

  const detail = detailIdx !== null ? filtered[detailIdx] : null

  return (
    <>
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <span className="badge">Voyages &amp; Circuits</span>
          <h1>Nos Offres en Algérie</h1>
          <p>Du désert saharien aux cités millénaires, choisissez l&apos;aventure qui vous correspond.</p>
        </div>
      </section>

      {/* OFFERS */}
      <section className="offers-section">
        <div className="container">

          {/* Filter bar */}
          <div className="filter-bar reveal">
            {filterLabels.map(f => (
              <button
                key={f.key}
                className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="offers-grid" id="offers-grid">
            {filtered.map((offer, i) => (
              <div
                key={offer.id}
                className={`offer-card reveal${offer.cat === 'premium' ? ' featured' : ''}`}
                style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
              >
                <div className="offer-img">
                  <Image src={offer.img} alt={offer.title} width={400} height={240} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="offer-cat">{catDisplayLabels[offer.cat] ?? offer.cat}</span>
                  {offer.cat === 'sahara' && <span className="offer-status status-hot">Populaire</span>}
                  {offer.cat === 'premium' && <span className="offer-status status-top">Best-seller</span>}
                  {offer.cat === 'corporate' && <span className="offer-status status-promo">Entreprises</span>}
                  <span className="offer-duration">🗓️ {offer.dur}</span>
                </div>
                <div className="offer-body">
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-desc">{offer.desc.slice(0, 130)}…</p>
                  <ul className="offer-highlights">
                    {offer.inclus.slice(0, 5).map((inc, j) => (
                      <li key={j}><span className="hi-ico">{inc.ico}</span> {inc.txt}</li>
                    ))}
                  </ul>
                  <div className="offer-foot">
                    <div className="offer-price">
                      <span className="from">{offer.cat === 'premium' ? 'Tarif premium' : offer.cat === 'corporate' ? 'Tarif groupe' : 'À partir de'}</span>
                      <strong>Sur devis</strong> <small>/ pers.</small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="offer-detail" onClick={() => setDetailIdx(i)}>Détails</button>
                      <button className="offer-devis" onClick={() => openQuote(offer.title)}>Devis →</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUR MESURE */}
      <section className="custom-strip">
        <div className="container">
          <div className="custom-inner">
            <div className="custom-text">
              <h2>Votre voyage sur mesure</h2>
              <p>Vous avez un projet spécial — mariage, pèlerinage, voyage scolaire, anniversaire ? Nous construisons un circuit unique rien que pour votre groupe.</p>
            </div>
            <div className="custom-actions">
              <button className="btn btn-primary" onClick={() => openQuote()}>Demander un devis sur mesure →</button>
              <Link href="/contact" className="btn btn-ghost">Nous contacter</Link>
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      {detail && (
        <div className="modal-overlay open" onClick={() => setDetailIdx(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setDetailIdx(null)} style={{ top: '14px', right: '14px', background: 'rgba(0,0,0,.35)', color: '#fff' }} aria-label="Fermer">✕</button>
            <div className="detail-hero">
              <Image src={detail.img} alt={detail.title} width={800} height={300} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
              <div className="detail-hero-info">
                <h2>{detail.title}</h2>
                <span className="detail-dur-pill">🗓️ {detail.dur}</span>
              </div>
            </div>
            <div className="detail-body">
              <div className="detail-meta">
                {detail.meta.map((m, i) => (
                  <div className="detail-meta-item" key={i}><span>{m.icon}</span>{m.label}</div>
                ))}
              </div>
              <div className="detail-section">
                <h4>À propos de ce circuit</h4>
                <p className="detail-desc">{detail.desc}</p>
              </div>
              <div className="detail-section">
                <h4>Ce qui est inclus</h4>
                <ul className="detail-feats">
                  {detail.inclus.map((f, i) => (
                    <li key={i}><span className="df-ico">{f.ico}</span> {f.txt}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>Programme jour par jour</h4>
                <ul className="detail-prog">
                  {detail.programme.map((p, i) => (
                    <li className="detail-day" key={i}>
                      <div className="day-num">{p.j}</div>
                      <div className="day-content"><strong>{p.titre}</strong><p>{p.desc}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-foot">
                <div className="detail-price">
                  <span className="det-from">À partir de</span>
                  <strong>Sur devis</strong>
                </div>
                <div className="detail-actions">
                  <button className="offer-detail" onClick={() => setDetailIdx(null)}>Fermer</button>
                  <button className="offer-devis" onClick={() => openQuote(detail.title)}>Demander un devis →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUOTE MODAL */}
      {quoteOpen && (
        <div className="modal-overlay open" onClick={() => setQuoteOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setQuoteOpen(false)} aria-label="Fermer">✕</button>
            <h2>Demande de devis</h2>
            <p className="sub">Remplissez ce formulaire et notre équipe vous contacte sous 24h.</p>
            <form onSubmit={submitQuote}>
              <div className="fg-row">
                <div className="fg"><label htmlFor="qm-prenom">Prénom *</label><input type="text" id="qm-prenom" placeholder="Marie" required /></div>
                <div className="fg"><label htmlFor="qm-nom">Nom *</label><input type="text" id="qm-nom" placeholder="Dupont" required /></div>
              </div>
              <div className="fg"><label htmlFor="qm-email">Email *</label><input type="email" id="qm-email" placeholder="marie@exemple.com" required /></div>
              <div className="fg"><label htmlFor="qm-tel">Téléphone</label><input type="tel" id="qm-tel" placeholder="+33 6 12 34 56 78" /></div>
              <div className="fg-row">
                <div className="fg">
                  <label htmlFor="qm-groupe">Taille du groupe</label>
                  <select id="qm-groupe">
                    <option value="">Sélectionner</option>
                    <option>1 – 10 personnes</option>
                    <option>11 – 25 personnes</option>
                    <option>26 – 50 personnes</option>
                    <option>50+ personnes</option>
                  </select>
                </div>
                <div className="fg">
                  <label htmlFor="qm-offre">Offre souhaitée</label>
                  <select id="qm-offre" value={selectedOffer} onChange={e => setSelectedOffer(e.target.value)}>
                    <option value="">Sélectionner</option>
                    {offers.map(o => <option key={o.id} value={o.title}>{o.title}</option>)}
                    <option>Sur mesure</option>
                  </select>
                </div>
              </div>
              <div className="fg"><label htmlFor="qm-msg">Message</label><textarea id="qm-msg" placeholder="Dates souhaitées, besoins spécifiques…"></textarea></div>
              <button type="submit" className="form-submit">Envoyer ma demande →</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
