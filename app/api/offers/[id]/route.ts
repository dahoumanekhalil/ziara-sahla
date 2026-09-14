import { NextRequest, NextResponse } from 'next/server'
import { deleteOffer, updateOffer } from '@/lib/offers'
import { verifySessionToken } from '@/lib/auth'

function requireAuth(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  return verifySessionToken(token)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!requireAuth(req)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id } = await params
    const deleted = await deleteOffer(id)
    if (!deleted) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/offers/[id]]', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Échec de la suppression: ${message}` }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!requireAuth(req)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const { id } = await params
    const body = await req.json()
    const updated = await updateOffer(id, body)
    if (!updated) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/offers/[id]]', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Échec de la modification: ${message}` }, { status: 500 })
  }
}
