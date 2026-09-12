import { NextRequest, NextResponse } from 'next/server'
import { getGallery, addGalleryImage } from '@/lib/gallery'
import { getCategories } from '@/lib/categories'
import { verifySessionToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const [images, categories] = await Promise.all([getGallery(), getCategories()])
  // Admin gets the raw list; public gets hidden categories filtered out.
  const isAdmin = verifySessionToken(req.cookies.get('admin_session')?.value)
  if (isAdmin) return NextResponse.json(images)
  const hidden = new Set(
    categories.filter(c => c.kind === 'gallery' && c.hidden).map(c => c.name)
  )
  return NextResponse.json(images.filter(img => !hidden.has(img.category)))
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { src, alt, label, category } = body

  if (!src || !alt || !label || !category) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const image = await addGalleryImage({ src, alt, label, category })
  return NextResponse.json(image, { status: 201 })
}
