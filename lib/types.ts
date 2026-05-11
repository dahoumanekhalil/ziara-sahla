export interface OfferMeta {
  icon: string
  label: string
}

export interface OfferInclus {
  ico: string
  txt: string
}

export interface OfferProgramme {
  j: string
  titre: string
  desc: string
}

export interface Offer {
  id: string
  title: string
  img: string
  cat: string
  dur: string
  desc: string
  meta: OfferMeta[]
  inclus: OfferInclus[]
  programme: OfferProgramme[]
}
