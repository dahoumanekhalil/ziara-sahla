import { getOffers } from '@/lib/offers'
import { getCategories } from '@/lib/categories'
import OffresClient from './OffresClient'

export const dynamic = 'force-dynamic'

export default async function OffresPage() {
  const [offers, categories] = await Promise.all([getOffers(), getCategories()])
  const hiddenOfferCats = new Set(
    categories.filter(c => c.kind === 'offer' && c.hidden).map(c => c.name)
  )
  const visibleOffers = offers.filter(o => !hiddenOfferCats.has(o.cat))
  return <OffresClient offers={visibleOffers} hiddenCats={[...hiddenOfferCats]} />
}
