export type MLString = { fr: string; en: string; ar: string }

export interface OfferMeta {
  icon: string
  label: MLString
}

export interface OfferInclus {
  ico: string
  txt: MLString
}

export interface OfferProgramme {
  j: string
  titre: MLString
  desc: MLString
}

export interface Offer {
  id: string
  title: MLString
  img: string
  cat: string
  dur: MLString
  desc: MLString
  meta: OfferMeta[]
  inclus: OfferInclus[]
  programme: OfferProgramme[]
}
