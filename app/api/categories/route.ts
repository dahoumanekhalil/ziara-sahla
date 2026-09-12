import { NextRequest, NextResponse } from 'next/server'
import { getCategories, addCategory } from '@/lib/categories'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  const cats = await getCategories()
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { name, kind, emoji } = body
  if (!name || !kind) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const result = await addCategory({ name, kind, emoji })
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json(result, { status: 201 })
}
