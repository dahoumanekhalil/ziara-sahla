'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Offer, MLString } from '@/lib/types'
import type { GalleryImage } from '@/lib/gallery'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/context/LangContext'

const CATS = ['sahara', 'culture', 'premium', 'corporate']
const GALLERY_CATS = ['sahara', 'ghardaia', 'hotels', 'culture', 'autre']
const FORM_LANGS: { key: Lang; flag: string; label: string }[] = [
  { key: 'fr', flag: '🇫🇷', label: 'Français' },
  { key: 'en', flag: '🇬🇧', label: 'English' },
  { key: 'ar', flag: '🇩🇿', label: 'العربية' },
]
const UI_LANGS: { key: Lang; label: string }[] = [
  { key: 'fr', label: 'FR' },
  { key: 'en', label: 'EN' },
  { key: 'ar', label: 'AR' },
]

const emptyML = (): MLString => ({ fr: '', en: '', ar: '' })

const emptyForm = () => ({
  img: '',
  cat: 'sahara',
  title: emptyML(),
  dur: emptyML(),
  desc: emptyML(),
  meta: [{ icon: '📍', label: emptyML() }],
  inclus: [{ ico: '✅', txt: emptyML() }],
  programme: [{ j: 'J1', titre: emptyML(), desc: emptyML() }],
})

const emptyGalleryForm = () => ({
  src: '',
  alt: '',
  label: '',
  category: 'sahara',
})

