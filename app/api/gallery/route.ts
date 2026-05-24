import { NextRequest, NextResponse } from 'next/server'
import { getGallery, addGalleryImage } from '@/lib/gallery'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  const images = await getGallery()
  return NextResponse.json(images)
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
