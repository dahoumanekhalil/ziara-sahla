import { NextRequest, NextResponse } from 'next/server'
import { getServices, replaceServices } from '@/lib/services'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  const cards = await getServices()
  return NextResponse.json(cards)
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const body = await req.json()
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'Format invalide' }, { status: 400 })
  }
  const next = await replaceServices(body)
  return NextResponse.json(next)
}
