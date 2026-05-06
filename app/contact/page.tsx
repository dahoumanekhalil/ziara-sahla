'use client'
import { useEffect, useRef } from 'react'

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('on'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = '✓ Message envoyé !'
    btn.style.background = '#2E7D32'
    btn.disabled = true

    setTimeout(() => {
      if (formRef.current) formRef.current.style.display = 'none'
      if (successRef.current) successRef.current.style.display = 'block'
    }, 400)
  }

  return (
    <>
      {/* PAGE BANNER */}
      <section className="page-banner">
        <div className="container">
          <span className="badge">Contactez-nous</span>
          <h1>Nous sommes à votre écoute</h1>
          <p>Une question, un projet de voyage, un devis ? Notre équipe franco-algérienne vous répond sous 24h.</p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">

            {/* Left: info */}
            <div className="contact-info reveal-l">
              <h2>Nos coordonnées</h2>
              <p className="intro">
                Une question sur un circuit, un devis groupe ou une demande spéciale ? Contactez-nous directement — nous adorons organiser des aventures sur mesure.
              </p>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <div className="info-content">
                    <h4>Email</h4>
                    <a href="mailto:contact@ziara-sahla.com">contact@ziara-sahla.com</a>
                    <span className="sub-line">Réponse garantie sous 24h</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <div className="info-content">
                    <h4>Téléphone – France</h4>
                    <a href="tel:+33123456789">+33 1 23 45 67 89</a>
                    <span className="sub-line">Lun – Ven · 9h – 18h (Paris)</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">🇩🇿</div>
                  <div className="info-content">
                    <h4>Téléphone – Algérie</h4>
                    <a href="tel:+213555000000">+213 555 000 000</a>
                    <span className="sub-line">Lun – Sam · 8h – 17h (Alger)</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <div className="info-content">
                    <h4>Bureaux</h4>
                    <span>Paris, France</span>
                    <span>Alger, Algérie</span>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <h4>Suivez-nous</h4>
                <div className="socials">
                  <a href="#" className="soc" aria-label="Facebook">f</a>
                  <a href="#" className="soc" aria-label="Instagram">ig</a>
                  <a href="#" className="soc" aria-label="LinkedIn">in</a>
                  <a href="#" className="soc" aria-label="WhatsApp">wa</a>
                </div>
              </div>
            </div>

            {/* Right: form */}
            <div className="contact-form-wrap reveal-r">
              <div className="response-badge">
                <span className="response-dot"></span>
                Nous répondons en moins de 24h
              </div>
              <h3>Envoyez-nous un message</h3>
              <p className="form-sub">
                Décrivez votre projet de voyage et nous vous préparons une proposition sur mesure, gratuitement.
              </p>

              <form id="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <div className="fg-row">
                  <div className="fg"><label htmlFor="prenom">Prénom *</label><input type="text" id="prenom" name="prenom" placeholder="Marie" required /></div>
                  <div className="fg"><label htmlFor="nom">Nom *</label><input type="text" id="nom" name="nom" placeholder="Dupont" required /></div>
                </div>
                <div className="fg"><label htmlFor="email">Email *</label><input type="email" id="email" name="email" placeholder="marie@exemple.com" required /></div>
                <div className="fg"><label htmlFor="tel">Téléphone</label><input type="tel" id="tel" name="tel" placeholder="+33 6 12 34 56 78" /></div>
                <div className="fg-row">
                  <div className="fg">
                    <label htmlFor="groupe">Taille du groupe</label>
                    <select id="groupe" name="groupe">
                      <option value="">Sélectionner</option>
                      <option>1 – 10 personnes</option>
                      <option>11 – 25 personnes</option>
                      <option>26 – 50 personnes</option>
                      <option>50+ personnes</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label htmlFor="sujet">Sujet</label>
                    <select id="sujet" name="sujet">
                      <option value="">Sélectionner</option>
                      <option>Demande de devis</option>
                      <option>Renseignements circuits</option>
                      <option>Partenariat</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>
                <div className="fg"><label htmlFor="message">Message *</label><textarea id="message" name="message" placeholder="Décrivez votre projet : dates souhaitées, destinations, besoins particuliers…" required></textarea></div>
                <button type="submit" className="form-submit">Envoyer mon message →</button>
              </form>

              <div className="form-success" id="form-success" ref={successRef} style={{ display: 'none' }}>
                <div className="check">✅</div>
                <h3>Message envoyé !</h3>
                <p>Merci de nous avoir contactés. Notre équipe vous répondra dans les 24 heures avec une proposition personnalisée.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="map-strip">
        <div className="container">
          <div className="offices reveal">
            <div className="office-card">
              <div className="office-flag">🇫🇷</div>
              <div className="office-info">
                <h4>Bureau France – Paris</h4>
                <p>Coordination des départs européens, relations clients francophones, devis personnalisés.</p>
              </div>
            </div>
            <div className="office-card">
              <div className="office-flag">🇩🇿</div>
              <div className="office-info">
                <h4>Bureau Algérie – Alger</h4>
                <p>Gestion logistique sur place, guides, hébergements et sécurité. Ouvert 7j/7 pendant les circuits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
