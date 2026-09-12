import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken } from '@/lib/auth'
import { getOffers } from '@/lib/offers'
import { getGallery } from '@/lib/gallery'
import { getCategories } from '@/lib/categories'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const jar = await cookies()
  const token = jar.get('admin_session')?.value
  if (!verifySessionToken(token)) redirect('/admin/login')

  const [offers, gallery, categories] = await Promise.all([
    getOffers(),
    getGallery(),
    getCategories(),
  ])
  return <AdminClient initialOffers={offers} initialGallery={gallery} initialCategories={categories} />
}
