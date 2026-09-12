import { randomUUID } from 'crypto'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { put, list } from '@vercel/blob'

export type CategoryKind = 'offer' | 'gallery'

export interface Category {
  id: string
  name: string
  kind: CategoryKind
  emoji: string
  hidden: boolean
}

const PATHNAME = 'data/categories.json'
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

const DEFAULT_SEED: Array<Omit<Category, 'id'>> = [
  { name: 'sahara', kind: 'offer', emoji: '🏜️', hidden: false },
  { name: 'culture', kind: 'offer', emoji: '🏛️', hidden: false },
  { name: 'premium', kind: 'offer', emoji: '👑', hidden: false },
  { name: 'corporate', kind: 'offer', emoji: '🏢', hidden: false },
  { name: 'sahara', kind: 'gallery', emoji: '🏜️', hidden: false },
  { name: 'ghardaia', kind: 'gallery', emoji: '🕌', hidden: false },
  { name: 'hotels', kind: 'gallery', emoji: '🏨', hidden: false },
  { name: 'culture', kind: 'gallery', emoji: '🎭', hidden: false },
  { name: 'autre', kind: 'gallery', emoji: '📷', hidden: false },
]

async function readRaw(): Promise<Category[] | null> {
  if (USE_BLOB) {
    const { blobs } = await list({ prefix: PATHNAME })
    const blob = blobs.find(b => b.pathname === PATHNAME)
    if (!blob) return null
    const res = await fetch(blob.url, { cache: 'no-store' })
    return res.json()
  }
  try {
    const data = await readFile(join(process.cwd(), PATHNAME), 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

async function write(cats: Category[]): Promise<void> {
  if (USE_BLOB) {
    await put(PATHNAME, JSON.stringify(cats, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return
  }
  const filePath = join(process.cwd(), PATHNAME)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(cats, null, 2), 'utf-8')
}

export async function getCategories(): Promise<Category[]> {
  const raw = await readRaw()
  if (raw && raw.length) return raw
  const seeded: Category[] = DEFAULT_SEED.map(c => ({ id: randomUUID(), ...c }))
  await write(seeded)
  return seeded
}

export async function addCategory(data: Omit<Category, 'id' | 'hidden'> & { hidden?: boolean }): Promise<Category | { error: string }> {
  const name = data.name.trim().toLowerCase()
  if (!name) return { error: 'Nom requis' }
  if (data.kind !== 'offer' && data.kind !== 'gallery') return { error: 'Type invalide' }
  const cats = await getCategories()
  if (cats.some(c => c.kind === data.kind && c.name === name)) {
    return { error: 'Cette catégorie existe déjà' }
  }
  const cat: Category = {
    id: randomUUID(),
    name,
    kind: data.kind,
    emoji: data.emoji || '🏷️',
    hidden: data.hidden ?? false,
  }
  cats.push(cat)
  await write(cats)
  return cat
}

export async function deleteCategory(id: string): Promise<boolean> {
  const cats = await getCategories()
  const next = cats.filter(c => c.id !== id)
  if (next.length === cats.length) return false
  await write(next)
  return true
}

export async function updateCategory(id: string, patch: Partial<Pick<Category, 'hidden' | 'emoji'>>): Promise<Category | null> {
  const cats = await getCategories()
  const idx = cats.findIndex(c => c.id === id)
  if (idx === -1) return null
  cats[idx] = { ...cats[idx], ...patch }
  await write(cats)
  return cats[idx]
}
