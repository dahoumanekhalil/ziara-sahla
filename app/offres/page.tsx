'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useUI } from '@/context/UIContext'

interface Offer {
  title: string
  img: string
  cat: string
  dur: string
  desc: string
  meta: { icon: string; label: string }[]
  inclus: { ico: string; txt: string }[]
  programme: { j: string; titre: string; desc: string }[]
}

const offers: Offer[] = [
  {
    title: 'Sahara Classique',
    img: '/assets/sahara/sahara-desert.jpg',
    cat: 'sahara',
    dur: '7 jours / 6 nuits',
    desc: "Partez à la conquête du Grand Erg Oriental, l'un des plus grands déserts de sable au monde. Traversée de dunes monumentales, nuit en bivouac sous un ciel étoilé, découverte des oasis cachées et rencontre avec les nomades touaregs. Un voyage qui transforme.",
    meta: [
      { icon: '📍', label: 'Départ: Alger → Ghardaïa → Tamanrasset' },
      { icon: '👥', label: 'Groupes de 10 à 50 personnes' },
      { icon: '🗣️', label: 'Guide francophone natif' },
      { icon: '🛡️', label: 'Escorte sécuritaire officielle' },
    ],
    inclus: [
      { ico: '🚌', txt: 'Transport privé climatisé' },
      { ico: '🏨', txt: 'Hébergement 3★ + 1 nuit bivouac' },
      { ico: '🍽️', txt: 'Pension complète' },
      { ico: '🧭', txt: 'Guide francophone expert' },
      { ico: '🚔', txt: 'Escorte policière' },
      { ico: '💼', txt: 'Assurance voyage incluse' },
      { ico: '📸', txt: 'Séance photo coucher de soleil' },
      { ico: '🐪', txt: 'Balade dromadaire' },
    ],
    programme: [
      { j: 'J1', titre: 'Alger → Ghardaïa', desc: 'Vol interne ou bus VIP. Dîner de bienvenue et présentation du circuit.' },
      { j: 'J2', titre: 'Ghardaïa – Cité UNESCO', desc: 'Visite de la ville mozabite, souk historique et artisanat local.' },
      { j: 'J3', titre: 'Route vers le Grand Erg', desc: 'Traversée des paysages désertiques, arrêt aux oasis.' },
      { j: 'J4', titre: 'Dunes & Bivouac', desc: "Arrivée dans l'Erg, coucher de soleil en quad, nuit sous les étoiles." },
      { j: 'J5', titre: 'Lever de soleil & Oasis', desc: "Lever de soleil sur les dunes, visite d'une oasis secrète." },
      { j: 'J6', titre: 'Retour vers le Nord', desc: 'Route retour avec escale photographique.' },
      { j: 'J7', titre: 'Retour Alger', desc: 'Transfert aéroport, fin du circuit.' },
    ],
  },
  {
    title: "Ghardaïa & la Vallée du M'Zab",
    img: '/assets/gherdaia/ghardaia-Par-VisualEyze-min.jpg',
    cat: 'culture',
    dur: '5 jours / 4 nuits',
    desc: "Classée au patrimoine mondial de l'UNESCO, la vallée du M'Zab est un joyau architectural et culturel. Ses cinq ksours mozabites révèlent une civilisation millénaire d'une cohérence remarquable.",
    meta: [
      { icon: '📍', label: 'Départ: Alger → Ghardaïa' },
      { icon: '👥', label: 'Groupes de 8 à 40 personnes' },
      { icon: '🏛️', label: 'Site classé UNESCO' },
      { icon: '🎨', label: 'Ateliers artisanat inclus' },
    ],
    inclus: [
      { ico: '🚌', txt: 'Transport privé' },
      { ico: '🏨', txt: 'Hébergement 3★' },
      { ico: '🍽️', txt: "Demi-pension + 1 dîner chez l'habitant" },
      { ico: '🧭', txt: 'Guide local certifié UNESCO' },
      { ico: '🎨', txt: 'Atelier artisanat mozabite' },
      { ico: '🛡️', txt: 'Sécurité assurée' },
    ],
    programme: [
      { j: 'J1', titre: 'Alger → Ghardaïa', desc: 'Arrivée, installation hôtel, dîner de bienvenue.' },
      { j: 'J2', titre: "Ghardaïa & El-Atteuf", desc: "Visite du marché historique, ancien ksar d'El-Atteuf." },
      { j: 'J3', titre: 'Beni Isguen & Melika', desc: 'Cité sainte de Beni Isguen, vue panoramique de Melika.' },
      { j: 'J4', titre: 'Artisanat & Gastronomie', desc: 'Atelier tapis et bijoux, cours de cuisine locale.' },
      { j: 'J5', titre: 'Retour Alger', desc: 'Matinée libre, transfert aéroport.' },
    ],
  },
  {
    title: 'Grand Sahara Premium',
    img: '/assets/sahara/-1x-1.webp',
    cat: 'premium',
    dur: '10 jours / 9 nuits',
    desc: "Pour les voyageurs les plus exigeants : campements de luxe au cœur des dunes, activités exclusives en quad et en hélicoptère, dîner gastronomique servi dans l'Erg, et conciergerie personnelle 24h/24.",
    meta: [
      { icon: '📍', label: 'Alger → Tamanrasset → Grand Erg' },
      { icon: '👥', label: 'Groupes privés de 6 à 20 personnes' },
      { icon: '👑', label: 'Formule 5 étoiles exclusive' },
      { icon: '📱', label: 'Conciergerie 24h/24' },
    ],
    inclus: [
      { ico: '🚁', txt: 'Survol désert en hélicoptère' },
      { ico: '🏕️', txt: 'Campement luxe 5★ en Erg' },
      { ico: '🏎️', txt: 'Excursion quad privative' },
      { ico: '🍾', txt: 'Dîner gastronomique sur les dunes' },
      { ico: '🐪', txt: 'Safari dromadaire au lever du soleil' },
      { ico: '🛡️', txt: 'Escorte VIP permanente' },
      { ico: '📱', txt: 'Conciergerie dédiée' },
      { ico: '💼', txt: 'Assurance tous risques' },
    ],
    programme: [
      { j: 'J1-2', titre: 'Arrivée & Alger Prestige', desc: "Accueil VIP, hôtel 5★ Alger, dîner gastronomique." },
      { j: 'J3', titre: 'Vol vers Tamanrasset', desc: 'Vol privé, installation au lodge désert.' },
      { j: 'J4', titre: 'Assekrem & Hoggar', desc: "Lever de soleil sur l'Assekrem, paysages lunaires du Hoggar." },
      { j: 'J5-6', titre: 'Grand Erg Premium', desc: 'Arrivée au campement luxe, quad, coucher de soleil.' },
      { j: 'J7', titre: 'Dîner des Étoiles', desc: 'Soirée gastronomique en plein désert, astronomie.' },
      { j: 'J8', titre: 'Oasis Secrète', desc: 'Excursion exclusive vers une oasis préservée.' },
      { j: 'J9-10', titre: 'Retour & Fête', desc: 'Retour Alger, soirée de clôture, transfert aéroport.' },
    ],
  },
  {
    title: 'Algérie Découverte Complète',
    img: '/assets/sahara/algeria-desert-landscape-at-sunny-day-wallpaper-1920x540_70.jpg',
    cat: 'culture',
    dur: '14 jours / 13 nuits',
    desc: "Le grand circuit qui traverse l'Algérie du Nord au Sud : côte méditerranéenne, hauts plateaux, Sahara et oasis. 5 régions, 8 villes, des paysages d'une diversité exceptionnelle.",
    meta: [
      { icon: '📍', label: 'Alger → Oran → Constantine → Sahara' },
      { icon: '👥', label: 'Groupes de 15 à 60 personnes' },
      { icon: '🗺️', label: '5 régions traversées' },
      { icon: '✈️', label: 'Vols intérieurs inclus' },
    ],
    inclus: [
      { ico: '✈️', txt: 'Vols intérieurs inclus' },
      { ico: '🚌', txt: 'Bus VIP air conditionné' },
      { ico: '🏨', txt: 'Hôtels 3-4★ sélectionnés' },
      { ico: '🍽️', txt: 'Pension complète' },
      { ico: '🧭', txt: '2 guides régionaux' },
      { ico: '🎭', txt: 'Spectacles culturels chaque soir' },
      { ico: '📸', txt: 'Photographe professionnel 2 jours' },
      { ico: '💼', txt: 'Assurance tous risques' },
    ],
    programme: [
      { j: 'J1-3', titre: 'Alger & Côte', desc: "Casbah d'Alger, Tipaza romaine, côte méditerranéenne." },
      { j: 'J4-5', titre: 'Oran & Tlemcen', desc: 'Oran la belle, mosquées de Tlemcen, gastronomie oranaise.' },
      { j: 'J6-8', titre: 'Est & Constantine', desc: 'Pont de Constantine, Cirta antique, Djemila romaine.' },
      { j: 'J9-10', titre: 'Hauts Plateaux', desc: 'Timgad, Batna, paysages de steppe et chotts.' },
      { j: 'J11-13', titre: 'Grand Sud Saharien', desc: 'Ghardaïa, Grand Erg, bivouac, lever de soleil sur dunes.' },
      { j: 'J14', titre: 'Retour & Clôture', desc: "Cérémonie de clôture, transfert aéroport Alger." },
    ],
  },
  {
    title: 'Séminaire Corporate à Alger',
    img: '/assets/hotels/algiers-marriott-hotel.jpg',
    cat: 'corporate',
    dur: '4 jours / 3 nuits',
    desc: "Offrez à votre équipe un séminaire inoubliable dans le cadre exceptionnel d'Alger. Salles de conférence high-tech, team-building dans le désert, soirées de gala et immersion culturelle unique.",
    meta: [
      { icon: '📍', label: 'Alger – Hôtels 4-5★' },
      { icon: '👥', label: 'Groupes de 20 à 200 personnes' },
      { icon: '🏢', label: 'Entreprises & CE' },
      { icon: '📋', label: 'Devis personnalisé sous 24h' },
    ],
    inclus: [
      { ico: '🏢', txt: 'Hôtel business 4-5★' },
      { ico: '🖥️', txt: 'Salle de conférence équipée' },
      { ico: '🍽️', txt: "Repas d'affaires & dîner de gala" },
      { ico: '🤝', txt: 'Activité team-building désert' },
      { ico: '🏛️', txt: 'Visite culturelle Alger' },
      { ico: '🚌', txt: 'Transferts aéroport & navettes' },
    ],
    programme: [
      { j: 'J1', titre: 'Arrivée & Installation', desc: "Accueil à l'aéroport, transfert hôtel, dîner de bienvenue." },
      { j: 'J2', titre: 'Journée Séminaire', desc: "Sessions plénières, ateliers de travail, déjeuner d'affaires." },
      { j: 'J3', titre: 'Team-Building & Culture', desc: 'Activité désert en groupe, visite Casbah, dîner de gala.' },
      { j: 'J4', titre: 'Clôture & Départ', desc: 'Bilan et remise de certificats, transfert aéroport.' },
    ],
  },
  {
    title: 'Culture & Traditions Algériennes',
    img: '/assets/gherdaia/guided-tours-with-algerian.jpg',
    cat: 'culture',
    dur: '6 jours / 5 nuits',
    desc: "Une immersion profonde dans le patrimoine vivant de l'Algérie : de la musique andalouse d'Alger aux danses berbères de Ghardaïa, en passant par les secrets de la cuisine kabyle.",
    meta: [
      { icon: '📍', label: 'Alger → Tizi-Ouzou → Ghardaïa' },
      { icon: '👥', label: 'Groupes de 10 à 35 personnes' },
      { icon: '🎭', label: 'Spectacles culturels chaque soir' },
      { icon: '🤝', label: 'Rencontres avec artisans locaux' },
    ],
    inclus: [
      { ico: '🎵', txt: 'Concert musique andalouse' },
      { ico: '🍲', txt: 'Cours de cuisine berbère' },
      { ico: '🧶', txt: 'Atelier tapis traditionnel' },
      { ico: '🏨', txt: "Maisons d'hôtes authentiques" },
      { ico: '🧭', txt: 'Guides locaux passionnés' },
      { ico: '🎭', txt: 'Soirée culturelle chaque soir' },
    ],
    programme: [
      { j: 'J1', titre: 'Alger – Casbah & Musique', desc: "Visite de la Casbah classée UNESCO, soirée concert andalou." },
      { j: 'J2', titre: 'Kabylie & Artisanat', desc: 'Tizi-Ouzou, bijoux kabyles, démonstration poterie.' },
      { j: 'J3', titre: 'Villages berbères', desc: "Randonnée en village montagnard, déjeuner chez l'habitant." },
      { j: 'J4', titre: 'Cours de Cuisine', desc: 'Atelier couscous et tajine berbère, marché du village.' },
      { j: "J5", titre: "Ghardaïa & M'Zab", desc: 'Cité mozabite, souk historique, soirée musicale gnaoua.' },
      { j: 'J6', titre: 'Retour & Souvenirs', desc: 'Shopping artisanat, transfert aéroport.' },
    ],
  },
]

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

export default function OffresPage() {
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

  const detail = detailIdx !== null ? offers[detailIdx] : null

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
                key={offer.title}
                className={`offer-card reveal${offer.cat === 'premium' ? ' featured' : ''}`}
                style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
              >
                <div className="offer-img">
                  <Image src={offer.img} alt={offer.title} width={400} height={240} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="offer-cat">{catDisplayLabels[offer.cat]}</span>
                  {offer.cat === 'sahara' && <span className="offer-status status-hot">Populaire</span>}
                  {offer.title === "Ghardaïa & la Vallée du M'Zab" && <span className="offer-status status-new">Nouveau</span>}
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
                      <button className="offer-detail" onClick={() => setDetailIdx(offers.indexOf(offer))}>Détails</button>
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
        <div className={`modal-overlay open`} onClick={() => setDetailIdx(null)}>
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
                    <option>Sahara Classique</option>
                    <option>Ghardaïa UNESCO</option>
                    <option>Grand Sahara Premium</option>
                    <option>Algérie Découverte Complète</option>
                    <option>Séminaire Corporate</option>
                    <option>Culture &amp; Traditions</option>
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
