import { getOffers } from '@/lib/offers'
import { getServices } from '@/lib/services'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [offers, services] = await Promise.all([getOffers(), getServices()])
  return <HomeClient offers={offers} services={services} />
}
