import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export interface GalleryImage {
  id: string
  src: string
  alt: string
  label: string
  category: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'gallery.json')

export function getGallery(): GalleryImage[] {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as GalleryImage[]
}

function saveGallery(images: GalleryImage[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2), 'utf-8')
}

export function addGalleryImage(data: Omit<GalleryImage, 'id'>): GalleryImage {
  const images = getGallery()
  const image: GalleryImage = { id: randomUUID(), ...data }
  images.push(image)
  saveGallery(images)
  return image
}

export function deleteGalleryImage(id: string): boolean {
  const images = getGallery()
  const next = images.filter(img => img.id !== id)
  if (next.length === images.length) return false
  saveGallery(next)
  return true
}
