import { NextRequest, NextResponse } from 'next/server'
import { sendQuoteEmails } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { prenom, nom, email, tel, groupe, formule, msg } = body

  if (!prenom || !nom || !email || !groupe) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 })
  }

  try {
    await sendQuoteEmails({ prenom, nom, email, tel, groupe, formule, msg })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as { message?: string; code?: string }
    console.error('[Contact] SMTP error — host:', process.env.SMTP_HOST, 'port:', process.env.SMTP_PORT, 'user:', process.env.SMTP_USER)
    console.error('[Contact] Error:', e?.message, 'Code:', e?.code)
    return NextResponse.json({
      error: 'Erreur lors de l\'envoi — réessayez ou contactez-nous sur WhatsApp.',
      detail: process.env.NODE_ENV === 'development' ? e?.message : undefined,
    }, { status: 500 })
  }
}
