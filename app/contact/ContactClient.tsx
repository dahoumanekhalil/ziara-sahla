'use client'
import { useEffect, useRef } from 'react'
import { useLang } from '@/context/LangContext'
import type { ContactInfo } from '@/lib/contact'

function telHref(v: string) {
  return 'tel:' + v.replace(/[^+\d]/g, '')
}

export default function ContactClient({ info }: { info: ContactInfo }) {
  const { tr } = useLang()
  const c = tr.contactPage
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 },
    )
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = '✓ ' + c.successTitle
    btn.style.background = '#2E7D32'
    btn.disabled = true
    setTimeout(() => {
      if (formRef.current) formRef.current.style.display = 'none'
      if (successRef.current) successRef.current.style.display = 'block'
    }, 400)
  }

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="badge">{c.badge}</span>
          <h1>{c.title}</h1>
          <p>{c.sub}</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info reveal-l">
              <h2>{c.infoTitle}</h2>
              <p className="intro">{c.intro}</p>

              <div className="info-cards">
                {info.email && (
                  <div className="info-card">
                    <div className="info-icon">📧</div>
                    <div className="info-content">
                      <h4>{c.emailLabel}</h4>
                      <a href={`mailto:${info.email}`}>{info.email}</a>
                      <span className="sub-line">{c.emailSub}</span>
                    </div>
                  </div>
                )}

                {info.phoneFr && (
                  <div className="info-card">
                    <div className="info-icon">📞</div>
                    <div className="info-content">
                      <h4>{c.phoneFrLabel}</h4>
                      <a href={telHref(info.phoneFr)}>{info.phoneFr}</a>
                      <span className="sub-line">{c.phoneFrSub}</span>
                    </div>
                  </div>
                )}

                {info.phoneDz && (
                  <div className="info-card">
                    <div className="info-icon">🇩🇿</div>
                    <div className="info-content">
                      <h4>{c.phoneDzLabel}</h4>
                      <a href={telHref(info.phoneDz)}>{info.phoneDz}</a>
                      <span className="sub-line">{c.phoneDzSub}</span>
                    </div>
                  </div>
                )}

                {(info.addressFr || info.addressDz) && (
                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <h4>{c.officesLabel}</h4>
                      {info.addressFr && <span>{info.addressFr}</span>}
                      {info.addressDz && <span>{info.addressDz}</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="contact-socials">
                <h4>{c.socialLabel}</h4>
                <div className="socials">
                  {info.facebookUrl && (
                    <a href={info.facebookUrl} target="_blank" rel="noopener noreferrer" className="soc" aria-label="Facebook">f</a>
                  )}
                  {info.instagramUrl && (
                    <a href={info.instagramUrl} target="_blank" rel="noopener noreferrer" className="soc" aria-label="Instagram">ig</a>
                  )}
                  {info.linkedinUrl && (
                    <a href={info.linkedinUrl} target="_blank" rel="noopener noreferrer" className="soc" aria-label="LinkedIn">in</a>
                  )}
                  {info.whatsappUrl && (
                    <a href={info.whatsappUrl} target="_blank" rel="noopener noreferrer" className="soc" aria-label="WhatsApp">wa</a>
                  )}
                </div>
              </div>
            </div>

            <div className="contact-form-wrap reveal-r">
              <div className="response-badge">
                <span className="response-dot"></span>
                {c.responseBadge}
              </div>
              <h3>{c.formTitle}</h3>
              <p className="form-sub">{c.formSub}</p>

              <form id="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <div className="fg-row">
                  <div className="fg">
                    <label htmlFor="prenom">{c.firstName}</label>
                    <input type="text" id="prenom" name="prenom" placeholder="Marie" required />
                  </div>
                  <div className="fg">
                    <label htmlFor="nom">{c.lastName}</label>
                    <input type="text" id="nom" name="nom" placeholder="Dupont" required />
                  </div>
                </div>
                <div className="fg">
                  <label htmlFor="email">{c.email}</label>
                  <input type="email" id="email" name="email" placeholder="marie@exemple.com" required />
                </div>
                <div className="fg">
                  <label htmlFor="tel">{c.phone}</label>
                  <input type="tel" id="tel" name="tel" placeholder="+33 6 12 34 56 78" />
                </div>
                <div className="fg-row">
                  <div className="fg">
                    <label htmlFor="groupe">{c.groupSize}</label>
                    <select id="groupe" name="groupe">
                      {c.groupOptions.map((opt, i) => (
                        <option key={i} value={i === 0 ? '' : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fg">
                    <label htmlFor="sujet">{c.subject}</label>
                    <select id="sujet" name="sujet">
                      {c.subjectOptions.map((opt, i) => (
                        <option key={i} value={i === 0 ? '' : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="fg">
                  <label htmlFor="message">{c.message}</label>
                  <textarea id="message" name="message" placeholder={c.messagePlaceholder} required />
                </div>
                <button type="submit" className="form-submit">{c.submit}</button>
              </form>

              <div className="form-success" ref={successRef} style={{ display: 'none' }}>
                <div className="check">✅</div>
                <h3>{c.successTitle}</h3>
                <p>{c.successMsg}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="map-strip">
        <div className="container">
          <div className="offices reveal">
            {info.addressFr && (
              <div className="office-card">
                <div className="office-flag">🇫🇷</div>
                <div className="office-info">
                  <h4>{c.office1Title}</h4>
                  <p>{info.addressFr}</p>
                </div>
              </div>
            )}
            {info.addressDz && (
              <div className="office-card">
                <div className="office-flag">🇩🇿</div>
                <div className="office-info">
                  <h4>{c.office2Title}</h4>
                  <p>{info.addressDz}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
