import { randomUUID } from 'crypto'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { put, list } from '@vercel/blob'
import type { Offer } from './types'

const PATHNAME = 'data/offers.json'
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

async function read(): Promise<Offer[]> {
  if (USE_BLOB) {
    const { blobs } = await list({ prefix: PATHNAME })
    const blob = blobs.find(b => b.pathname === PATHNAME)
    if (!blob) return []
    const res = await fetch(blob.url, { cache: 'no-store' })
    return res.json()
  }
  try {
    const data = await readFile(join(process.cwd(), PATHNAME), 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function write(offers: Offer[]): Promise<void> {
  if (USE_BLOB) {
    await put(PATHNAME, JSON.stringify(offers, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return
  }
  const filePath = join(process.cwd(), PATHNAME)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(offers, null, 2), 'utf-8')
}

export async function getOffers(): Promise<Offer[]> {
  return read()
}

export async function addOffer(data: Omit<Offer, 'id'>): Promise<Offer> {
  const offers = await read()
  const offer: Offer = { id: randomUUID(), ...data }
  offers.push(offer)
  await write(offers)
  return offer
}

export async function deleteOffer(id: string): Promise<boolean> {
  const offers = await read()
  const next = offers.filter(o => o.id !== id)
  if (next.length === offers.length) return false
  await write(next)
  return true
}

export async function updateOffer(id: string, data: Partial<Omit<Offer, 'id'>>): Promise<Offer | null> {
  const offers = await read()
  const idx = offers.findIndex(o => o.id === id)
  if (idx === -1) return null
  offers[idx] = { ...offers[idx], ...data }
  await write(offers)
  return offers[idx]
}
