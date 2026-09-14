import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { put, list, USE_BLOB } from './blob'

export interface ContactInfo {
  email: string
  phoneFr: string
  phoneDz: string
  addressFr: string
  addressDz: string
  facebookUrl: string
  instagramUrl: string
  linkedinUrl: string
  whatsappUrl: string
}

const PATHNAME = 'data/contact.json'

export const DEFAULT_CONTACT: ContactInfo = {
  email: 'contact@ziara-sahla.com',
  phoneFr: '+33 761832197',
  phoneDz: '+213 557 61 06 60',
  addressFr: 'Paris, France',
  addressDz: 'Alger, Algérie',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  whatsappUrl: 'https://wa.me/213557610660',
}

async function read(): Promise<ContactInfo> {
  if (USE_BLOB) {
    const { blobs } = await list({ prefix: PATHNAME })
    const blob = blobs.find(b => b.pathname === PATHNAME)
    if (!blob) return DEFAULT_CONTACT
    const res = await fetch(blob.url, { cache: 'no-store' })
    const parsed = await res.json()
    return { ...DEFAULT_CONTACT, ...parsed }
  }
  try {
    const data = await readFile(join(process.cwd(), PATHNAME), 'utf-8')
    const parsed = JSON.parse(data)
    return { ...DEFAULT_CONTACT, ...parsed }
  } catch {
    return DEFAULT_CONTACT
  }
}

async function write(info: ContactInfo): Promise<void> {
  if (USE_BLOB) {
    await put(PATHNAME, JSON.stringify(info, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return
  }
  const filePath = join(process.cwd(), PATHNAME)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(info, null, 2), 'utf-8')
}

export async function getContactInfo(): Promise<ContactInfo> {
  return read()
}

export async function updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
  const current = await read()
  const next = { ...current, ...data }
  await write(next)
  return next
}
