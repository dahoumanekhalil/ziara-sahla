'use client'
import { useState } from 'react'
import { useUI } from '@/context/UIContext'

export default function QuoteModal() {
  const { isModalOpen, closeModal } = useUI()
  const [submitted, setSubmitted] = useState(false)

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = '✓ Demande envoyée ! On vous contacte bientôt.'
    btn.style.background = '#2E7D32'
    btn.disabled = true
    setSubmitted(true)
    setTimeout(() => {
      closeModal()
      setSubmitted(false)
      btn.textContent = 'Envoyer ma demande →'
      btn.style.background = ''
      btn.disabled = false
      ;(e.currentTarget as HTMLFormElement)?.reset()
    }, 3200)
  }

  return (
    <div
      className={`modal-overlay${isModalOpen ? ' open' : ''}`}
      id="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div className="modal">
        <button className="modal-x" onClick={closeModal} aria-label="Fermer">✕</button>
        <h2 id="modal-title">Demande de devis</h2>
        <p className="sub">Remplissez ce formulaire et notre équipe vous contacte sous 24h avec une proposition personnalisée.</p>
        <form id="quote-form" onSubmit={submitForm}>
          <div className="fg-row">
            <div className="fg"><label htmlFor="prenom">Prénom *</label><input type="text" id="prenom" name="prenom" placeholder="Marie" required /></div>
            <div className="fg"><label htmlFor="nom">Nom *</label><input type="text" id="nom" name="nom" placeholder="Dupont" required /></div>
          </div>
          <div className="fg"><label htmlFor="email">Email *</label><input type="email" id="email" name="email" placeholder="marie@exemple.com" required /></div>
          <div className="fg"><label htmlFor="tel">Téléphone</label><input type="tel" id="tel" name="tel" placeholder="+33 6 12 34 56 78" /></div>
          <div className="fg-row">
            <div className="fg">
              <label htmlFor="groupe">Taille du groupe *</label>
              <select id="groupe" name="groupe" required>
                <option value="">Choisir...</option>
                <option>10 – 20 personnes</option>
                <option>20 – 40 personnes</option>
                <option>40 – 80 personnes</option>
                <option>80+ personnes</option>
              </select>
            </div>
            <div className="fg">
              <label htmlFor="formule">Formule souhaitée</label>
              <select id="formule" name="formule">
                <option value="">Choisir...</option>
                <option>Économique</option>
                <option>Intermédiaire</option>
                <option>Premium</option>
                <option>Sur mesure</option>
              </select>
            </div>
          </div>
          <div className="fg"><label htmlFor="msg">Votre projet</label><textarea id="msg" name="msg" placeholder="Destination souhaitée, dates, besoins particuliers..."></textarea></div>
          <button type="submit" className="form-submit">Envoyer ma demande →</button>
        </form>
      </div>
    </div>
  )
}
