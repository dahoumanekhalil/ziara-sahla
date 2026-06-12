'use client'
import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useUI } from '@/context/UIContext'
import { useLang } from '@/context/LangContext'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function QuoteModal() {
  const pathname = usePathname()
  const { isModalOpen, closeModal } = useUI()
  const { tr } = useLang()
  const m = tr.modal
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  if (pathname.startsWith('/admin')) return null

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending' || status === 'success') return
    setStatus('sending')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    const body = {
      prenom:  fd.get('prenom')  as string,
      nom:     fd.get('nom')     as string,
      email:   fd.get('email')   as string,
      tel:     fd.get('tel')     as string,
      groupe:  fd.get('groupe')  as string,
      formule: fd.get('formule') as string,
      msg:     fd.get('msg')     as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setStatus('success')
        setTimeout(() => {
          closeModal()
          setStatus('idle')
          formRef.current?.reset()
        }, 3400)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error ?? 'Une erreur est survenue.')
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
      }
    } catch {
      setErrorMsg('Erreur réseau — vérifiez votre connexion.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const sending  = status === 'sending'
  const success  = status === 'success'
  const error    = status === 'error'

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

        {/* Success state overlay */}
        {success && (
          <div style={{ textAlign: 'center', padding: '32px 0 16px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#4CAF50,#2E7D32)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 28 }}>✓</div>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--ink)', margin: '0 0 8px' }}>{m.successMsg}</p>
            <p style={{ fontSize: '.88rem', color: 'var(--muted)', margin: 0 }}>Un email de confirmation vient de vous être envoyé.</p>
          </div>
        )}

        {/* Form */}
        <form
          id="quote-form"
          ref={formRef}
          onSubmit={submitForm}
          style={{ display: success ? 'none' : undefined }}
        >
          <div className="fg-row">
            <div className="fg">
              <label htmlFor="qm-prenom">{m.firstName}</label>
              <input type="text" id="qm-prenom" name="prenom" placeholder="Marie" required disabled={sending} />
            </div>
            <div className="fg">
              <label htmlFor="qm-nom">{m.lastName}</label>
              <input type="text" id="qm-nom" name="nom" placeholder="Dupont" required disabled={sending} />
            </div>
          </div>
          <div className="fg">
            <label htmlFor="qm-email">{m.email}</label>
            <input type="email" id="qm-email" name="email" placeholder="marie@exemple.com" required disabled={sending} />
          </div>
          <div className="fg">
            <label htmlFor="qm-tel">{m.phone}</label>
            <input type="tel" id="qm-tel" name="tel" placeholder="+33 6 12 34 56 78" disabled={sending} />
          </div>
          <div className="fg-row">
            <div className="fg">
              <label htmlFor="qm-groupe">{m.groupSize}</label>
              <select id="qm-groupe" name="groupe" required disabled={sending}>
                {m.groupOptions.map((opt, i) => (
                  <option key={i} value={i === 0 ? '' : opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="fg">
              <label htmlFor="qm-formule">{m.formula}</label>
              <select id="qm-formule" name="formule" disabled={sending}>
                {m.formulaOptions.map((opt, i) => (
                  <option key={i} value={i === 0 ? '' : opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="fg">
            <label htmlFor="qm-msg">{m.project}</label>
            <textarea id="qm-msg" name="msg" placeholder={m.projectPlaceholder} disabled={sending} />
          </div>

          {/* Error message */}
          {error && errorMsg && (
            <p style={{ margin: '0 0 12px', fontSize: '.84rem', color: '#c62828', background: 'rgba(198,40,40,.07)', border: '1px solid rgba(198,40,40,.25)', borderRadius: 8, padding: '10px 14px' }}>
              ⚠️ {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="form-submit"
            disabled={sending}
            style={error ? { background: '#c62828' } : undefined}
          >
            {sending ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span className="send-spinner" />
                Envoi en cours…
              </span>
            ) : error ? 'Réessayer' : m.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
