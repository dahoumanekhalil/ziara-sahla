import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { Offer } from './types'

const DATA_FILE = path.join(process.cwd(), 'data', 'offers.json')

export function getOffers(): Offer[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as Offer[]
}

function saveOffers(offers: Offer[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(offers, null, 2), 'utf-8')
}

export function addOffer(data: Omit<Offer, 'id'>): Offer {
  const offers = getOffers()
  const offer: Offer = { id: randomUUID(), ...data }
  offers.push(offer)
  saveOffers(offers)
  return offer
}

export function deleteOffer(id: string): boolean {
  const offers = getOffers()
  const next = offers.filter(o => o.id !== id)
  if (next.length === offers.length) return false
  saveOffers(next)
  return true
}

export function updateOffer(id: string, data: Partial<Omit<Offer, 'id'>>): Offer | null {
  const offers = getOffers()
  const idx = offers.findIndex(o => o.id === id)
  if (idx === -1) return null
  offers[idx] = { ...offers[idx], ...data }
  saveOffers(offers)
  return offers[idx]
}
