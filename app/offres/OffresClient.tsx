'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/context/LangContext'
import type { Offer } from '@/lib/types'
import OffersSection from '@/components/OffersSection'

export default function OffresClient({ offers }: { offers: Offer[] }) {
  const { tr } = useLang()
  const o = tr.offresPage
  const m = tr.offresModal
  const [quoteOpen, setQuoteOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); observer.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [offers])

  useEffect(() => {
    document.body.style.overflow = quoteOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [quoteOpen])

  function submitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = m.successMsg
    btn.style.background = '#2E7D32'
    btn.disabled = true
    setTimeout(() => {
      setQuoteOpen(false)
      btn.textContent = m.submit
      btn.style.background = ''
      btn.disabled = false
      ;(e.currentTarget as HTMLFormElement)?.reset()
    }, 3200)
  }

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
          <OffersSection offers={offers} />
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
              <button className="btn btn-primary" onClick={() => setQuoteOpen(true)}>{o.customBtn}</button>
              <Link href="/contact" className="btn btn-ghost">{o.contactBtn}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE MODAL for "sur mesure" CTA */}
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
                  <select>
                    <option value="">{m.groupOptions[0]}</option>
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
