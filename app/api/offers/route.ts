import { NextRequest, NextResponse } from 'next/server'
import { getOffers, addOffer } from '@/lib/offers'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  const offers = getOffers()
  return NextResponse.json(offers)
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { title, img, cat, dur, desc, meta, inclus, programme } = body

  if (!title || !img || !cat || !dur || !desc) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const offer = addOffer({
    title,
    img,
    cat,
    dur,
    desc,
    meta: meta ?? [],
    inclus: inclus ?? [],
    programme: programme ?? [],
  })

  return NextResponse.json(offer, { status: 201 })
}
