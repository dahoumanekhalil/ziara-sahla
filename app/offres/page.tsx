import { getOffers } from '@/lib/offers'
import OffresClient from './OffresClient'

export const dynamic = 'force-dynamic'

export default function OffresPage() {
  const offers = getOffers()
  return <OffresClient offers={offers} />
}
