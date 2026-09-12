import { NextRequest, NextResponse } from 'next/server'
import { getContactInfo, updateContactInfo } from '@/lib/contact'
import { verifySessionToken } from '@/lib/auth'

export async function GET() {
  const info = await getContactInfo()
  return NextResponse.json(info)
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const body = await req.json()
  const next = await updateContactInfo(body)
  return NextResponse.json(next)
}
