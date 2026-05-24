import { NextRequest, NextResponse } from 'next/server'
import { deleteGalleryImage } from '@/lib/gallery'
import { verifySessionToken } from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const ok = await deleteGalleryImage(id)
  if (!ok) return NextResponse.json({ error: 'Image introuvable' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
