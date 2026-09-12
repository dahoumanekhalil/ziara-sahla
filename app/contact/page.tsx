import { getContactInfo } from '@/lib/contact'
import ContactClient from './ContactClient'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const info = await getContactInfo()
  return <ContactClient info={info} />
}
