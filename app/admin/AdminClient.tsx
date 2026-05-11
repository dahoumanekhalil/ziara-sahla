'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Offer } from '@/lib/types'

const CATS = ['sahara', 'culture', 'premium', 'corporate']

const emptyForm = () => ({
  title: '',
  img: '',
  cat: 'sahara',
  dur: '',
  desc: '',
  meta: [{ icon: '📍', label: '' }],
  inclus: [{ ico: '✅', txt: '' }],
  programme: [{ j: 'J1', titre: '', desc: '' }],
})

export default function AdminClient({ initialOffers }: { initialOffers: Offer[] }) {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'list' | 'add'>('list')

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  function setField(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setMeta(i: number, key: 'icon' | 'label', value: string) {
    setForm(f => {
      const meta = [...f.meta]
      meta[i] = { ...meta[i], [key]: value }
      return { ...f, meta }
    })
  }

  function setInclus(i: number, key: 'ico' | 'txt', value: string) {
    setForm(f => {
      const inclus = [...f.inclus]
      inclus[i] = { ...inclus[i], [key]: value }
      return { ...f, inclus }
    })
  }

  function setProg(i: number, key: 'j' | 'titre' | 'desc', value: string) {
    setForm(f => {
      const programme = [...f.programme]
      programme[i] = { ...programme[i], [key]: value }
      return { ...f, programme }
    })
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const newOffer = await res.json()
        setOffers(o => [...o, newOffer])
        setForm(emptyForm())
        setMsg('Offre ajoutée avec succès !')
        setTab('list')
      } else {
        const data = await res.json()
        setMsg(data.error ?? 'Erreur lors de l\'ajout')
      }
    } catch {
      setMsg('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Supprimer "${title}" ?`)) return
    const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setOffers(o => o.filter(x => x.id !== id))
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      {/* Header */}
      <header style={{ background: '#1a1f2e', borderBottom: '1px solid #2d3748', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🧭</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Ziara-Sahla</span>
            <span style={{ color: '#475569', fontSize: '.85rem' }}>/ Admin</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="/offres" target="_blank" style={{ fontSize: '.8rem', color: '#64748b', padding: '6px 12px', border: '1px solid #2d3748', borderRadius: 8 }}>
              Voir le site ↗
            </a>
            <button onClick={logout} style={{ fontSize: '.8rem', color: '#f87171', background: 'none', border: '1px solid rgba(248,113,113,.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#1a1f2e', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {(['list', 'add'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg('') }}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem', background: tab === t ? '#E07B39' : 'transparent', color: tab === t ? '#fff' : '#94a3b8', transition: 'all .2s' }}
            >
              {t === 'list' ? `Offres (${offers.length})` : '+ Ajouter une offre'}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{ background: msg.includes('succès') ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${msg.includes('succès') ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: msg.includes('succès') ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
            {msg}
          </div>
        )}

        {/* Offers list */}
        {tab === 'list' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {offers.map(o => (
              <div key={o.id} style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{o.title}</span>
                    <span style={{ fontSize: '.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 100, background: catColor(o.cat), color: '#fff', textTransform: 'uppercase', letterSpacing: '.06em' }}>{o.cat}</span>
                  </div>
                  <div style={{ fontSize: '.8rem', color: '#64748b' }}>{o.dur} · {o.inclus.length} inclusions · {o.programme.length} jours</div>
                </div>
                <button
                  onClick={() => handleDelete(o.id, o.title)}
                  style={{ padding: '7px 16px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, color: '#f87171', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                >
                  Supprimer
                </button>
              </div>
            ))}
            {offers.length === 0 && (
              <p style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>Aucune offre. Ajoutez-en une !</p>
            )}
          </div>
        )}

        {/* Add form */}
        {tab === 'add' && (
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: 28 }}>
            {/* Basic info */}
            <section style={sectionStyle}>
              <h2 style={sectionTitle}>Informations générales</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Titre *</Label>
                  <Input value={form.title} onChange={v => setField('title', v)} placeholder="Sahara Classique" required />
                </div>
                <div>
                  <Label>Catégorie *</Label>
                  <select value={form.cat} onChange={e => setField('cat', e.target.value)} style={{ ...inputBase, width: '100%' }}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Durée *</Label>
                  <Input value={form.dur} onChange={v => setField('dur', v)} placeholder="7 jours / 6 nuits" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Image (chemin ou URL) *</Label>
                  <Input value={form.img} onChange={v => setField('img', v)} placeholder="/assets/sahara/photo.jpg" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>Description *</Label>
                  <textarea
                    value={form.desc}
                    onChange={e => setField('desc', e.target.value)}
                    required
                    rows={4}
                    placeholder="Description du circuit…"
                    style={{ ...inputBase, width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            </section>

            {/* Meta */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>Informations clés</h2>
                <AddBtn onClick={() => setForm(f => ({ ...f, meta: [...f.meta, { icon: '📍', label: '' }] }))}>+ Ajouter</AddBtn>
              </div>
              {form.meta.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <Input value={m.icon} onChange={v => setMeta(i, 'icon', v)} placeholder="📍" style={{ width: 70, flexShrink: 0 }} />
                  <Input value={m.label} onChange={v => setMeta(i, 'label', v)} placeholder="Départ: Alger → Ghardaïa" style={{ flex: 1 }} />
                  {form.meta.length > 1 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, meta: f.meta.filter((_, j) => j !== i) }))} />
                  )}
                </div>
              ))}
            </section>

            {/* Inclus */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>Ce qui est inclus</h2>
                <AddBtn onClick={() => setForm(f => ({ ...f, inclus: [...f.inclus, { ico: '✅', txt: '' }] }))}>+ Ajouter</AddBtn>
              </div>
              {form.inclus.map((inc, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <Input value={inc.ico} onChange={v => setInclus(i, 'ico', v)} placeholder="🚌" style={{ width: 70, flexShrink: 0 }} />
                  <Input value={inc.txt} onChange={v => setInclus(i, 'txt', v)} placeholder="Transport privé climatisé" style={{ flex: 1 }} />
                  {form.inclus.length > 1 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, inclus: f.inclus.filter((_, j) => j !== i) }))} />
                  )}
                </div>
              ))}
            </section>

            {/* Programme */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>Programme jour par jour</h2>
                <AddBtn onClick={() => {
                  const next = form.programme.length + 1
                  setForm(f => ({ ...f, programme: [...f.programme, { j: `J${next}`, titre: '', desc: '' }] }))
                }}>+ Ajouter</AddBtn>
              </div>
              {form.programme.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <Input value={p.j} onChange={v => setProg(i, 'j', v)} placeholder="J1" style={{ width: 70, flexShrink: 0 }} />
                  <Input value={p.titre} onChange={v => setProg(i, 'titre', v)} placeholder="Titre du jour" style={{ flex: 1 }} />
                  <Input value={p.desc} onChange={v => setProg(i, 'desc', v)} placeholder="Description de la journée…" style={{ flex: 2 }} />
                  {form.programme.length > 1 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, programme: f.programme.filter((_, j) => j !== i) }))} />
                  )}
                </div>
              ))}
            </section>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: '13px 32px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}
              >
                {saving ? 'Enregistrement…' : 'Ajouter l\'offre'}
              </button>
              <button
                type="button"
                onClick={() => { setForm(emptyForm()); setMsg('') }}
                style={{ padding: '13px 24px', background: 'transparent', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}
              >
                Réinitialiser
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function catColor(cat: string) {
  const map: Record<string, string> = { sahara: '#b45309', culture: '#1d4ed8', premium: '#7c3aed', corporate: '#065f46' }
  return map[cat] ?? '#374151'
}

const inputBase: React.CSSProperties = {
  background: '#0f1117',
  border: '1px solid #2d3748',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: '.9rem',
  padding: '9px 12px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
}

const sectionStyle: React.CSSProperties = {
  background: '#1a1f2e',
  border: '1px solid #2d3748',
  borderRadius: 12,
  padding: '24px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '.95rem',
  fontWeight: 700,
  color: '#e2e8f0',
  marginBottom: 0,
  fontFamily: 'Inter, sans-serif',
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, letterSpacing: '.05em', textTransform: 'uppercase' }}>{children}</label>
}

function Input({ value, onChange, placeholder, required, style }: { value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; style?: React.CSSProperties }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{ ...inputBase, width: '100%', ...style }}
    />
  )
}

function AddBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ fontSize: '.8rem', fontWeight: 600, color: '#E07B39', background: 'rgba(224,123,57,.1)', border: '1px solid rgba(224,123,57,.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>
      {children}
    </button>
  )
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ flexShrink: 0, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: '1rem' }}>
      ×
    </button>
  )
}
