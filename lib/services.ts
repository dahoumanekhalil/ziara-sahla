import { randomUUID } from 'crypto'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { put, list, USE_BLOB } from './blob'
import type { MLString } from './types'

export type ServiceIconClass = 'ci-eco' | 'ci-mid' | 'ci-prem'

export interface ServiceCard {
  id: string
  img: string
  icon: string
  iconClass: ServiceIconClass
  label: MLString
  title: MLString
  desc: MLString
  feats: MLString[]
  ribbon?: MLString
  featured?: boolean
}

const PATHNAME = 'data/services.json'

const ml = (fr: string, en: string, ar: string): MLString => ({ fr, en, ar })

export const DEFAULT_SERVICES: ServiceCard[] = [
  {
    id: 'svc-eco',
    img: '/assets/hotels/exterior.jpg',
    icon: '🌿',
    iconClass: 'ci-eco',
    label: ml('Formule 01', 'Package 01', 'الباقة ٠١'),
    title: ml('Essentiel', 'Economy', 'اقتصادية'),
    desc: ml(
      "L'essentiel de l'Algérie pour les groupes soucieux du budget. Confort simple, authenticité totale.",
      'The essentials of Algeria for budget-conscious groups. Simple comfort, total authenticity.',
      'أساسيات الجزائر للمجموعات المهتمة بالميزانية. راحة بسيطة وأصالة كاملة.',
    ),
    feats: [
      ml('Hébergement 2 étoiles', '2-star accommodation', 'إقامة نجمتين'),
      ml('Transport bus climatisé', 'Air-conditioned bus', 'حافلة مكيفة'),
      ml('Guide francophone', 'French-speaking guide', 'مرشد ناطق بالفرنسية'),
      ml('Repas traditionnels inclus', 'Traditional meals included', 'وجبات تقليدية مشمولة'),
      ml('Assistance 7j/7', '7/7 assistance', 'مساعدة ٧/٧'),
    ],
  },
  {
    id: 'svc-mid',
    img: '/assets/hotels/algiers-marriott-hotel.jpg',
    icon: '✨',
    iconClass: 'ci-mid',
    featured: true,
    ribbon: ml('Populaire', 'Popular', 'الأكثر طلبًا'),
    label: ml('Formule 02', 'Package 02', 'الباقة ٠٢'),
    title: ml('Confort', 'Intermediate', 'مريحة'),
    desc: ml(
      'Le parfait équilibre entre confort et immersion culturelle. Notre formule la plus demandée.',
      'The perfect balance between comfort and cultural immersion. Our most popular package.',
      'التوازن المثالي بين الراحة والانغماس الثقافي. باقتنا الأكثر طلبًا.',
    ),
    feats: [
      ml('Hébergement 3-4 étoiles', '3-4 star accommodation', 'إقامة ٣-٤ نجوم'),
      ml('Transport privé VIP', 'Private VIP transport', 'نقل خاص VIP'),
      ml('Guide expert bilingue', 'Expert bilingual guide', 'مرشد خبير ثنائي اللغة'),
      ml('Excursions culturelles', 'Cultural excursions', 'رحلات ثقافية'),
      ml('Escorte sécuritaire incluse', 'Security escort included', 'مرافقة أمنية مشمولة'),
      ml('Assistance 24h/24', '24/7 assistance', 'مساعدة ٢٤/٧'),
    ],
  },
  {
    id: 'svc-prem',
    img: '/assets/hotels/sheraton-club-des-pins-resort-general-1267fc26.jpg',
    icon: '👑',
    iconClass: 'ci-prem',
    label: ml('Formule 03', 'Package 03', 'الباقة ٠٣'),
    title: ml('Premium', 'Premium', 'بريميوم'),
    desc: ml(
      "Une expérience d'exception, taillée sur mesure pour les groupes exigeants et les événements corporate.",
      'An exceptional experience, tailor-made for demanding groups and corporate events.',
      'تجربة استثنائية مصممة للمجموعات المتطلبة وفعاليات الشركات.',
    ),
    feats: [
      ml('Hébergement 4-5 étoiles', '4-5 star accommodation', 'إقامة ٤-٥ نجوم'),
      ml('Flotte de véhicules dédiés', 'Dedicated vehicle fleet', 'أسطول مركبات مخصص'),
      ml('Guide expert', 'Expert guide', 'مرشد خبير'),
      ml('Programme personnalisé', 'Personalized program', 'برنامج مخصص'),
      ml('Escorte VIP garantie', 'VIP escort guaranteed', 'مرافقة VIP مضمونة'),
      ml('Conciergerie dédiée', 'Dedicated concierge', 'خدمة استقبال مخصصة'),
    ],
  },
]

async function read(): Promise<ServiceCard[]> {
  if (USE_BLOB) {
    const { blobs } = await list({ prefix: PATHNAME })
    const blob = blobs.find(b => b.pathname === PATHNAME)
    if (!blob) return DEFAULT_SERVICES
    const res = await fetch(blob.url, { cache: 'no-store' })
    const parsed = await res.json()
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SERVICES
  }
  try {
    const data = await readFile(join(process.cwd(), PATHNAME), 'utf-8')
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SERVICES
  } catch {
    return DEFAULT_SERVICES
  }
}

async function write(cards: ServiceCard[]): Promise<void> {
  if (USE_BLOB) {
    await put(PATHNAME, JSON.stringify(cards, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    })
    return
  }
  const filePath = join(process.cwd(), PATHNAME)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(cards, null, 2), 'utf-8')
}

export async function getServices(): Promise<ServiceCard[]> {
  return read()
}

export async function replaceServices(cards: ServiceCard[]): Promise<ServiceCard[]> {
  const withIds = cards.map(c => ({ ...c, id: c.id || randomUUID() }))
  await write(withIds)
  return withIds
}
