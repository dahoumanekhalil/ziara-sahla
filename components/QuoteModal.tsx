'use client'
import { useState } from 'react'
import { useUI } from '@/context/UIContext'
import { useLang } from '@/context/LangContext'

export default function QuoteModal() {
  const { isModalOpen, closeModal } = useUI()
  const { tr } = useLang()
  const m = tr.modal
  const [submitted, setSubmitted] = useState(false)

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const btn = e.currentTarget.querySelector('.form-submit') as HTMLButtonElement
    btn.textContent = m.successMsg
    btn.style.background = '#2E7D32'
    btn.disabled = true
    setSubmitted(true)
    setTimeout(() => {
      closeModal()
      setSubmitted(false)
      btn.textContent = m.submit
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
        <button className="modal-x" onClick={closeModal} aria-label="Close">✕</button>
        <h2 id="modal-title">{m.title}</h2>
        <p className="sub">{m.sub}</p>
        <form id="quote-form" onSubmit={submitForm}>
          <div className="fg-row">
            <div className="fg"><label htmlFor="qm-prenom">{m.firstName}</label><input type="text" id="qm-prenom" name="prenom" placeholder="Marie" required /></div>
            <div className="fg"><label htmlFor="qm-nom">{m.lastName}</label><input type="text" id="qm-nom" name="nom" placeholder="Dupont" required /></div>
          </div>
          <div className="fg"><label htmlFor="qm-email">{m.email}</label><input type="email" id="qm-email" name="email" placeholder="marie@exemple.com" required /></div>
          <div className="fg"><label htmlFor="qm-tel">{m.phone}</label><input type="tel" id="qm-tel" name="tel" placeholder="+33 6 12 34 56 78" /></div>
          <div className="fg-row">
            <div className="fg">
              <label htmlFor="qm-groupe">{m.groupSize}</label>
              <select id="qm-groupe" name="groupe" required>
                {m.groupOptions.map((opt, i) => <option key={i} value={i === 0 ? '' : opt}>{opt}</option>)}
              </select>
            </div>
            <div className="fg">
              <label htmlFor="qm-formule">{m.formula}</label>
              <select id="qm-formule" name="formule">
                {m.formulaOptions.map((opt, i) => <option key={i} value={i === 0 ? '' : opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="fg"><label htmlFor="qm-msg">{m.project}</label><textarea id="qm-msg" name="msg" placeholder={m.projectPlaceholder}></textarea></div>
          <button type="submit" className="form-submit" disabled={submitted}>{m.submit}</button>
        </form>
      </div>
    </div>
  )
}
