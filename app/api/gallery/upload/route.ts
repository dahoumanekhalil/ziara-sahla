import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { verifySessionToken } from '@/lib/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file || !file.size) {
    return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Format non supporté. Utilisez JPG, PNG, WebP ou GIF.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const uploadsDir = path.join(process.cwd(), 'public', 'assets', 'uploads')

  await mkdir(uploadsDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadsDir, filename), Buffer.from(bytes))

  return NextResponse.json({ src: `/assets/uploads/${filename}` })
}
