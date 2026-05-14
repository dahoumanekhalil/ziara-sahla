'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Offer } from '@/lib/types'
import type { GalleryImage } from '@/lib/gallery'

const CATS = ['sahara', 'culture', 'premium', 'corporate']
const GALLERY_CATS = ['sahara', 'ghardaia', 'hotels', 'culture', 'autre']

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
  const [offers, setOffers] = useState<Offer[]>(initialOffers)
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery)
  const [form, setForm] = useState(emptyForm())
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm())
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [galleryMsg, setGalleryMsg] = useState('')
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
        setGalleryMsg('Image ajoutée avec succès !')
        setShowAddImage(false)
      } else {
        const data = await res.json()
        setGalleryMsg(data.error ?? 'Erreur lors de l\'ajout')
      }
    } catch {
      setGalleryMsg('Erreur réseau')
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
        setGalleryMsg(data.error ?? 'Erreur lors de l\'upload')
      }
    } catch {
      setGalleryMsg('Erreur réseau')
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
    if (!confirm('Supprimer cette image ?')) return
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setGallery(g => g.filter(x => x.id !== id))
    }
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
          {(['list', 'add', 'gallery'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg(''); setGalleryMsg('') }}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.875rem', background: tab === t ? '#E07B39' : 'transparent', color: tab === t ? '#fff' : '#94a3b8', transition: 'all .2s' }}
            >
              {t === 'list' ? `Offres (${offers.length})` : t === 'add' ? '+ Ajouter une offre' : `🖼 Galerie (${gallery.length})`}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{ background: msg.includes('succès') ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${msg.includes('succès') ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: msg.includes('succès') ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
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

        {/* ── Add offer form ── */}
        {tab === 'add' && (
          <form onSubmit={handleAdd} style={{ display: 'grid', gap: 28 }}>
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

        {/* ── Gallery tab ── */}
        {tab === 'gallery' && (
          <div>
            {galleryMsg && (
              <div style={{ background: galleryMsg.includes('succès') ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${galleryMsg.includes('succès') ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: galleryMsg.includes('succès') ? '#4ade80' : '#f87171', fontSize: '.875rem' }}>
                {galleryMsg}
              </div>
            )}

            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              {/* Category filters */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['all', ...GALLERY_CATS].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCatFilter(cat)}
                    style={{ padding: '5px 14px', borderRadius: 100, border: `1px solid ${galleryCatFilter === cat ? '#E07B39' : '#2d3748'}`, cursor: 'pointer', fontSize: '.78rem', fontWeight: 600, background: galleryCatFilter === cat ? '#E07B39' : '#1a1f2e', color: galleryCatFilter === cat ? '#fff' : '#94a3b8', transition: 'all .2s' }}
                  >
                    {cat === 'all' ? `Tout (${gallery.length})` : `${galleryEmoji(cat)} ${cat} (${gallery.filter(g => g.category === cat).length})`}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddImage(v => !v)}
                style={{ padding: '8px 18px', background: showAddImage ? 'rgba(224,123,57,.15)' : '#E07B39', color: showAddImage ? '#E07B39' : '#fff', border: `1px solid ${showAddImage ? 'rgba(224,123,57,.4)' : '#E07B39'}`, borderRadius: 8, fontWeight: 700, fontSize: '.875rem', cursor: 'pointer', transition: 'all .2s' }}
              >
                {showAddImage ? '✕ Annuler' : '+ Ajouter une image'}
              </button>
            </div>

            {/* Add image form */}
            {showAddImage && (
              <form onSubmit={handleAddImage} style={{ ...sectionStyle, marginBottom: 24 }}>
                <h2 style={{ ...sectionTitle, marginBottom: 20 }}>Nouvelle image</h2>

                {/* Mode toggle */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 18, background: '#0f1117', borderRadius: 8, padding: 3, width: 'fit-content' }}>
                  {(['url', 'upload'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => { setImgMode(mode); setGalleryForm(f => ({ ...f, src: '' })) }}
                      style={{ padding: '7px 18px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '.82rem', background: imgMode === mode ? '#E07B39' : 'transparent', color: imgMode === mode ? '#fff' : '#64748b', transition: 'all .18s' }}
                    >
                      {mode === 'url' ? '🔗 Lien URL' : '📁 Depuis le PC'}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={{ gridColumn: '1 / -1' }}>

                    {/* ── URL mode ── */}
                    {imgMode === 'url' && (
                      <>
                        <Label>URL de l'image *</Label>
                        <Input
                          value={galleryForm.src}
                          onChange={v => setGalleryForm(f => ({ ...f, src: v }))}
                          placeholder="https://example.com/photo.jpg"
                          required
                        />
                      </>
                    )}

                    {/* ── Upload mode ── */}
                    {imgMode === 'upload' && (
                      <>
                        <Label>Fichier image *</Label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileInput}
                        />
                        <div
                          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() => !uploading && fileInputRef.current?.click()}
                          style={{
                            border: `2px dashed ${dragOver ? '#E07B39' : galleryForm.src ? 'rgba(34,197,94,.5)' : '#2d3748'}`,
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
                              <span style={{ display: 'block', fontSize: '1.8rem', marginBottom: 8 }}>⏳</span>
                              Téléchargement en cours…
                            </div>
                          ) : galleryForm.src ? (
                            <div style={{ color: '#4ade80', fontSize: '.85rem' }}>
                              <span style={{ fontSize: '1.6rem', display: 'block', marginBottom: 6 }}>✅</span>
                              Fichier uploadé avec succès
                              <br />
                              <span style={{ color: '#64748b', fontSize: '.75rem', wordBreak: 'break-all' }}>{galleryForm.src}</span>
                              <br />
                              <span style={{ color: '#E07B39', fontSize: '.78rem', marginTop: 6, display: 'inline-block' }}>Cliquer pour changer</span>
                            </div>
                          ) : (
                            <div style={{ color: '#64748b', fontSize: '.88rem' }}>
                              <span style={{ display: 'block', fontSize: '2rem', marginBottom: 8 }}>🖼️</span>
                              <span style={{ color: '#E07B39', fontWeight: 600 }}>Cliquez pour parcourir</span> ou glissez une image ici
                              <br />
                              <span style={{ fontSize: '.75rem', marginTop: 6, display: 'inline-block' }}>JPG, PNG, WebP, GIF — max 10 Mo</span>
                            </div>
                          )}
                        </div>
                        {/* hidden input to satisfy required validation when uploaded */}
                        <input type="text" value={galleryForm.src} onChange={() => {}} required style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} />
                      </>
                    )}

                    {/* Preview */}
                    {galleryForm.src && !uploading && (
                      <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', height: 140, background: '#0f1117', position: 'relative' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={galleryForm.src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Texte alternatif (SEO) *</Label>
                    <Input value={galleryForm.alt} onChange={v => setGalleryForm(f => ({ ...f, alt: v }))} placeholder="Description de l'image" required />
                  </div>
                  <div>
                    <Label>Légende (affichée en galerie) *</Label>
                    <Input value={galleryForm.label} onChange={v => setGalleryForm(f => ({ ...f, label: v }))} placeholder="Dunes au coucher de soleil" required />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Label>Catégorie *</Label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {GALLERY_CATS.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setGalleryForm(f => ({ ...f, category: cat }))}
                          style={{ padding: '6px 16px', borderRadius: 100, border: `1.5px solid ${galleryForm.category === cat ? galleryCatHex(cat) : '#2d3748'}`, background: galleryForm.category === cat ? galleryCatHex(cat) + '22' : 'transparent', color: galleryForm.category === cat ? galleryCatHex(cat) : '#94a3b8', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer', transition: 'all .15s' }}
                        >
                          {galleryEmoji(cat)} {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    style={{ padding: '10px 26px', background: '#E07B39', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '.9rem', cursor: (saving || uploading) ? 'not-allowed' : 'pointer', opacity: (saving || uploading) ? .7 : 1 }}
                  >
                    {saving ? 'Ajout…' : '✓ Ajouter à la galerie'}
                  </button>
                </div>
              </form>
            )}

            {/* Image grid */}
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
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      style={{ width: '100%', padding: '6px 0', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 6, color: '#f87171', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
              ))}
              {filteredGallery.length === 0 && (
                <p style={{ color: '#475569', gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>
                  Aucune image {galleryCatFilter !== 'all' ? `dans la catégorie "${galleryCatFilter}"` : ''}. Ajoutez-en une !
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function catColor(cat: string) {
  const map: Record<string, string> = { sahara: '#b45309', culture: '#1d4ed8', premium: '#7c3aed', corporate: '#065f46' }
  return map[cat] ?? '#374151'
}

function galleryCatHex(cat: string) {
  const map: Record<string, string> = {
    sahara: '#E07B39',
    ghardaia: '#1d4ed8',
    hotels: '#7c3aed',
    culture: '#059669',
    autre: '#64748b',
  }
  return map[cat] ?? '#64748b'
}

function galleryEmoji(cat: string) {
  const map: Record<string, string> = {
    sahara: '🏜️',
    ghardaia: '🕌',
    hotels: '🏨',
    culture: '🎭',
    autre: '📷',
  }
  return map[cat] ?? '📷'
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
