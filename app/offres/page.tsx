import { getOffers } from '@/lib/offers'
import OffresClient from './OffresClient'

export const dynamic = 'force-dynamic'

export default async function OffresPage() {
  const offers = await getOffers()
  return <OffresClient offers={offers} />
}