export default function AdminClient({
  initialOffers,
  initialGallery,
}: {
  initialOffers: Offer[]
  initialGallery: GalleryImage[]
}) {
  const router = useRouter()
  const { tr, lang, setLang } = useLang()
  const a = tr.admin

  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery)
  const [form, setForm] = useState(emptyForm())
  const [formLang, setFormLang] = useState<Lang>('fr')
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)
  const [galleryMsg, setGalleryMsg] = useState('')
  const [galleryMsgOk, setGalleryMsgOk] = useState(false)
  const [tab, setTab] = useState<'list' | 'add' | 'gallery'>('list')
  const [galleryCatFilter, setGalleryCatFilter] = useState<string>('all')
  const [showAddImage, setShowAddImage] = useState(false)
  const [imgMode, setImgMode] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  function setMLField(key: 'title' | 'dur' | 'desc', value: string) {
    setForm(f => ({ ...f, [key]: { ...f[key], [formLang]: value } }))
  }

  function setPlainField(key: 'img' | 'cat', value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setMeta(i: number, key: 'icon' | 'label', value: string) {
    setForm(f => {
      const meta = [...f.meta]
      if (key === 'icon') {
        meta[i] = { ...meta[i], icon: value }
      } else {
        meta[i] = { ...meta[i], label: { ...meta[i].label, [formLang]: value } }
      }
      return { ...f, meta }
    })
  }

  function setInclus(i: number, key: 'ico' | 'txt', value: string) {
    setForm(f => {
      const inclus = [...f.inclus]
      if (key === 'ico') {
        inclus[i] = { ...inclus[i], ico: value }
      } else {
        inclus[i] = { ...inclus[i], txt: { ...inclus[i].txt, [formLang]: value } }
      }
      return { ...f, inclus }
    })
  }

  function setProg(i: number, key: 'j' | 'titre' | 'desc', value: string) {
    setForm(f => {
      const programme = [...f.programme]
      if (key === 'j') {
        programme[i] = { ...programme[i], j: value }
      } else {
        programme[i] = { ...programme[i], [key]: { ...programme[i][key], [formLang]: value } }
      }
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
        setMsg(a.offerAdded)
        setMsgOk(true)
        setTab('list')
      } else {
        const data = await res.json()
        setMsg(data.error ?? a.addError)
        setMsgOk(false)
      }
    } catch {
      setMsg(a.networkError)
      setMsgOk(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: MLString) {
    if (!confirm(`${a.confirmDelete} "${title.fr}" ?`)) return
    const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
    if (res.ok) setOffers(o => o.filter(x => x.id !== id))
  }

  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setGalleryMsg('')
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm),
      })
      if (res.ok) {
        const newImg = await res.json()
        setGallery(g => [...g, newImg])
        setGalleryForm(emptyGalleryForm())
        setGalleryMsg(a.imgAdded)
        setGalleryMsgOk(true)
        setShowAddImage(false)
      } else {
        const data = await res.json()
        setGalleryMsg(data.error ?? a.imgError)
        setGalleryMsgOk(false)
      }
    } catch {
      setGalleryMsg(a.networkError)
      setGalleryMsgOk(false)
    } finally {
      setSaving(false)
    }
  }

  async function uploadFile(file: File) {
    setUploading(true)
    setGalleryMsg('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/gallery/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setGalleryForm(f => ({ ...f, src: data.src }))
      } else {
        setGalleryMsg(data.error ?? a.uploadError)
        setGalleryMsgOk(false)
      }
    } catch {
      setGalleryMsg(a.networkError)
      setGalleryMsgOk(false)
    } finally {
      setUploading(false)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  async function handleDeleteImage(id: string) {
    if (!confirm(a.confirmDeleteImg)) return
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (res.ok) setGallery(g => g.filter(x => x.id !== id))
  }

  const filteredGallery = galleryCatFilter === 'all'
    ? gallery
    : gallery.filter(img => img.category === galleryCatFilter)

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      {/* Header */}
      <header style={{ background: '#1a1f2e', borderBottom: '1px solid #2d3748', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image src="/assets/logo/logo.png" alt="Ziara-Sahla" width={32} height={32} style={{ borderRadius: '50%' }} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Ziara-Sahla</span>
            <span style={{ color: '#475569', fontSize: '.85rem' }}>/ Admin</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {UI_LANGS.map(l => (
                <button key={l.key} onClick={() => setLang(l.key)} style={{ fontSize: '.72rem', fontWeight: 700, padding: '4px 9px', borderRadius: 6, border: `1px solid ${lang === l.key ? '#E07B39' : '#2d3748'}`, background: lang === l.key ? 'rgba(224,123,57,.15)' : 'transparent', color: lang === l.key ? '#E07B39' : '#64748b', cursor: 'pointer', transition: 'all .15s' }}>
                  {l.label}
                </button>
              ))}
            </div>
            <a href="/offres" target="_blank" style={{ fontSize: '.8rem', color: '#64748b', padding: '6px 12px', border: '1px solid #2d3748', borderRadius: 8 }}>{a.viewSite}</a>
            <button onClick={logout} style={{ fontSize: '.8rem', color: '#f87171', background: 'none', border: '1px solid rgba(248,113,113,.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>{a.logout}</button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#1a1f2e', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {(['list', 'add', 'gallery'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg(''); setGalleryMsg('') }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem', background: tab === t ? '#E07B39' : 'transparent', color: tab === t ? '#fff' : '#94a3b8', transition: 'all .2s' }}>
              {t === 'list' ? `${a.tabOffersPrefix} (${offers.length})` : t === 'add' ? a.tabAdd : `${a.tabGalleryPrefix} (${gallery.length})`}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{ background: msgOk ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${msgOk ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: msgOk ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
            {msg}
          </div>
        )}

        {/* ── Offers list ── */}
        {tab === 'list' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {offers.map(o => (
              <div key={o.id} style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{o.title?.fr ?? o.title as unknown as string}</span>
                    <span style={{ fontSize: '.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 100, background: catColor(o.cat), color: '#fff', textTransform: 'uppercase', letterSpacing: '.06em' }}>{o.cat}</span>
                  </div>
                  <div style={{ fontSize: '.8rem', color: '#64748b' }}>{o.dur?.fr ?? o.dur as unknown as string} · {o.inclus.length} {a.inclusions} · {o.programme.length} {a.days}</div>
                </div>
                <button onClick={() => handleDelete(o.id, o.title)} style={{ padding: '7px 16px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, color: '#f87171', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  {a.deleteBtn}
                </button>
              </div>
            ))}
            {offers.length === 0 && <p style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>{a.noOffers}</p>}
          </div>
        )}

        {/* ── Add offer form ── */}
        {tab === 'add' && (
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: 28 }}>

            {/* Language selector for form content */}
            <div style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, padding: '18px 24px' }}>
              <p style={{ fontSize: '.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Langue du contenu
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {FORM_LANGS.map(l => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setFormLang(l.key)}
                    style={{
                      padding: '9px 20px',
                      borderRadius: 8,
                      border: `2px solid ${formLang === l.key ? '#E07B39' : '#2d3748'}`,
                      background: formLang === l.key ? 'rgba(224,123,57,.12)' : 'transparent',
                      color: formLang === l.key ? '#E07B39' : '#64748b',
                      fontWeight: 700,
                      fontSize: '.875rem',
                      cursor: 'pointer',
                      transition: 'all .15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    {/* completion dots */}
                    {['title', 'desc', 'dur'].every(k => (form as Record<string, MLString>)[k][l.key]) && (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    )}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '.72rem', color: '#475569', marginTop: 10 }}>
                🟢 dot appears when FR / EN / AR content is filled for the current language
              </p>
            </div>

            {/* General info */}
            <section style={sectionStyle}>
              <h2 style={sectionTitle}>{a.sectionGeneral}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>{a.fieldTitle} <LangBadge lang={formLang} /></Label>
                  <Input
                    value={form.title[formLang]}
                    onChange={v => setMLField('title', v)}
                    placeholder={formLang === 'fr' ? 'Sahara Classique' : formLang === 'en' ? 'Classic Sahara' : 'الصحراء الكلاسيكية'}
                    required={formLang === 'fr'}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div>
                  <Label>{a.fieldCat}</Label>
                  <select value={form.cat} onChange={e => setPlainField('cat', e.target.value)} style={{ ...inputBase, width: '100%' }}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <Label>{a.fieldDur} <LangBadge lang={formLang} /></Label>
                  <Input
                    value={form.dur[formLang]}
                    onChange={v => setMLField('dur', v)}
                    placeholder={formLang === 'fr' ? '7 jours / 6 nuits' : formLang === 'en' ? '7 days / 6 nights' : '٧ أيام / ٦ ليالٍ'}
                    required={formLang === 'fr'}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>{a.fieldImg}</Label>
                  <Input value={form.img} onChange={v => setPlainField('img', v)} placeholder="/assets/sahara/photo.jpg" required />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>{a.fieldDesc} <LangBadge lang={formLang} /></Label>
                  <textarea
                    value={form.desc[formLang]}
                    onChange={e => setMLField('desc', e.target.value)}
                    required={formLang === 'fr'}
                    rows={4}
                    placeholder={a.descPlaceholder}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                    style={{ ...inputBase, width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            </section>

            {/* Key info */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>{a.sectionMeta}</h2>
                <AddBtn onClick={() => setForm(f => ({ ...f, meta: [...f.meta, { icon: '📍', label: emptyML() }] }))}>{a.addBtn}</AddBtn>
              </div>
              {form.meta.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <Input value={m.icon} onChange={v => setMeta(i, 'icon', v)} placeholder="📍" style={{ width: 70, flexShrink: 0 }} />
                  <Input
                    value={m.label[formLang]}
                    onChange={v => setMeta(i, 'label', v)}
                    placeholder={formLang === 'fr' ? 'Départ: Alger → Ghardaïa' : formLang === 'en' ? 'Departure: Algiers → Ghardaïa' : 'المغادرة: الجزائر → غرداية'}
                    style={{ flex: 1 }}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {form.meta.length > 1 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, meta: f.meta.filter((_, j) => j !== i) }))} />
                  )}
                </div>
              ))}
            </section>

            {/* Inclusions */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>{a.sectionInclus}</h2>
                <AddBtn onClick={() => setForm(f => ({ ...f, inclus: [...f.inclus, { ico: '✅', txt: emptyML() }] }))}>{a.addBtn}</AddBtn>
              </div>
              {form.inclus.map((inc, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <Input value={inc.ico} onChange={v => setInclus(i, 'ico', v)} placeholder="🚌" style={{ width: 70, flexShrink: 0 }} />
                  <Input
                    value={inc.txt[formLang]}
                    onChange={v => setInclus(i, 'txt', v)}
                    placeholder={formLang === 'fr' ? 'Transport privé climatisé' : formLang === 'en' ? 'Private air-conditioned transport' : 'نقل خاص مكيف'}
                    style={{ flex: 1 }}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {form.inclus.length > 1 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, inclus: f.inclus.filter((_, j) => j !== i) }))} />
                  )}
                </div>
              ))}
            </section>

            {/* Programme */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>{a.sectionProg}</h2>
                <AddBtn onClick={() => {
                  const next = form.programme.length + 1
                  setForm(f => ({ ...f, programme: [...f.programme, { j: `J${next}`, titre: emptyML(), desc: emptyML() }] }))
                }}>{a.addBtn}</AddBtn>
              </div>
              {form.programme.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <Input value={p.j} onChange={v => setProg(i, 'j', v)} placeholder="J1" style={{ width: 70, flexShrink: 0 }} />
                  <Input
                    value={p.titre[formLang]}
                    onChange={v => setProg(i, 'titre', v)}
                    placeholder={formLang === 'ar' ? 'عنوان اليوم' : a.dayTitlePlaceholder}
                    style={{ flex: 1 }}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <Input
                    value={p.desc[formLang]}
                    onChange={v => setProg(i, 'desc', v)}
                    placeholder={formLang === 'ar' ? 'وصف اليوم…' : a.dayDescPlaceholder}
                    style={{ flex: 2 }}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {form.programme.length > 1 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, programme: f.programme.filter((_, j) => j !== i) }))} />
                  )}
                </div>
              ))}
            </section>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={saving} style={{ padding: '13px 32px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
                {saving ? a.saving : a.submitOffer}
              </button>
              <button type="button" onClick={() => { setForm(emptyForm()); setMsg('') }} style={{ padding: '13px 24px', background: 'transparent', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
                {a.resetBtn}
              </button>
            </div>
          </form>
        )}

        {/* ── Gallery tab ── */}
        {tab === 'gallery' && (
          <div>
            {galleryMsg && (
              <div style={{ background: galleryMsgOk ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${galleryMsgOk ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: galleryMsgOk ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
                {galleryMsg}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', ...GALLERY_CATS].map(cat => (
                  <button key={cat} onClick={() => setGalleryCatFilter(cat)} style={{ padding: '5px 14px', borderRadius: 100, border: `1px solid ${galleryCatFilter === cat ? '#E07B39' : '#2d3748'}`, cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, background: galleryCatFilter === cat ? '#E07B39' : '#1a1f2e', color: galleryCatFilter === cat ? '#fff' : '#94a3b8', transition: 'all .2s' }}>
                    {cat === 'all' ? `${a.allCatPrefix} (${gallery.length})` : `${galleryEmoji(cat)} ${cat} (${gallery.filter(g => g.category === cat).length})`}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddImage(v => !v)} style={{ padding: '8px 18px', background: showAddImage ? 'rgba(224,123,57,.15)' : '#E07B39', color: showAddImage ? '#E07B39' : '#fff', border: `1px solid ${showAddImage ? 'rgba(224,123,57,.4)' : '#E07B39'}`, borderRadius: 8, fontWeight: 700, fontSize: '.875rem', cursor: 'pointer', transition: 'all .2s' }}>
                {showAddImage ? a.cancelBtn : a.addImageBtn}
              </button>
            </div>

            {showAddImage && (
              <form onSubmit={handleAddImage} style={{ ...sectionStyle, marginBottom: 24 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 20 }}>{a.newImageTitle}</h2>
                <div style={{ display: 'flex', gap: 0, marginBottom: 18, background: '#0f1117', borderRadius: 8, padding: 3, width: 'fit-content' }}>
                  {(['url', 'upload'] as const).map(mode => (
                    <button key={mode} type="button" onClick={() => { setImgMode(mode); setGalleryForm(f => ({ ...f, src: '' })) }} style={{ padding: '7px 18px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', background: imgMode === mode ? '#E07B39' : 'transparent', color: imgMode === mode ? '#fff' : '#64748b', transition: 'all .18s' }}>
                      {mode === 'url' ? a.urlMode : a.uploadMode}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    {imgMode === 'url' && (
                      <>
                        <Label>{a.imgUrlLabel}</Label>
                        <Input value={galleryForm.src} onChange={v => setGalleryForm(f => ({ ...f, src: v }))} placeholder="https://example.com/photo.jpg" required />
                      </>
                    )}
                    {imgMode === 'upload' && (
                      <>
                        <Label>{a.fileLabel}</Label>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
                        <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => !uploading && fileInputRef.current?.click()} style={{ border: `2px dashed ${dragOver ? '#E07B39' : galleryForm.src ? 'rgba(34,197,94,.5)' : '#2d3748'}`, borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', background: dragOver ? 'rgba(224,123,57,.06)' : '#0f1117', transition: 'all .2s' }}>
                          {uploading ? (
                            <div style={{ color: '#94a3b8', fontSize: '.88rem' }}><span style={{ display: 'block', fontSize: '1.8rem', marginBottom: 8 }}>⏳</span>{a.uploading}</div>
                          ) : galleryForm.src ? (
                            <div style={{ color: '#4ade80', fontSize: '.85rem' }}>
                              <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: 6 }}>✅</span>
                              {a.uploadSuccess}<br />
                              <span style={{ color: '#64748b', fontSize: '.75rem', wordBreak: 'break-all' }}>{galleryForm.src}</span><br />
                              <span style={{ color: '#E07B39', fontSize: '.78rem', marginTop: 6, display: 'inline-block' }}>{a.clickToChange}</span>
                            </div>
                          ) : (
                            <div style={{ color: '#64748b', fontSize: '.88rem' }}>
                              <span style={{ display: 'block', fontSize: '2rem', marginBottom: 8 }}>🖼️</span>
                              <span style={{ color: '#E07B39', fontWeight: 600 }}>{a.clickToBrowse}</span> {a.orDrag}<br />
                              <span style={{ fontSize: '.75rem', marginTop: 6, display: 'inline-block' }}>{a.fileTypes}</span>
                            </div>
                          )}
                        </div>
                        <input type="text" value={galleryForm.src} onChange={() => {}} required style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} />
                      </>
                    )}
                    {galleryForm.src && !uploading && (
                      <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', height: 140, background: '#0f1117', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={galleryForm.src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>{a.altLabel}</Label>
                    <Input value={galleryForm.alt} onChange={v => setGalleryForm(f => ({ ...f, alt: v }))} placeholder={a.altPlaceholder} required />
                  </div>
                  <div>
                    <Label>{a.captionLabel}</Label>
                    <Input value={galleryForm.label} onChange={v => setGalleryForm(f => ({ ...f, label: v }))} placeholder={a.captionPlaceholder} required />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label>{a.categoryLabel}</Label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {GALLERY_CATS.map(cat => (
                        <button key={cat} type="button" onClick={() => setGalleryForm(f => ({ ...f, category: cat }))} style={{ padding: '6px 16px', borderRadius: 100, border: `1.5px solid ${galleryForm.category === cat ? galleryCatHex(cat) : '#2d3748'}`, background: galleryForm.category === cat ? galleryCatHex(cat) + '22' : 'transparent', color: galleryForm.category === cat ? galleryCatHex(cat) : '#94a3b8', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer', transition: 'all .15s' }}>
                          {galleryEmoji(cat)} {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                  <button type="submit" disabled={saving || uploading} style={{ padding: '10px 26px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.9rem', cursor: (saving || uploading) ? 'not-allowed' : 'pointer', opacity: (saving || uploading) ? .7 : 1 }}>
                    {saving ? a.addingImg : a.addToGallery}
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {filteredGallery.map(img => (
                <div key={img.id} style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, overflow: 'hidden', position: 'relative', transition: 'border-color .2s' }}>
                  <div style={{ height: 150, overflow: 'hidden', background: '#0f1117' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }} onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.label}</span>
                      <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: galleryCatHex(img.category) + '33', color: galleryCatHex(img.category), textTransform: 'uppercase', letterSpacing: '.05em', flexShrink: 0, marginLeft: 6 }}>{img.category}</span>
                    </div>
                    <p style={{ fontSize: '.72rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 10 }}>{img.alt}</p>
                    <button onClick={() => handleDeleteImage(img.id)} style={{ width: '100%', padding: '6px 0', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 6, color: '#f87171', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}>
                      {a.deleteImgBtn}
                    </button>
                  </div>
                </div>
              ))}
              {filteredGallery.length === 0 && (
                <p style={{ color: '#475569', gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                  {a.noImages}{galleryCatFilter !== 'all' ? ` ${a.inCategory} "${galleryCatFilter}"` : ''}. {a.addOne}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LangBadge({ lang }: { lang: Lang }) {
  const colors: Record<Lang, string> = { fr: '#3b82f6', en: '#10b981', ar: '#f59e0b' }
  const labels: Record<Lang, string> = { fr: 'FR', en: 'EN', ar: 'AR' }
  return (
    <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: colors[lang] + '22', color: colors[lang], marginLeft: 6 }}>
      {labels[lang]}
    </span>
  )
}

function catColor(cat: string) {
  const map: Record<string, string> = { sahara: '#b45309', culture: '#1d4ed8', premium: '#7c3aed', corporate: '#065f46' }
  return map[cat] ?? '#374151'
}

function galleryCatHex(cat: string) {
  const map: Record<string, string> = { sahara: '#E07B39', ghardaia: '#1d4ed8', hotels: '#7c3aed', culture: '#059669', autre: '#64748b' }
  return map[cat] ?? '#64748b'
}

function galleryEmoji(cat: string) {
  const map: Record<string, string> = { sahara: '🏜️', ghardaia: '🕌', hotels: '🏨', culture: '🎭', autre: '📷' }
  return map[cat] ?? '📷'
}

const inputBase: React.CSSProperties = {
  background: '#0f1117', border: '1px solid #2d3748', borderRadius: 8,
  color: '#e2e8f0', fontSize: '.9rem', padding: '9px 12px', outline: 'none', fontFamily: 'Inter, sans-serif',
}

const sectionStyle: React.CSSProperties = {
  background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, padding: '24px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '.95rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 16, fontFamily: 'Inter, sans-serif',
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6, letterSpacing: '.05em', textTransform: 'uppercase' }}>{children}</label>
}

function Input({ value, onChange, placeholder, required, style, dir }: { value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; style?: React.CSSProperties; dir?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} dir={dir} style={{ ...inputBase, width: '100%', ...style }} />
}

function AddBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} style={{ fontSize: '.8rem', fontWeight: 600, color: '#E07B39', background: 'rgba(224,123,57,.1)', border: '1px solid rgba(224,123,57,.3)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer' }}>{children}</button>
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} style={{ flexShrink: 0, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 6, color: '#f87171', cursor: 'pointer', fontSize: '1rem' }}>×</button>
}
