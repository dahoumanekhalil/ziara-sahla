'use client'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Offer, MLString } from '@/lib/types'
import type { GalleryImage } from '@/lib/gallery'
import type { Category, CategoryKind } from '@/lib/categories'
import type { ServiceCard, ServiceIconClass } from '@/lib/services'
import type { ContactInfo } from '@/lib/contact'
import { useLang } from '@/context/LangContext'
import type { Lang } from '@/context/LangContext'
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
  cat: '',
  title: emptyML(),
  dur: emptyML(),
  desc: emptyML(),
  meta: [{ icon: '📍', from: emptyML(), to: emptyML() }],
  inclus: [{ ico: '✅', txt: emptyML() }],
  nonInclus: [{ ico: '❌', txt: emptyML() }],
  programme: [{ j: 'J1', titre: emptyML(), desc: emptyML() }],
})

const META_ICONS = ['📍', '📅', '🗓️', '👥', '🏨', '🚌', '✈️', '🚗', '⏱️', '🎯', '💰', '🌡️', '🌍', '🏛️', '🕌', '⛰️', '🏜️', '🌊', '🌴', '🔥', '☀️', '🌙', '🎪', '🎭']
const INCLUS_ICONS = ['✅', '🍽️', '🛏️', '🚌', '🎫', '📸', '🧭', '🏊', '💧', '🎁', '🎨', '☕', '🍷', '🎵', '🚿', '🔒', '📶', '🛎️', '👨‍🏫', '🎧', '💼', '🩺', '🛂', '🅿️']
const NON_INCLUS_ICONS = ['❌', '🚫', '⛔', '✈️', '🛂', '💳', '💵', '🍽️', '🏨', '🎫', '📸', '🩺', '💊', '🎁', '☕', '🍷', '🚗', '🅿️', '📶', '🎧', '🚿', '💼', '🧾', '🛍️']
const SERVICE_ICONS = ['🌿', '✨', '👑', '💎', '⭐', '🏆', '🎖️', '🏅', '🎯', '🚀', '💼', '🎁', '☕', '🍷', '🏖️', '🏔️', '🕌', '🏛️', '🎭', '📷', '🌙', '☀️', '🌟', '🏨']

const emptyGalleryForm = (defaultCat = 'sahara') => ({
  src: '',
  alt: '',
  label: '',
  category: defaultCat,
})

const emptyCatForm = () => ({ name: '', emoji: '🏷️', kind: 'offer' as CategoryKind, parent: '' as string })

