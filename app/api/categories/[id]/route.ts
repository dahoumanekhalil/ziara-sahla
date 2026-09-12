import { NextRequest, NextResponse } from 'next/server'
import { deleteCategory, updateCategory } from '@/lib/categories'
import { verifySessionToken } from '@/lib/auth'

function requireAuth(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  return verifySessionToken(token)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const { id } = await params
  const deleted = await deleteCategory(id)
  if (!deleted) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  const patch: { hidden?: boolean; emoji?: string } = {}
  if (typeof body.hidden === 'boolean') patch.hidden = body.hidden
  if (typeof body.emoji === 'string') patch.emoji = body.emoji
  const updated = await updateCategory(id, patch)
  if (!updated) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json(updated)
}
