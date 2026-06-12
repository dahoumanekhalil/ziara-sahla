'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUI } from '@/context/UIContext'
import { useLang } from '@/context/LangContext'
import type { Offer } from '@/lib/types'

const catDisplayLabels: Record<string, string> = {
  sahara: 'Sahara',
  culture: 'Culture',
  premium: 'Premium',
  corporate: 'Corporate',
}

type MLString = { fr: string; en: string; ar: string }

export default function OffresClient({ offers }: { offers: Offer[] }) {
  const { openModal } = useUI()
  const { tr, lang } = useLang()
  const o = tr.offresPage

  function ml(v: MLString | string): string {
    if (typeof v === 'string') return v
    return v[lang] || v.fr || ''
  }
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

  const filtered = activeFilter === 'all' ? offers : offers.filter(of => of.cat === activeFilter)

  function openQuote(name = '') {
    setSelectedOffer(name)
    setDetailIdx(null)
    setQuoteOpen(true)
  }

  function submitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = tr.offresModal.successMsg
    btn.style.background = '#2E7D32'
    btn.disabled = true
    setTimeout(() => {
      setQuoteOpen(false)
      btn.textContent = tr.offresModal.submit
      btn.style.background = ''
      btn.disabled = false
      ;(e.currentTarget as HTMLFormElement)?.reset()
    }, 3200)
  }

  function getPriceLabel(cat: string) {
    if (cat === 'premium') return o.pricePremium
    if (cat === 'corporate') return o.priceCorporate
    if (cat === 'sahara') return o.priceSahara
    return o.priceDefault
  }

  const detail = detailIdx !== null ? filtered[detailIdx] : null
  const m = tr.offresModal

  return (
    <>
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <span className="badge">{o.badge}</span>
          <h1>{o.title}</h1>
          <p>{o.sub}</p>
        </div>
      </section>

      {/* OFFERS */}
      <section className="offers-section">
        <div className="container">

          {/* Filter bar */}
          <div className="filter-bar reveal">
            {o.filters.map(f => (
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
                  <Image src={offer.img} alt={ml(offer.title)} width={400} height={240} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="offer-cat">{catDisplayLabels[offer.cat] ?? offer.cat}</span>
                  {offer.cat === 'sahara' && <span className="offer-status status-hot">{o.statusSahara}</span>}
                  {offer.cat === 'premium' && <span className="offer-status status-top">{o.statusPremium}</span>}
                  {offer.cat === 'corporate' && <span className="offer-status status-promo">{o.statusCorporate}</span>}
                  <span className="offer-duration">🗓️ {ml(offer.dur)}</span>
                </div>
                <div className="offer-body">
                  <h3 className="offer-title">{ml(offer.title)}</h3>
                  <p className="offer-desc">{ml(offer.desc).slice(0, 130)}…</p>
                  <ul className="offer-highlights">
                    {offer.inclus.slice(0, 5).map((inc, j) => (
                      <li key={j}><span className="hi-ico">{inc.ico}</span> {ml(inc.txt)}</li>
                    ))}
                  </ul>
                  <div className="offer-foot">
                    <div className="offer-price">
                      <span className="from">{getPriceLabel(offer.cat)}</span>
                      <strong>{o.priceValue}</strong> <small>{o.perPerson}</small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="offer-detail" onClick={() => setDetailIdx(i)}>{o.detailBtn}</button>
                      <button className="offer-devis" onClick={() => openQuote(ml(offer.title))}>{o.quoteBtn}</button>
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
              <h2>{o.customTitle}</h2>
              <p>{o.customSub}</p>
            </div>
            <div className="custom-actions">
              <button className="btn btn-primary" onClick={() => openQuote()}>{o.customBtn}</button>
              <Link href="/contact" className="btn btn-ghost">{o.contactBtn}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* DETAIL MODAL */}
      {detail && (
        <div className="modal-overlay open" onClick={() => setDetailIdx(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setDetailIdx(null)} style={{ top: '14px', right: '14px', background: 'rgba(0,0,0,.35)', color: '#fff' }} aria-label="Close">✕</button>
            <div className="detail-hero">
              <Image src={detail.img} alt={ml(detail.title)} width={800} height={300} style={{ width: '100%', height: '260px', objectFit: 'cover' }} />
              <div className="detail-hero-info">
                <h2>{ml(detail.title)}</h2>
                <span className="detail-dur-pill">🗓️ {ml(detail.dur)}</span>
              </div>
            </div>
            <div className="detail-body">
              <div className="detail-meta">
                {detail.meta.map((mt, i) => (
                  <div className="detail-meta-item" key={i}><span>{mt.icon}</span>{ml(mt.label)}</div>
                ))}
              </div>
              <div className="detail-section">
                <h4>{o.aboutCircuit}</h4>
                <p className="detail-desc">{ml(detail.desc)}</p>
              </div>
              <div className="detail-section">
                <h4>{o.includedLabel}</h4>
                <ul className="detail-feats">
                  {detail.inclus.map((f, i) => (
                    <li key={i}><span className="df-ico">{f.ico}</span> {ml(f.txt)}</li>
                  ))}
                </ul>
              </div>
              <div className="detail-section">
                <h4>{o.programLabel}</h4>
                <ul className="detail-prog">
                  {detail.programme.map((p, i) => (
                    <li className="detail-day" key={i}>
                      <div className="day-num">{p.j}</div>
                      <div className="day-content"><strong>{ml(p.titre)}</strong><p>{ml(p.desc)}</p></div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="detail-foot">
                <div className="detail-price">
                  <span className="det-from">{o.fromLabel}</span>
                  <strong>{o.priceValue}</strong>
                </div>
                <div className="detail-actions">
                  <button className="offer-detail" onClick={() => setDetailIdx(null)}>{o.closeBtn}</button>
                  <button className="offer-devis" onClick={() => openQuote(ml(detail.title))}>{o.sendQuote}</button>
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
            <button className="modal-x" onClick={() => setQuoteOpen(false)} aria-label="Close">✕</button>
            <h2>{m.title}</h2>
            <p className="sub">{m.sub}</p>
            <form onSubmit={submitQuote}>
              <div className="fg-row">
                <div className="fg"><label>{m.firstName}</label><input type="text" placeholder="Marie" required /></div>
                <div className="fg"><label>{m.lastName}</label><input type="text" placeholder="Dupont" required /></div>
              </div>
              <div className="fg"><label>{m.email}</label><input type="email" placeholder="marie@exemple.com" required /></div>
              <div className="fg"><label>{m.phone}</label><input type="tel" placeholder="+33 6 12 34 56 78" /></div>
              <div className="fg-row">
                <div className="fg">
                  <label>{m.groupSize}</label>
                  <select>
                    {m.groupOptions.map((opt, i) => <option key={i} value={i === 0 ? '' : opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label>{m.desiredOffer}</label>
                  <select value={selectedOffer} onChange={e => setSelectedOffer(e.target.value)}>
                    <option value="">{m.groupOptions[0]}</option>
                    {offers.map(of => <option key={of.id} value={ml(of.title)}>{ml(of.title)}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg"><label>{m.message}</label><textarea placeholder={m.messagePlaceholder}></textarea></div>
              <button type="submit" className="form-submit">{m.submit}</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
