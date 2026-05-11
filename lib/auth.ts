import crypto from 'crypto'

const SECRET = process.env.SESSION_SECRET ?? 'ziara-sahla-dev-secret'
const ADMIN_USER = process.env.ADMIN_USERNAME ?? 'admin'
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? 'ziara2026'

export function verifyCredentials(username: string, password: string): boolean {
  const userOk = username === ADMIN_USER
  const passOk = password === ADMIN_PASS
  return userOk && passOk
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ admin: true, ts: Date.now() })
  const b64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  return `${b64}.${sig}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const dot = token.lastIndexOf('.')
  if (dot === -1) return false
  const b64 = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
}