export default function AdminClient({
  initialOffers,
  initialGallery,
  initialCategories,
  initialServices,
  initialContact,
}: {
  initialOffers: Offer[]
  initialGallery: GalleryImage[]
  initialCategories: Category[]
  initialServices: ServiceCard[]
  initialContact: ContactInfo
}) {
  const router = useRouter()
  const { tr, lang, setLang } = useLang()
  const a = tr.admin

  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [services, setServices] = useState<ServiceCard[]>(initialServices)
  const [contact, setContact] = useState<ContactInfo>(initialContact)
  const galleryCats = categories.filter(c => c.kind === 'gallery')

  const [form, setForm] = useState(() => emptyForm())
  const [formLang, setFormLang] = useState<Lang>('fr')
  const [galleryForm, setGalleryForm] = useState(() => emptyGalleryForm(galleryCats[0]?.name ?? 'sahara'))
  const [catForm, setCatForm] = useState(emptyCatForm())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [galleryMsg, setGalleryMsg] = useState('')
  const [galleryMsgOk, setGalleryMsgOk] = useState(false)
  const [catMsg, setCatMsg] = useState('')
  const [catMsgOk, setCatMsgOk] = useState(false)
  const [tab, setTab] = useState<'list' | 'add' | 'gallery' | 'cats' | 'services' | 'contact'>('list')
  const [servicesMsg, setServicesMsg] = useState('')
  const [servicesMsgOk, setServicesMsgOk] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [contactMsgOk, setContactMsgOk] = useState(false)
  const [serviceLang, setServiceLang] = useState<Lang>('fr')
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

  function setPlainField(key: 'img', value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function setMeta(i: number, key: 'icon' | 'from' | 'to', value: string) {
    setForm(f => {
      const meta = [...f.meta]
      if (key === 'icon') {
        meta[i] = { ...meta[i], icon: value }
      } else {
        meta[i] = { ...meta[i], [key]: { ...meta[i][key], [formLang]: value } }
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

  function setNonInclus(i: number, key: 'ico' | 'txt', value: string) {
    setForm(f => {
      const nonInclus = [...f.nonInclus]
      if (key === 'ico') {
        nonInclus[i] = { ...nonInclus[i], ico: value }
      } else {
        nonInclus[i] = { ...nonInclus[i], txt: { ...nonInclus[i].txt, [formLang]: value } }
      }
      return { ...f, nonInclus }
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

  function toML(v: unknown): MLString {
    if (v && typeof v === 'object' && 'fr' in (v as Record<string, unknown>)) {
      const obj = v as Partial<MLString>
      return { fr: obj.fr ?? '', en: obj.en ?? '', ar: obj.ar ?? '' }
    }
    if (typeof v === 'string') return { fr: v, en: '', ar: '' }
    return emptyML()
  }

  function loadOfferToForm(offer: Offer) {
    setForm({
      img: offer.img ?? '',
      cat: offer.cat ?? '',
      title: toML(offer.title),
      dur: toML(offer.dur),
      desc: toML(offer.desc),
      meta: (offer.meta ?? []).map(m => ({
        icon: m.icon ?? '📍',
        from: m.from ? toML(m.from) : (m.label ? toML(m.label) : emptyML()),
        to: m.to ? toML(m.to) : emptyML(),
      })),
      inclus: (offer.inclus ?? []).map(i => ({ ico: i.ico ?? '✅', txt: toML(i.txt) })),
      nonInclus: (offer.nonInclus ?? []).map(i => ({ ico: i.ico ?? '❌', txt: toML(i.txt) })),
      programme: (offer.programme ?? []).map(p => ({
        j: p.j ?? 'J1',
        titre: toML(p.titre),
        desc: toML(p.desc),
      })),
    })
  }

  function startEdit(offer: Offer) {
    setEditingId(offer.id)
    loadOfferToForm(offer)
    setMsg('')
    setTab('add')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm())
    setMsg('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    const isEdit = editingId !== null
    try {
      const res = await fetch(isEdit ? `/api/offers/${editingId}` : '/api/offers', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const saved = await res.json()
        setOffers(o => isEdit ? o.map(x => x.id === saved.id ? saved : x) : [...o, saved])
        setForm(emptyForm())
        setEditingId(null)
        setMsg(isEdit ? a.offerUpdated : a.offerAdded)
        setMsgOk(true)
        setTab('list')
      } else {
        const text = await res.text()
        let errMsg = ''
        try {
          errMsg = JSON.parse(text).error ?? ''
        } catch {
          errMsg = `HTTP ${res.status} — ${text.slice(0, 200)}`
        }
        setMsg(errMsg || a.addError)
        setMsgOk(false)
      }
    } catch (err) {
      console.error('[handleSubmit] fetch failed', err)
      setMsg(a.networkError)
      setMsgOk(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: MLString | string) {
    const label = typeof title === 'string' ? title : title.fr
    if (!confirm(`${a.confirmDelete} "${label}" ?`)) return
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

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setCatMsg('')
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      })
      const data = await res.json()
      if (res.ok) {
        setCategories(c => [...c, data])
        setCatForm(emptyCatForm())
        setCatMsg('Catégorie ajoutée')
        setCatMsgOk(true)
      } else {
        setCatMsg(data.error ?? 'Erreur')
        setCatMsgOk(false)
      }
    } catch {
      setCatMsg(a.networkError)
      setCatMsgOk(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteCategory(cat: Category) {
    if (!confirm(`Supprimer la catégorie "${cat.name}" ?`)) return
    const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
    if (res.ok) setCategories(cs => cs.filter(c => c.id !== cat.id))
  }

  async function handleToggleHidden(cat: Category) {
    const next = !cat.hidden
    const res = await fetch(`/api/categories/${cat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: next }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCategories(cs => cs.map(c => (c.id === cat.id ? updated : c)))
    }
  }

  const filteredGallery = galleryCatFilter === 'all'
    ? gallery
    : gallery.filter(img => img.category === galleryCatFilter)

  function setServiceField<K extends 'label' | 'title' | 'desc' | 'ribbon'>(i: number, key: K, value: string) {
    setServices(list => list.map((s, j) => j === i
      ? { ...s, [key]: { ...(s[key] as MLString ?? { fr: '', en: '', ar: '' }), [serviceLang]: value } }
      : s))
  }

  function setServicePlain<K extends 'img' | 'icon' | 'iconClass'>(i: number, key: K, value: ServiceCard[K]) {
    setServices(list => list.map((s, j) => (j === i ? { ...s, [key]: value } : s)))
  }

  function setServiceFeat(i: number, fi: number, value: string) {
    setServices(list => list.map((s, j) => j === i
      ? { ...s, feats: s.feats.map((f, k) => k === fi ? { ...f, [serviceLang]: value } : f) }
      : s))
  }

  function addServiceFeat(i: number) {
    setServices(list => list.map((s, j) => j === i
      ? { ...s, feats: [...s.feats, { fr: '', en: '', ar: '' }] }
      : s))
  }

  function removeServiceFeat(i: number, fi: number) {
    setServices(list => list.map((s, j) => j === i
      ? { ...s, feats: s.feats.filter((_, k) => k !== fi) }
      : s))
  }

  function addService() {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `svc-${Date.now()}`
    const newService: ServiceCard = {
      id,
      img: '',
      icon: '✨',
      iconClass: 'ci-mid',
      label: emptyML(),
      title: emptyML(),
      desc: emptyML(),
      feats: [emptyML()],
      active: true,
      minPeople: 5,
      maxPeople: 30,
    }
    setServices(list => [...list, newService])
    setServicesMsg('')
  }

  function deleteService(i: number, title: MLString) {
    const label = title.fr || title.en || title.ar || '(sans titre)'
    if (!confirm(`${a.confirmDelete} "${label}" ?`)) return
    setServices(list => list.filter((_, j) => j !== i))
    setServicesMsg('')
  }

  async function handleSaveServices() {
    setSaving(true)
    setServicesMsg('')
    try {
      const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(services),
      })
      const data = await res.json()
      if (res.ok) {
        setServices(data)
        setServicesMsg(a.savedOk)
        setServicesMsgOk(true)
      } else {
        setServicesMsg(data.error ?? a.saveError)
        setServicesMsgOk(false)
      }
    } catch {
      setServicesMsg(a.networkError)
      setServicesMsgOk(false)
    } finally {
      setSaving(false)
    }
  }

  function setContactField<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setContact(c => ({ ...c, [key]: value }))
  }

  async function handleSaveContact() {
    setSaving(true)
    setContactMsg('')
    try {
      const res = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      })
      const data = await res.json()
      if (res.ok) {
        setContact(data)
        setContactMsg(a.savedOk)
        setContactMsgOk(true)
      } else {
        setContactMsg(data.error ?? a.saveError)
        setContactMsgOk(false)
      }
    } catch {
      setContactMsg(a.networkError)
      setContactMsgOk(false)
    } finally {
      setSaving(false)
    }
  }

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
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#1a1f2e', borderRadius: 10, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
          {(['list', 'gallery', 'cats', 'services', 'contact'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg(''); setGalleryMsg(''); setCatMsg(''); setServicesMsg(''); setContactMsg('') }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem', background: tab === t ? '#E07B39' : 'transparent', color: tab === t ? '#fff' : '#94a3b8', transition: 'all .2s' }}>
              {t === 'list' ? `${a.tabOffersPrefix} (${offers.length})`
                : t === 'gallery' ? `${a.tabGalleryPrefix} (${gallery.length})`
                : t === 'cats' ? `🏷️ Catégories (${categories.length})`
                : t === 'services' ? `${a.tabServices} (${services.length})`
                : a.tabContact}
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button
                onClick={() => { cancelEdit(); setTab('add') }}
                style={{ padding: '9px 20px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', transition: 'background .18s' }}
              >
                {a.tabAdd}
              </button>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
            {offers.map(o => (
              <div key={o.id} style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{o.title?.fr ?? o.title as unknown as string}</span>
                  </div>
                  <div style={{ fontSize: '.8rem', color: '#64748b' }}>{o.dur?.fr ?? o.dur as unknown as string} · {o.inclus.length} {a.inclusions} · {o.programme.length} {a.days}</div>
                </div>
                <button onClick={() => startEdit(o)} style={{ padding: '7px 16px', background: 'rgba(224,123,57,.12)', border: '1px solid rgba(224,123,57,.4)', borderRadius: 8, color: '#E07B39', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  {a.editBtn}
                </button>
                <button onClick={() => handleDelete(o.id, o.title)} style={{ padding: '7px 16px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, color: '#f87171', fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                  {a.deleteBtn}
                </button>
              </div>
            ))}
            {offers.length === 0 && <p style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>{a.noOffers}</p>}
            </div>
          </div>
        )}

        {/* ── Add / Edit offer form ── */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => { cancelEdit(); setTab('list') }}
                style={{ padding: '7px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: 8, fontWeight: 600, fontSize: '.82rem', cursor: 'pointer' }}
              >
                ← {a.tabOffersPrefix}
              </button>
              {editingId && (
                <span style={{ fontSize: '.78rem', fontWeight: 700, padding: '5px 12px', borderRadius: 100, background: 'rgba(224,123,57,.15)', color: '#E07B39', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  {a.editingBadge}
                </span>
              )}
            </div>

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
                    {(['title', 'desc', 'dur'] as const).every(k => (form[k] as MLString)[l.key]) && (
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
                <div style={{ gridColumn: '1 / -1' }}>
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
                  <Label>{a.fieldCat}</Label>
                  <select
                    value={form.cat}
                    onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}
                    style={{ ...inputBase, width: '100%' }}
                  >
                    <option value="">{a.categoryNone}</option>
                    {(() => {
                      const offerCats = categories.filter(c => c.kind === 'offer' && !c.hidden)
                      const roots = offerCats.filter(c => !c.parent)
                      const options: React.ReactElement[] = []
                      roots.forEach(root => {
                        options.push(
                          <option key={root.id} value={root.name}>
                            {root.emoji} {root.name}
                          </option>
                        )
                        offerCats.filter(c => c.parent === root.id).forEach(child => {
                          options.push(
                            <option key={child.id} value={child.name}>
                              &nbsp;&nbsp;↳ {child.emoji} {child.name}
                            </option>
                          )
                        })
                      })
                      return options
                    })()}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>{a.fieldImg}</Label>
                  <ImageField value={form.img} onChange={v => setPlainField('img', v)} required />
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
                <AddBtn onClick={() => setForm(f => ({ ...f, meta: [...f.meta, { icon: '📍', from: emptyML(), to: emptyML() }] }))}>{a.addBtn}</AddBtn>
              </div>
              {form.meta.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <IconPicker value={m.icon} onChange={v => setMeta(i, 'icon', v)} presets={META_ICONS} />
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center' }}>
                    <div>
                      <Label>{a.metaFromLabel} <LangBadge lang={formLang} /></Label>
                      <Input
                        value={m.from[formLang]}
                        onChange={v => setMeta(i, 'from', v)}
                        placeholder={formLang === 'fr' ? a.metaFromPlaceholder : formLang === 'en' ? 'Algiers' : 'الجزائر'}
                        dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                    <span style={{ fontSize: '1.2rem', color: '#64748b', paddingTop: 22 }}>→</span>
                    <div>
                      <Label>{a.metaToLabel} <LangBadge lang={formLang} /></Label>
                      <Input
                        value={m.to[formLang]}
                        onChange={v => setMeta(i, 'to', v)}
                        placeholder={formLang === 'fr' ? a.metaToPlaceholder : formLang === 'en' ? 'Ghardaïa' : 'غرداية'}
                        dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>
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
                  <IconPicker value={inc.ico} onChange={v => setInclus(i, 'ico', v)} presets={INCLUS_ICONS} />
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

            {/* Non inclus */}
            <section style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={sectionTitle}>{a.sectionNonInclus}</h2>
                <AddBtn onClick={() => setForm(f => ({ ...f, nonInclus: [...f.nonInclus, { ico: '❌', txt: emptyML() }] }))}>{a.addBtn}</AddBtn>
              </div>
              {form.nonInclus.map((inc, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                  <IconPicker value={inc.ico} onChange={v => setNonInclus(i, 'ico', v)} presets={NON_INCLUS_ICONS} />
                  <Input
                    value={inc.txt[formLang]}
                    onChange={v => setNonInclus(i, 'txt', v)}
                    placeholder={formLang === 'fr' ? a.nonInclusPlaceholder : formLang === 'en' ? 'International flights' : 'الرحلات الدولية'}
                    style={{ flex: 1 }}
                    dir={formLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {form.nonInclus.length > 0 && (
                    <RemoveBtn onClick={() => setForm(f => ({ ...f, nonInclus: f.nonInclus.filter((_, j) => j !== i) }))} />
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
                {saving ? a.saving : (editingId ? a.updateOffer : a.submitOffer)}
              </button>
              <button type="button" onClick={() => { cancelEdit() }} style={{ padding: '13px 24px', background: 'transparent', color: '#94a3b8', border: '1px solid #2d3748', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
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
                {['all', ...galleryCats.map(c => c.name)].map(cat => {
                  const emoji = cat === 'all' ? '' : galleryCats.find(c => c.name === cat)?.emoji ?? '📷'
                  return (
                    <button key={cat} onClick={() => setGalleryCatFilter(cat)} style={{ padding: '5px 14px', borderRadius: 100, border: `1px solid ${galleryCatFilter === cat ? '#E07B39' : '#2d3748'}`, cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, background: galleryCatFilter === cat ? '#E07B39' : '#1a1f2e', color: galleryCatFilter === cat ? '#fff' : '#94a3b8', transition: 'all .2s' }}>
                      {cat === 'all' ? `${a.allCatPrefix} (${gallery.length})` : `${emoji} ${cat} (${gallery.filter(g => g.category === cat).length})`}
                    </button>
                  )
                })}
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
                      {galleryCats.map(c => (
                        <button key={c.id} type="button" onClick={() => setGalleryForm(f => ({ ...f, category: c.name }))} style={{ padding: '6px 16px', borderRadius: 100, border: `1.5px solid ${galleryForm.category === c.name ? galleryCatHex(c.name) : '#2d3748'}`, background: galleryForm.category === c.name ? galleryCatHex(c.name) + '22' : 'transparent', color: galleryForm.category === c.name ? galleryCatHex(c.name) : '#94a3b8', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer', transition: 'all .15s' }}>
                          {c.emoji} {c.name}
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

        {/* ── Categories tab ── */}
        {tab === 'cats' && (
          <div>
            {catMsg && (
              <div style={{ background: catMsgOk ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${catMsgOk ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: catMsgOk ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
                {catMsg}
              </div>
            )}

            {/* Add form */}
            <form onSubmit={handleAddCategory} style={{ ...sectionStyle, marginBottom: 24 }}>
              <h2 style={{ ...sectionTitle, marginBottom: 16 }}>+ Nouvelle catégorie</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <Label>Emoji</Label>
                  <Input value={catForm.emoji} onChange={v => setCatForm(f => ({ ...f, emoji: v }))} placeholder="🏷️" />
                </div>
                <div>
                  <Label>Nom (identifiant)</Label>
                  <Input value={catForm.name} onChange={v => setCatForm(f => ({ ...f, name: v.toLowerCase().replace(/\s+/g, '-') }))} placeholder="ex: sahara" required />
                </div>
                <div>
                  <Label>Type</Label>
                  <select value={catForm.kind} onChange={e => setCatForm(f => ({ ...f, kind: e.target.value as CategoryKind, parent: '' }))} style={{ ...inputBase, width: '100%' }}>
                    <option value="offer">Offre</option>
                    <option value="gallery">Galerie</option>
                  </select>
                </div>
                <button type="submit" disabled={saving} style={{ padding: '9px 22px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.88rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}>
                  {saving ? '…' : '+ Ajouter'}
                </button>
              </div>
              <div style={{ marginTop: 12 }}>
                <Label>{a.fieldParent}</Label>
                <select
                  value={catForm.parent}
                  onChange={e => setCatForm(f => ({ ...f, parent: e.target.value }))}
                  style={{ ...inputBase, width: '100%' }}
                >
                  <option value="">{a.parentNone}</option>
                  {categories
                    .filter(c => c.kind === catForm.kind && !c.parent)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                </select>
              </div>
              <p style={{ fontSize: '.72rem', color: '#475569', marginTop: 10 }}>
                Le nom sert d&apos;identifiant (minuscules, sans espaces). Les catégories &quot;offre&quot; s&apos;utilisent dans les offres, &quot;galerie&quot; dans les photos.
              </p>
            </form>

            {/* Two sections */}
            {(['offer', 'gallery'] as const).map(kind => {
              const list = categories.filter(c => c.kind === kind)
              const roots = list.filter(c => !c.parent)
              const label = kind === 'offer' ? 'Catégories des offres' : 'Catégories de la galerie'

              const renderCat = (cat: Category, depth: number) => {
                const usageCount = kind === 'offer'
                  ? offers.filter(o => o.cat === cat.name).length
                  : gallery.filter(g => g.category === cat.name).length
                const children = list.filter(c => c.parent === cat.id)
                return (
                  <div key={cat.id} style={{ display: 'grid', gap: 8, marginLeft: depth * 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#0f1117', border: `1px solid ${cat.hidden ? 'rgba(239,68,68,.3)' : '#2d3748'}`, borderRadius: 10, opacity: cat.hidden ? .7 : 1 }}>
                      {depth > 0 && <span style={{ color: '#475569', fontSize: '.9rem' }}>↳</span>}
                      <span style={{ fontSize: '1.4rem' }}>{cat.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {cat.name}
                          {cat.hidden && <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(239,68,68,.15)', color: '#f87171', textTransform: 'uppercase', letterSpacing: '.05em' }}>Masquée</span>}
                          {depth === 0 && children.length > 0 && (
                            <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: 'rgba(224,123,57,.15)', color: '#E07B39', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                              {children.length} {a.subCatsLabel.toLowerCase()}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '.75rem', color: '#64748b', marginTop: 2 }}>
                          {usageCount} {kind === 'offer' ? (usageCount > 1 ? 'offres' : 'offre') : (usageCount > 1 ? 'images' : 'image')}
                        </div>
                      </div>
                      <button onClick={() => handleToggleHidden(cat)} title={cat.hidden ? 'Afficher sur le site' : 'Masquer du site'} style={{ padding: '7px 14px', background: cat.hidden ? 'rgba(34,197,94,.1)' : 'rgba(148,163,184,.1)', border: `1px solid ${cat.hidden ? 'rgba(34,197,94,.35)' : '#2d3748'}`, borderRadius: 8, color: cat.hidden ? '#4ade80' : '#94a3b8', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer' }}>
                        {cat.hidden ? '👁 Afficher' : '🚫 Masquer'}
                      </button>
                      <button onClick={() => handleDeleteCategory(cat)} style={{ padding: '7px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, color: '#f87171', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer' }}>
                        Supprimer
                      </button>
                    </div>
                    {children.map(child => renderCat(child, depth + 1))}
                  </div>
                )
              }

              return (
                <section key={kind} style={{ ...sectionStyle, marginBottom: 20 }}>
                  <h2 style={sectionTitle}>{label} ({list.length})</h2>
                  {list.length === 0 && (
                    <p style={{ color: '#475569', textAlign: 'center', padding: '20px 0', fontSize: '.85rem' }}>Aucune catégorie.</p>
                  )}
                  <div style={{ display: 'grid', gap: 8 }}>
                    {roots.map(cat => renderCat(cat, 0))}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {/* ── Services tab ── */}
        {tab === 'services' && (
          <div>
            {servicesMsg && (
              <div style={{ background: servicesMsgOk ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${servicesMsgOk ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: servicesMsgOk ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
                {servicesMsg}
              </div>
            )}

            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ ...sectionTitle, fontSize: '1.1rem', marginBottom: 6 }}>{a.servicesTitle}</h2>
                <p style={{ fontSize: '.85rem', color: '#64748b' }}>{a.servicesSub}</p>
              </div>
              <button
                type="button"
                onClick={addService}
                style={{ padding: '9px 18px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.88rem', cursor: 'pointer', flexShrink: 0 }}
              >
                {a.addServiceBtn}
              </button>
            </div>

            {/* Language switcher */}
            <div style={{ background: '#1a1f2e', border: '1px solid #2d3748', borderRadius: 12, padding: '14px 20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em' }}>Langue</span>
                {FORM_LANGS.map(l => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setServiceLang(l.key)}
                    style={{ padding: '6px 14px', borderRadius: 6, border: `1.5px solid ${serviceLang === l.key ? '#E07B39' : '#2d3748'}`, background: serviceLang === l.key ? 'rgba(224,123,57,.12)' : 'transparent', color: serviceLang === l.key ? '#E07B39' : '#64748b', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer' }}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
            </div>

            {services.length === 0 && (
              <p style={{ color: '#475569', textAlign: 'center', padding: '30px 0', fontSize: '.85rem' }}>{a.noServices}</p>
            )}

            {services.map((svc, i) => (
              <section key={svc.id} style={{ ...sectionStyle, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
                  <h3 style={{ ...sectionTitle, margin: 0 }}>
                    #{i + 1} — {svc.title[serviceLang] || svc.title.fr || '(sans titre)'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => deleteService(i, svc.title)}
                    style={{ padding: '6px 14px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, color: '#f87171', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
                  >
                    🗑 {a.deleteBtn}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label>{a.fieldServiceImg}</Label>
                    <ImageField value={svc.img} onChange={v => setServicePlain(i, 'img', v)} required />
                  </div>

                  <div>
                    <Label>{a.fieldServiceIcon}</Label>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <IconPicker value={svc.icon} onChange={v => setServicePlain(i, 'icon', v)} presets={SERVICE_ICONS} />
                      <Input value={svc.icon} onChange={v => setServicePlain(i, 'icon', v)} placeholder="🌿" style={{ flex: 1 }} />
                    </div>
                  </div>

                  <div>
                    <Label>{a.fieldServiceIconClass}</Label>
                    <select value={svc.iconClass} onChange={e => setServicePlain(i, 'iconClass', e.target.value as ServiceIconClass)} style={{ ...inputBase, width: '100%' }}>
                      <option value="ci-eco">🌿 Eco (vert)</option>
                      <option value="ci-mid">✨ Mid (or)</option>
                      <option value="ci-prem">👑 Premium (violet)</option>
                    </select>
                  </div>

                  <div>
                    <Label>{a.fieldServiceLabel} <LangBadge lang={serviceLang} /></Label>
                    <Input value={svc.label[serviceLang] ?? ''} onChange={v => setServiceField(i, 'label', v)} placeholder="Formule 01" dir={serviceLang === 'ar' ? 'rtl' : 'ltr'} />
                  </div>

                  <div>
                    <Label>{a.fieldTitle} <LangBadge lang={serviceLang} /></Label>
                    <Input value={svc.title[serviceLang] ?? ''} onChange={v => setServiceField(i, 'title', v)} placeholder="Essentiel" dir={serviceLang === 'ar' ? 'rtl' : 'ltr'} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label>{a.fieldServiceDesc} <LangBadge lang={serviceLang} /></Label>
                    <textarea
                      value={svc.desc[serviceLang] ?? ''}
                      onChange={e => setServiceField(i, 'desc', e.target.value)}
                      rows={3}
                      dir={serviceLang === 'ar' ? 'rtl' : 'ltr'}
                      style={{ ...inputBase, width: '100%', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', color: '#94a3b8', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!svc.featured}
                        onChange={e => setServices(list => list.map((s, j) => j === i ? { ...s, featured: e.target.checked } : s))}
                      />
                      {a.fieldServiceFeatured}
                    </label>
                    <div style={{ flex: 1 }}>
                      <Label>{a.fieldServiceRibbon} <LangBadge lang={serviceLang} /></Label>
                      <Input
                        value={svc.ribbon?.[serviceLang] ?? ''}
                        onChange={v => setServiceField(i, 'ribbon', v)}
                        placeholder={a.ribbonPlaceholder}
                        dir={serviceLang === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1', background: svc.active ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)', border: `1px solid ${svc.active ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`, borderRadius: 10, padding: '14px 16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={svc.active}
                        onChange={e => setServices(list => list.map((s, j) => j === i ? { ...s, active: e.target.checked } : s))}
                        style={{ width: 18, height: 18, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '.95rem', fontWeight: 700, color: svc.active ? '#4ade80' : '#f87171' }}>
                        {svc.active ? '🟢' : '🔴'} {a.fieldServiceActive}
                      </span>
                    </label>
                    <p style={{ margin: '6px 0 0 28px', fontSize: '.78rem', color: '#64748b' }}>{a.fieldServiceActiveHint}</p>
                  </div>

                  <div>
                    <Label>{a.fieldServiceMinPeople}</Label>
                    <input
                      type="number"
                      min={1}
                      value={svc.minPeople}
                      onChange={e => setServices(list => list.map((s, j) => j === i ? { ...s, minPeople: Math.max(1, parseInt(e.target.value) || 1) } : s))}
                      style={{ ...inputBase, width: '100%' }}
                    />
                  </div>

                  <div>
                    <Label>{a.fieldServiceMaxPeople}</Label>
                    <input
                      type="number"
                      min={1}
                      value={svc.maxPeople}
                      onChange={e => setServices(list => list.map((s, j) => j === i ? { ...s, maxPeople: Math.max(1, parseInt(e.target.value) || 1) } : s))}
                      style={{ ...inputBase, width: '100%' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Label>{a.fieldServiceFeats} <LangBadge lang={serviceLang} /></Label>
                      <AddBtn onClick={() => addServiceFeat(i)}>{a.addBtn}</AddBtn>
                    </div>
                    {svc.feats.map((f, fi) => (
                      <div key={fi} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                        <Input
                          value={f[serviceLang] ?? ''}
                          onChange={v => setServiceFeat(i, fi, v)}
                          placeholder={a.featPlaceholder}
                          dir={serviceLang === 'ar' ? 'rtl' : 'ltr'}
                          style={{ flex: 1 }}
                        />
                        {svc.feats.length > 1 && <RemoveBtn onClick={() => removeServiceFeat(i, fi)} />}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSaveServices}
                disabled={saving}
                style={{ padding: '11px 26px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.95rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}
              >
                {saving ? a.saving : a.saveBtn}
              </button>
            </div>
          </div>
        )}

        {/* ── Contact tab ── */}
        {tab === 'contact' && (
          <div>
            {contactMsg && (
              <div style={{ background: contactMsgOk ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${contactMsgOk ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: contactMsgOk ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
                {contactMsg}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <h2 style={{ ...sectionTitle, fontSize: '1.1rem', marginBottom: 6 }}>{a.contactTitle}</h2>
              <p style={{ fontSize: '.85rem', color: '#64748b' }}>{a.contactSub}</p>
            </div>

            <section style={sectionStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Label>📧 {a.contactEmail}</Label>
                  <Input value={contact.email} onChange={v => setContactField('email', v)} placeholder="contact@ziara-sahla.com" />
                </div>
                <div>
                  <Label>🇫🇷 {a.contactPhoneFr}</Label>
                  <Input value={contact.phoneFr} onChange={v => setContactField('phoneFr', v)} placeholder="+33 6 12 34 56 78" />
                </div>
                <div>
                  <Label>🇩🇿 {a.contactPhoneDz}</Label>
                  <Input value={contact.phoneDz} onChange={v => setContactField('phoneDz', v)} placeholder="+213 5 57 61 06 60" />
                </div>
                <div>
                  <Label>📍 {a.contactAddrFr}</Label>
                  <Input value={contact.addressFr} onChange={v => setContactField('addressFr', v)} placeholder="Paris, France" />
                </div>
                <div>
                  <Label>📍 {a.contactAddrDz}</Label>
                  <Input value={contact.addressDz} onChange={v => setContactField('addressDz', v)} placeholder="Alger, Algérie" />
                </div>
                <div>
                  <Label>📘 {a.contactFacebook}</Label>
                  <Input value={contact.facebookUrl} onChange={v => setContactField('facebookUrl', v)} placeholder="https://facebook.com/…" />
                </div>
                <div>
                  <Label>📸 {a.contactInstagram}</Label>
                  <Input value={contact.instagramUrl} onChange={v => setContactField('instagramUrl', v)} placeholder="https://instagram.com/…" />
                </div>
                <div>
                  <Label>💼 {a.contactLinkedin}</Label>
                  <Input value={contact.linkedinUrl} onChange={v => setContactField('linkedinUrl', v)} placeholder="https://linkedin.com/…" />
                </div>
                <div>
                  <Label>💬 {a.contactWhatsapp}</Label>
                  <Input value={contact.whatsappUrl} onChange={v => setContactField('whatsappUrl', v)} placeholder="https://wa.me/…" />
                </div>
              </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={handleSaveContact}
                disabled={saving}
                style={{ padding: '11px 26px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '.95rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1 }}
              >
                {saving ? a.saving : a.saveBtn}
              </button>
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

function ImageField({ value, onChange, required }: { value: string; onChange: (v: string) => void; required?: boolean }) {
  const { tr } = useLang()
  const a = tr.admin
  const [mode, setMode] = useState<'url' | 'upload'>(value.startsWith('http') || value.startsWith('/uploads') ? 'upload' : 'url')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/gallery/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) onChange(data.src)
      else setError(data.error ?? a.uploadError)
    } catch {
      setError(a.networkError)
    } finally {
      setUploading(false)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 10, background: '#0f1117', borderRadius: 8, padding: 3, width: 'fit-content' }}>
        {(['url', 'upload'] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); onChange(''); setError('') }}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '.78rem',
              background: mode === m ? '#E07B39' : 'transparent',
              color: mode === m ? '#fff' : '#64748b',
              transition: 'all .18s',
            }}
          >
            {m === 'url' ? a.urlMode : a.uploadMode}
          </button>
        ))}
      </div>

      {mode === 'url' && (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="/assets/sahara/photo.jpg"
          required={required}
          style={{ ...inputBase, width: '100%' }}
        />
      )}

      {mode === 'upload' && (
        <>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#E07B39' : value ? 'rgba(34,197,94,.5)' : '#2d3748'}`,
              borderRadius: 10,
              padding: '28px 20px',
              textAlign: 'center',
              cursor: uploading ? 'wait' : 'pointer',
              background: dragOver ? 'rgba(224,123,57,.06)' : '#0f1117',
              transition: 'all .2s',
            }}
          >
            {uploading ? (
              <div style={{ color: '#94a3b8', fontSize: '.88rem' }}>
                <span style={{ display: 'block', fontSize: '1.8rem', marginBottom: 8 }}>⏳</span>{a.uploading}
              </div>
            ) : value ? (
              <div style={{ color: '#4ade80', fontSize: '.85rem' }}>
                <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: 6 }}>✅</span>
                {a.uploadSuccess}<br />
                <span style={{ color: '#64748b', fontSize: '.75rem', wordBreak: 'break-all' }}>{value}</span><br />
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
          {required && (
            <input
              type="text"
              value={value}
              onChange={() => {}}
              required
              tabIndex={-1}
              aria-hidden
              style={{ opacity: 0, height: 0, width: 0, position: 'absolute', pointerEvents: 'none' }}
            />
          )}
        </>
      )}

      {value && !uploading && (
        <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', height: 160, background: '#0f1117' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      {error && (
        <p style={{ marginTop: 8, fontSize: '.8rem', color: '#f87171' }}>⚠️ {error}</p>
      )}
    </div>
  )
}

function IconPicker({ value, onChange, presets }: { value: string; onChange: (v: string) => void; presets: string[] }) {
  const { tr } = useLang()
  const a = tr.admin
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setMounted(true) }, [])

  const POPOVER_W = 300
  const POPOVER_H = 260

  useEffect(() => {
    if (!open) return
    function place() {
      const btn = btnRef.current
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      let left = r.left
      if (left + POPOVER_W > vw - 10) left = Math.max(10, vw - POPOVER_W - 10)
      let top = r.bottom + 6
      if (top + POPOVER_H > vh - 10) top = Math.max(10, r.top - POPOVER_H - 6)
      setCoords({ top, left })
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div style={{ position: 'relative', width: 60, flexShrink: 0 }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        title={a.iconPickerTitle}
        style={{
          width: '100%',
          height: 38,
          background: '#0f1117',
          border: `1px solid ${open ? '#E07B39' : '#2d3748'}`,
          borderRadius: 8,
          color: '#e2e8f0',
          fontSize: '1.35rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'border-color .15s',
        }}
      >
        {value || '🏷️'}
      </button>

      {mounted && open && coords && createPortal(
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,.35)',
              backdropFilter: 'blur(2px)',
              zIndex: 9998,
            }}
          />
          <div
            role="dialog"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
              background: '#1a1f2e',
              border: '1px solid #2d3748',
              borderRadius: 12,
              padding: 12,
              boxShadow: '0 20px 50px rgba(0,0,0,.6)',
              width: POPOVER_W,
              maxHeight: POPOVER_H,
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
              {a.iconPickerTitle}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 5, marginBottom: 12 }}>
              {presets.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { onChange(p); setOpen(false) }}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    border: `1.5px solid ${value === p ? '#E07B39' : 'transparent'}`,
                    background: value === p ? 'rgba(224,123,57,.18)' : '#0f1117',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    aspectRatio: '1 / 1',
                    transition: 'transform .1s, background .1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              autoFocus
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={a.iconPickerOther}
              style={{ ...inputBase, width: '100%', fontSize: '.9rem', padding: '8px 10px' }}
            />
          </div>
        </>,
        document.body,
      )}
    </div>
  )
}
