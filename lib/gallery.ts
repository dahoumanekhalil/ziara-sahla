import { randomUUID } from 'crypto'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { put, list } from '@vercel/blob'

export interface GalleryImage {
  id: string
  src: string
  alt: string
  label: string
  category: string
}

const PATHNAME = 'data/gallery.json'
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

async function read(): Promise<GalleryImage[]> {
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

async function write(images: GalleryImage[]): Promise<void> {
  if (USE_BLOB) {
    await put(PATHNAME, JSON.stringify(images, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return
  }
  const filePath = join(process.cwd(), PATHNAME)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(images, null, 2), 'utf-8')
}

export async function getGallery(): Promise<GalleryImage[]> {
  return read()
}

export async function addGalleryImage(data: Omit<GalleryImage, 'id'>): Promise<GalleryImage> {
  const images = await read()
  const image: GalleryImage = { id: randomUUID(), ...data }
  images.push(image)
  await write(images)
  return image
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const images = await read()
  const next = images.filter(img => img.id !== id)
  if (next.length === images.length) return false
  await write(next)
  return true
}
