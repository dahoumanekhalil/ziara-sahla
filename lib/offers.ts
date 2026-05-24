import { randomUUID } from 'crypto'
import { put, list } from '@vercel/blob'
import type { Offer } from './types'

const PATHNAME = 'data/offers.json'

async function read(): Promise<Offer[]> {
  const { blobs } = await list({ prefix: PATHNAME })
  const blob = blobs.find(b => b.pathname === PATHNAME)
  if (!blob) return []
  const res = await fetch(blob.url, { cache: 'no-store' })
  return res.json()
}

async function write(offers: Offer[]): Promise<void> {
  await put(PATHNAME, JSON.stringify(offers, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
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
