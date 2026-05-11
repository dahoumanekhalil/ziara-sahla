import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken } from '@/lib/auth'
import { getOffers } from '@/lib/offers'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const jar = await cookies()
  const token = jar.get('admin_session')?.value
  if (!verifySessionToken(token)) redirect('/admin/login')

  const offers = getOffers()
  return <AdminClient initialOffers={offers} />
}
