'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error ?? 'Erreur de connexion')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div style={{ background: '#1a1f2e', borderRadius: 16, padding: '40px 36px', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🧭</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Ziara-Sahla Admin</h1>
            <p style={{ fontSize: '.875rem', color: '#64748b' }}>Connectez-vous pour gérer les offres</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={inputStyle}
                placeholder="admin"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '10px 14px', fontSize: '.875rem', color: '#f87171', marginBottom: 18 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 10, background: '#E07B39', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, transition: 'opacity .2s' }}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/" style={{ fontSize: '.8rem', color: '#475569' }}>← Retour au site</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#0f1117',
  border: '1px solid #2d3748',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: '1rem',
  outline: 'none',
}
