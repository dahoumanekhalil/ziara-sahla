import { NextRequest, NextResponse } from 'next/server'
import { getOffers, addOffer } from '@/lib/offers'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  const offers = await getOffers()
  return NextResponse.json(offers)
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_session')?.value
    if (!verifySessionToken(token)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { title, img, cat, dur, desc, meta, inclus, nonInclus, programme } = body

    if (!title || !img || !dur || !desc) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const offer = await addOffer({
      title,
      img,
      cat: cat ?? '',
      dur,
      desc,
      meta: meta ?? [],
      inclus: inclus ?? [],
      nonInclus: nonInclus ?? [],
      programme: programme ?? [],
    })

    return NextResponse.json(offer, { status: 201 })
  } catch (err) {
    console.error('[POST /api/offers]', err)
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Échec de l'ajout: ${message}` }, { status: 500 })
  }
}
