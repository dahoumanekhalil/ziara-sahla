"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Lang = "fr" | "en" | "ar";

export interface Translations {
  nav: {
    about: string;
    circuits: string;
    offers: string;
    gallery: string;
    contact: string;
    quote: string;
  };
  hero: {
    eyebrow: string;
    title1: string;
    title2: string;
    sub: string;
    cta1: string;
    cta2: string;
    stat1: string;
    stat2: string;
    stat3: string;
    discover: string;
  };
  about: {
    badge: string;
    title: string;
    sub: string;
    feat1: { title: string; desc: string };
    feat2: { title: string; desc: string };
    feat3: { title: string; desc: string };
    feat4: { title: string; desc: string };
    cert: string;
    certSub: string;
  };
  services: {
    badge: string;
    title: string;
    sub: string;
    card1: { label: string; title: string; desc: string };
    card2: { label: string; title: string; desc: string; ribbon: string };
    card3: { label: string; title: string; desc: string };
    priceLabel: string;
    moreBtn: string;
    feats1: string[];
    feats2: string[];
    feats3: string[];
  };
  trust: {
    badge: string;
    title: string;
    sub: string;
    cards: { title: string; desc: string }[];
  };
  why: {
    badge: string;
    title: string;
    items: { title: string; desc: string }[];
    quote: string;
  };
  gallery: {
    badge: string;
    title: string;
    sub: string;
    viewAll: string;
    organize: string;
  };
  cta: {
    flag: string;
    title: string;
    sub: string;
    btn1: string;
    btn2: string;
    urgency: string;
  };
  footer: {
    about: string;
    navTitle: string;
    formulasTitle: string;
    contactTitle: string;
    nav: {
      about: string;
      circuits: string;
      offers: string;
      why: string;
      gallery: string;
      contact: string;
    };
    formulas: string[];
    rights: string;
    legal: string;
    privacy: string;
    cgv: string;
  };
  sidebar: {
    about: string;
    circuits: string;
    security: string;
    why: string;
    offers: string;
    gallery: string;
    contact: string;
    quoteBtn: string;
  };
  contactPage: {
    badge: string;
    title: string;
    sub: string;
    infoTitle: string;
    intro: string;
    emailLabel: string;
    emailSub: string;
    phoneFrLabel: string;
    phoneFrSub: string;
    phoneDzLabel: string;
    phoneDzSub: string;
    officesLabel: string;
    officesTitle: string;
    socialLabel: string;
    responseBadge: string;
    formTitle: string;
    formSub: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    groupSize: string;
    subject: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    successTitle: string;
    successMsg: string;
    groupOptions: string[];
    subjectOptions: string[];
    office1Title: string;
    office1Desc: string;
    office2Title: string;
    office2Desc: string;
  };
  galleryPage: {
    badge: string;
    title: string;
    sub: string;
    saharaBadge: string;
    saharaTitle: string;
    saharaSub: string;
    ghardaiaBadge: string;
    ghardaiaTitle: string;
    ghardaiaSub: string;
    hotelsBadge: string;
    hotelsTitle: string;
    hotelsSub: string;
    ctaTitle: string;
    ctaSub: string;
    ctaBtn1: string;
    ctaBtn2: string;
  };
  offresPage: {
    badge: string;
    title: string;
    sub: string;
    filters: { key: string; label: string }[];
    priceSahara: string;
    pricePremium: string;
    priceCorporate: string;
    priceDefault: string;
    priceValue: string;
    perPerson: string;
    detailBtn: string;
    quoteBtn: string;
    statusSahara: string;
    statusPremium: string;
    statusCorporate: string;
    customTitle: string;
    customSub: string;
    customBtn: string;
    contactBtn: string;
    aboutCircuit: string;
    includedLabel: string;
    programLabel: string;
    fromLabel: string;
    closeBtn: string;
    sendQuote: string;
  };
  modal: {
    title: string;
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    groupSize: string;
    formula: string;
    project: string;
    projectPlaceholder: string;
    submit: string;
    successMsg: string;
    groupOptions: string[];
    formulaOptions: string[];
  };
  offresModal: {
    title: string;
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    groupSize: string;
    desiredOffer: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    successMsg: string;
    groupOptions: string[];
  };
}

const t: Record<Lang, Translations> = {
  fr: {
    nav: {
      about: "À propos",
      circuits: "Circuits",
      offers: "Nos offres",
      gallery: "Galerie",
      contact: "Contact",
      quote: "Devis gratuit",
    },
    hero: {
      eyebrow: "Voyages culturels de groupe en Algérie",
      title1: "L'Algérie authentique,",
      title2: "organisée pour vous.",
      sub: "Ziara-Sahla conçoit des circuits culturels sur mesure pour groupes, associations et entreprises européennes. Sécurisés, immersifs et inoubliables.",
      cta1: "Demandez un devis",
      cta2: "Découvrir nos circuits",
      stat1: "Groupes accompagnés",
      stat2: "Wilayates couvertes",
      stat3: "Sécurisé & assuré",
      discover: "Découvrir",
    },
    about: {
      badge: "Qui sommes-nous",
      title: "L'expertise franco-algérienne au service de votre voyage",
      sub: "Fondée par une équipe binationale passionnée, Ziara-Sahla est votre pont entre l'Europe et l'âme profonde de l'Algérie. Nous ne vendons pas des voyages — nous créons des expériences mémorables, en toute sécurité.",
      feat1: { title: "Bilinguisme total", desc: "Guides francophones natifs" },
      feat2: { title: "Sécurité garantie", desc: "Escorte policière 24h/24" },
      feat3: { title: "Logistique complète", desc: "Hôtels, transport, repas" },
      feat4: { title: "Sur mesure", desc: "Adapté à chaque groupe" },
      cert: "Agréé & certifié",
      certSub: "Opérateur touristique officiel",
    },
    services: {
      badge: "Nos circuits",
      title: "Choisissez votre formule de voyage",
      sub: "Trois niveaux d'expérience, une seule promesse : authenticité et sécurité.",
      card1: {
        label: "Formule 01",
        title: "Économique",
        desc: "L'essentiel de l'Algérie pour les groupes soucieux du budget. Confort simple, authenticité totale.",
      },
      card2: {
        label: "Formule 02",
        title: "Intermédiaire",
        desc: "Le parfait équilibre entre confort et immersion culturelle. Notre formule la plus demandée.",
        ribbon: "Populaire",
      },
      card3: {
        label: "Formule 03",
        title: "Premium",
        desc: "Une expérience d'exception, taillée sur mesure pour les groupes exigeants et les événements corporate.",
      },
      priceLabel: "Sur devis",
      moreBtn: "En savoir plus →",
      feats1: [
        "Hébergement 2-3 étoiles",
        "Transport bus climatisé",
        "Guide francophone",
        "Repas traditionnels inclus",
        "Assistance 7j/7",
      ],
      feats2: [
        "Hébergement 3-4 étoiles",
        "Transport privé VIP",
        "Guide expert bilingue",
        "Excursions culturelles",
        "Escorte sécuritaire incluse",
        "Assistance 24h/24",
      ],
      feats3: [
        "Hébergement 4-5 étoiles",
        "Flotte de véhicules dédiés",
        "Guide expert + interprète",
        "Programme personnalisé",
        "Escorte VIP garantie",
        "Conciergerie dédiée",
      ],
    },
    trust: {
      badge: "Confiance & Sécurité",
      title: "Votre sécurité est notre priorité absolue",
      sub: "Chaque circuit est organisé avec le plus haut niveau de sécurité pour vous offrir une sérénité totale.",
      cards: [
        {
          title: "Escorte policière",
          desc: "Chaque groupe bénéficie d'une escorte officielle des forces de l'ordre algériennes sur tout le parcours.",
        },
        {
          title: "Assistance 24h/24",
          desc: "Une équipe dédiée disponible à toute heure, urgences médicales incluses.",
        },
        {
          title: "Logistique maîtrisée",
          desc: "Transport, hébergements, restauration et activités — tout planifié avant votre arrivée.",
        },
        {
          title: "Couverture médicale",
          desc: "Partenariat avec des structures médicales locales. Médecin référent disponible pour les longs séjours.",
        },
        {
          title: "Accréditation officielle",
          desc: "Opérateur agréé par le Ministère du Tourisme algérien. Vos droits sont protégés.",
        },
        {
          title: "Assurance incluse",
          desc: "Chaque participant est couvert par une assurance rapatriement et responsabilité civile complète.",
        },
      ],
    },
    why: {
      badge: "Pourquoi nous choisir",
      title: "Ce qui fait de nous votre meilleur partenaire voyage",
      items: [
        {
          title: "Double culture, double expertise",
          desc: "Notre équipe binationale comprend vos attentes européennes et connaît l'Algérie comme sa poche. Aucune mauvaise surprise.",
        },
        {
          title: "Circuits hors des sentiers battus",
          desc: "Sahara, Tassili, Ghardaïa, Béjaïa, Tipaza… Nous ouvrons des portes que les agences ordinaires n'osent pas franchir.",
        },
        {
          title: "Tout inclus, zéro stress",
          desc: "De votre arrivée à l'aéroport jusqu'à votre départ, tout est pris en charge. Vous profitez, nous gérons.",
        },
        {
          title: "Idéal pour entreprises & associations",
          desc: "Teambuilding, voyages d'études, retraites associatives — nous avons l'expertise pour tous les profils de groupe.",
        },
        {
          title: "Transparence totale des prix",
          desc: "Devis détaillé sans surprise. Vous savez exactement ce que vous payez et ce que vous recevez.",
        },
      ],
      quote:
        "Un voyage en Algérie avec Ziara Sahla, c'est bien plus qu'un circuit — c'est une rencontre avec une civilisation millénaire.",
    },
    gallery: {
      badge: "Galerie",
      title: "L'Algérie vue par nos voyageurs",
      sub: "Des paysages à couper le souffle qui ne demandent qu'à être vécus de l'intérieur.",
      viewAll: "Voir toute la galerie →",
      organize: "Organiser votre voyage",
    },
    cta: {
      flag: "Disponible maintenant",
      title: "Prêt à vivre l'Algérie autrement ?",
      sub: "Demandez votre devis personnalisé gratuitement. Notre équipe vous répond sous 24h.",
      btn1: "Demandez votre devis sur WhatsApp",
      btn2: "Discuter directement",
      urgency: "🗓️ Places limitées — Saison 2026 en cours de remplissage",
    },
    footer: {
      about:
        "Votre spécialiste des voyages culturels de groupe en Algérie. Sécurisés, authentiques et inoubliables depuis plus de 10 ans.",
      navTitle: "Navigation",
      formulasTitle: "Formules",
      contactTitle: "Contact",
      nav: {
        about: "À propos",
        circuits: "Nos circuits",
        offers: "Nos offres",
        why: "Pourquoi nous",
        gallery: "Galerie",
        contact: "Contact",
      },
      formulas: [
        "Circuit Économique",
        "Circuit Intermédiaire",
        "Circuit Premium",
        "Sur mesure groupes",
        "Entreprises & CE",
      ],
      rights: "© 2026 Ziara-Sahla. Tous droits réservés.",
      legal: "Mentions légales",
      privacy: "Confidentialité",
      cgv: "CGV",
    },
    sidebar: {
      about: "À propos",
      circuits: "Nos circuits",
      security: "Sécurité",
      why: "Pourquoi nous",
      offers: "Nos offres",
      gallery: "Galerie",
      contact: "Contact",
      quoteBtn: "Demandez un devis gratuit",
    },
    contactPage: {
      badge: "Contactez-nous",
      title: "Nous sommes à votre écoute",
      sub: "Une question, un projet de voyage, un devis ? Notre équipe franco-algérienne vous répond sous 24h.",
      infoTitle: "Nos coordonnées",
      intro:
        "Une question sur un circuit, un devis groupe ou une demande spéciale ? Contactez-nous directement — nous adorons organiser des aventures sur mesure.",
      emailLabel: "Email",
      emailSub: "Réponse garantie sous 24h",
      phoneFrLabel: "Téléphone – France",
      phoneFrSub: "Lun – Ven · 9h – 18h (Paris)",
      phoneDzLabel: "Téléphone – Algérie",
      phoneDzSub: "Lun – Sam · 8h – 17h (Alger)",
      officesLabel: "Bureaux",
      officesTitle: "Nos Bureaux",
      socialLabel: "Suivez-nous",
      responseBadge: "Nous répondons en moins de 24h",
      formTitle: "Envoyez-nous un message",
      formSub:
        "Décrivez votre projet de voyage et nous vous préparons une proposition sur mesure, gratuitement.",
      firstName: "Prénom *",
      lastName: "Nom *",
      email: "Email *",
      phone: "Téléphone",
      groupSize: "Taille du groupe",
      subject: "Sujet",
      message: "Message *",
      messagePlaceholder:
        "Décrivez votre projet : dates souhaitées, destinations, besoins particuliers…",
      submit: "Envoyer mon message →",
      successTitle: "Message envoyé !",
      successMsg:
        "Merci de nous avoir contactés. Notre équipe vous répondra dans les 24 heures avec une proposition personnalisée.",
      groupOptions: [
        "Sélectionner",
        "1 – 10 personnes",
        "11 – 25 personnes",
        "26 – 50 personnes",
        "50+ personnes",
      ],
      subjectOptions: [
        "Sélectionner",
        "Demande de devis",
        "Renseignements circuits",
        "Partenariat",
        "Autre",
      ],
      office1Title: "Bureau France – Paris",
      office1Desc:
        "Coordination des départs européens, relations clients francophones, devis personnalisés.",
      office2Title: "Bureau Algérie – Alger",
      office2Desc:
        "Gestion logistique sur place, guides, hébergements et sécurité. Ouvert 7j/7 pendant les circuits.",
    },
    galleryPage: {
      badge: "Photos",
      title: "Galerie de l'Algérie",
      sub: "Des paysages sahariens aux cités millénaires, vivez l'Algérie en images avant de la découvrir en vrai.",
      saharaBadge: "Désert",
      saharaTitle: "Le Grand Sahara",
      saharaSub:
        "L'infini des sables dorés, des dunes monumentales et des oasis secrètes.",
      ghardaiaBadge: "Culture",
      ghardaiaTitle: "Ghardaïa & la Vallée du M'Zab",
      ghardaiaSub:
        "Cité millénaire classée au patrimoine mondial de l'UNESCO, carrefour de cultures et d'architecture berbère.",
      hotelsBadge: "Hébergements",
      hotelsTitle: "Nos Hôtels Partenaires",
      hotelsSub:
        "Des établissements soigneusement sélectionnés pour votre confort et sécurité tout au long du voyage.",
      ctaTitle: "Prêt à vivre ces paysages ?",
      ctaSub:
        "Nos circuits vous emmènent là où ces photos ont été prises. Demandez un devis gratuit aujourd'hui.",
      ctaBtn1: "Demander un devis →",
      ctaBtn2: "Voir nos circuits",
    },
    offresPage: {
      badge: "Voyages & Circuits",
      title: "Nos Offres en Algérie",
      sub: "Du désert saharien aux cités millénaires, choisissez l'aventure qui vous correspond.",
      filters: [
        { key: "all", label: "Toutes les offres" },
        { key: "sahara", label: "🏜️ Sahara" },
        { key: "culture", label: "🏛️ Culture" },
        { key: "premium", label: "👑 Premium" },
        { key: "corporate", label: "🏢 Corporate" },
      ],
      priceSahara: "À partir de",
      pricePremium: "Tarif premium",
      priceCorporate: "Tarif groupe",
      priceDefault: "À partir de",
      priceValue: "Sur devis",
      perPerson: "/ pers.",
      detailBtn: "Détails",
      quoteBtn: "Devis →",
      statusSahara: "Populaire",
      statusPremium: "Best-seller",
      statusCorporate: "Entreprises",
      customTitle: "Votre voyage sur mesure",
      customSub:
        "Vous avez un projet spécial — mariage, pèlerinage, voyage scolaire, anniversaire ? Nous construisons un circuit unique rien que pour votre groupe.",
      customBtn: "Demander un devis sur mesure →",
      contactBtn: "Nous contacter",
      aboutCircuit: "À propos de ce circuit",
      includedLabel: "Ce qui est inclus",
      programLabel: "Programme jour par jour",
      fromLabel: "À partir de",
      closeBtn: "Fermer",
      sendQuote: "Demander un devis →",
    },
    modal: {
      title: "Demande de devis",
      sub: "Remplissez ce formulaire et notre équipe vous contacte sous 24h avec une proposition personnalisée.",
      firstName: "Prénom *",
      lastName: "Nom *",
      email: "Email *",
      phone: "Téléphone",
      groupSize: "Taille du groupe *",
      formula: "Formule souhaitée",
      project: "Votre projet",
      projectPlaceholder:
        "Destination souhaitée, dates, besoins particuliers...",
      submit: "Envoyer ma demande →",
      successMsg: "✓ Demande envoyée ! On vous contacte bientôt.",
      groupOptions: [
        "Choisir...",
        "10 – 20 personnes",
        "20 – 40 personnes",
        "40 – 80 personnes",
        "80+ personnes",
      ],
      formulaOptions: [
        "Choisir...",
        "Économique",
        "Intermédiaire",
        "Premium",
        "Sur mesure",
      ],
    },
    offresModal: {
      title: "Demande de devis",
      sub: "Remplissez ce formulaire et notre équipe vous contacte sous 24h.",
      firstName: "Prénom *",
      lastName: "Nom *",
      email: "Email *",
      phone: "Téléphone",
      groupSize: "Taille du groupe",
      desiredOffer: "Offre souhaitée",
      message: "Message",
      messagePlaceholder: "Dates souhaitées, besoins spécifiques…",
      submit: "Envoyer ma demande →",
      successMsg: "✓ Demande envoyée !",
      groupOptions: [
        "Sélectionner",
        "1 – 10 personnes",
        "11 – 25 personnes",
        "26 – 50 personnes",
        "50+ personnes",
      ],
    },
  },

  en: {
    nav: {
      about: "About",
      circuits: "Tours",
      offers: "Our Offers",
      gallery: "Gallery",
      contact: "Contact",
      quote: "Free Quote",
    },
    hero: {
      eyebrow: "Group cultural trips to Algeria",
      title1: "Authentic Algeria,",
      title2: "organized for you.",
      sub: "Ziara-Sahla designs custom cultural tours for groups, associations and European companies. Safe, immersive and unforgettable.",
      cta1: "Request a quote",
      cta2: "Discover our tours",
      stat1: "Groups accompanied",
      stat2: "Wilayas covered",
      stat3: "100% Safe & insured",
      discover: "Discover",
    },
    about: {
      badge: "Who we are",
      title: "Franco-Algerian expertise at the service of your journey",
      sub: "Founded by a passionate binational team, Ziara-Sahla is your bridge between Europe and the deep soul of Algeria. We don't sell trips — we create memorable experiences, in complete safety.",
      feat1: {
        title: "Full bilingualism",
        desc: "Native French-speaking guides",
      },
      feat2: { title: "Guaranteed safety", desc: "Police escort 24/7" },
      feat3: { title: "Complete logistics", desc: "Hotels, transport, meals" },
      feat4: { title: "Tailor-made", desc: "Adapted to each group" },
      cert: "Licensed & certified",
      certSub: "Official tourism operator",
    },
    services: {
      badge: "Our tours",
      title: "Choose your travel package",
      sub: "Three levels of experience, one promise: authenticity and safety.",
      card1: {
        label: "Package 01",
        title: "Economy",
        desc: "The essentials of Algeria for budget-conscious groups. Simple comfort, total authenticity.",
      },
      card2: {
        label: "Package 02",
        title: "Intermediate",
        desc: "The perfect balance between comfort and cultural immersion. Our most popular package.",
        ribbon: "Popular",
      },
      card3: {
        label: "Package 03",
        title: "Premium",
        desc: "An exceptional experience, tailor-made for demanding groups and corporate events.",
      },
      priceLabel: "On quote",
      moreBtn: "Learn more →",
      feats1: [
        "2-3 star accommodation",
        "Air-conditioned bus",
        "French-speaking guide",
        "Traditional meals included",
        "Assistance 7 days/7",
      ],
      feats2: [
        "3-4 star accommodation",
        "VIP private transport",
        "Expert bilingual guide",
        "Cultural excursions",
        "Security escort included",
        "24/7 assistance",
      ],
      feats3: [
        "4-5 star accommodation",
        "Dedicated vehicle fleet",
        "Expert guide + interpreter",
        "Personalized program",
        "VIP escort guaranteed",
        "Dedicated concierge",
      ],
    },
    trust: {
      badge: "Trust & Safety",
      title: "Your safety is our absolute priority",
      sub: "Every tour is organized with the highest level of security to give you total peace of mind.",
      cards: [
        {
          title: "Police escort",
          desc: "Each group benefits from an official escort from Algerian law enforcement throughout the route.",
        },
        {
          title: "24/7 Assistance",
          desc: "A dedicated team available at all times, including medical emergencies.",
        },
        {
          title: "Mastered logistics",
          desc: "Transport, accommodation, catering and activities — all planned before your arrival.",
        },
        {
          title: "Medical coverage",
          desc: "Partnership with local medical facilities. Referring physician available for long stays.",
        },
        {
          title: "Official accreditation",
          desc: "Operator approved by the Algerian Ministry of Tourism. Your rights are protected.",
        },
        {
          title: "Insurance included",
          desc: "Each participant is covered by comprehensive repatriation and civil liability insurance.",
        },
      ],
    },
    why: {
      badge: "Why choose us",
      title: "What makes us your best travel partner",
      items: [
        {
          title: "Dual culture, dual expertise",
          desc: "Our binational team understands your European expectations and knows Algeria inside out. No unpleasant surprises.",
        },
        {
          title: "Off-the-beaten-track tours",
          desc: "Sahara, Tassili, Ghardaïa, Béjaïa, Tipaza… We open doors that ordinary agencies dare not enter.",
        },
        {
          title: "All-inclusive, zero stress",
          desc: "From your arrival at the airport to your departure, everything is taken care of. You enjoy, we manage.",
        },
        {
          title: "Ideal for companies & associations",
          desc: "Team building, study trips, association retreats — we have the expertise for all group profiles.",
        },
        {
          title: "Total price transparency",
          desc: "Detailed quote with no surprises. You know exactly what you pay and what you receive.",
        },
      ],
      quote:
        "A trip to Algeria with Ziara Sahla is much more than a tour — it's an encounter with a millennial civilization.",
    },
    gallery: {
      badge: "Gallery",
      title: "Algeria seen by our travelers",
      sub: "Breathtaking landscapes that just need to be experienced from the inside.",
      viewAll: "View full gallery →",
      organize: "Organize your trip",
    },
    cta: {
      flag: "Available now",
      title: "Ready to experience Algeria differently?",
      sub: "Request your personalized quote for free. Our team responds within 24 hours.",
      btn1: "Request your quote on WhatsApp",
      btn2: "Chat directly",
      urgency: "🗓️ Limited spots — 2026 season filling up",
    },
    footer: {
      about:
        "Your specialist in group cultural tours to Algeria. Safe, authentic and unforgettable for over 10 years.",
      navTitle: "Navigation",
      formulasTitle: "Packages",
      contactTitle: "Contact",
      nav: {
        about: "About",
        circuits: "Our tours",
        offers: "Our offers",
        why: "Why us",
        gallery: "Gallery",
        contact: "Contact",
      },
      formulas: [
        "Economy Tour",
        "Intermediate Tour",
        "Premium Tour",
        "Custom groups",
        "Companies & CE",
      ],
      rights: "© 2026 Ziara-Sahla. All rights reserved.",
      legal: "Legal notice",
      privacy: "Privacy",
      cgv: "T&C",
    },
    sidebar: {
      about: "About",
      circuits: "Our tours",
      security: "Safety",
      why: "Why us",
      offers: "Our offers",
      gallery: "Gallery",
      contact: "Contact",
      quoteBtn: "Request a free quote",
    },
    contactPage: {
      badge: "Contact us",
      title: "We are here for you",
      sub: "A question, a travel project, a quote? Our Franco-Algerian team responds within 24 hours.",
      infoTitle: "Our contact details",
      intro:
        "A question about a tour, a group quote or a special request? Contact us directly — we love organizing custom adventures.",
      emailLabel: "Email",
      emailSub: "Response guaranteed within 24h",
      phoneFrLabel: "Phone – France",
      phoneFrSub: "Mon – Fri · 9am – 6pm (Paris)",
      phoneDzLabel: "Phone – Algeria",
      phoneDzSub: "Mon – Sat · 8am – 5pm (Algiers)",
      officesLabel: "Offices",
      officesTitle: "Our Offices",
      socialLabel: "Follow us",
      responseBadge: "We respond within 24 hours",
      formTitle: "Send us a message",
      formSub:
        "Describe your travel project and we will prepare a tailor-made proposal, free of charge.",
      firstName: "First name *",
      lastName: "Last name *",
      email: "Email *",
      phone: "Phone",
      groupSize: "Group size",
      subject: "Subject",
      message: "Message *",
      messagePlaceholder:
        "Describe your project: desired dates, destinations, special needs…",
      submit: "Send my message →",
      successTitle: "Message sent!",
      successMsg:
        "Thank you for contacting us. Our team will reply within 24 hours with a personalized proposal.",
      groupOptions: [
        "Select",
        "1 – 10 people",
        "11 – 25 people",
        "26 – 50 people",
        "50+ people",
      ],
      subjectOptions: [
        "Select",
        "Quote request",
        "Tour information",
        "Partnership",
        "Other",
      ],
      office1Title: "France Office – Paris",
      office1Desc:
        "Coordination of European departures, French-speaking client relations, personalized quotes.",
      office2Title: "Algeria Office – Algiers",
      office2Desc:
        "On-site logistics, guides, accommodation and security management. Open 7 days/7 during tours.",
    },
    galleryPage: {
      badge: "Photos",
      title: "Algeria Gallery",
      sub: "From Saharan landscapes to millennial cities, experience Algeria in pictures before discovering it for real.",
      saharaBadge: "Desert",
      saharaTitle: "The Grand Sahara",
      saharaSub:
        "The infinity of golden sands, monumental dunes and secret oases.",
      ghardaiaBadge: "Culture",
      ghardaiaTitle: "Ghardaïa & the M'Zab Valley",
      ghardaiaSub:
        "A millennial city listed as a UNESCO World Heritage Site, a crossroads of cultures and Berber architecture.",
      hotelsBadge: "Accommodation",
      hotelsTitle: "Our Partner Hotels",
      hotelsSub:
        "Carefully selected establishments for your comfort and safety throughout the journey.",
      ctaTitle: "Ready to experience these landscapes?",
      ctaSub:
        "Our tours take you to where these photos were taken. Request a free quote today.",
      ctaBtn1: "Request a quote →",
      ctaBtn2: "View our tours",
    },
    offresPage: {
      badge: "Trips & Tours",
      title: "Our Offers in Algeria",
      sub: "From the Saharan desert to millennial cities, choose the adventure that suits you.",
      filters: [
        { key: "all", label: "All offers" },
        { key: "sahara", label: "🏜️ Sahara" },
        { key: "culture", label: "🏛️ Culture" },
        { key: "premium", label: "👑 Premium" },
        { key: "corporate", label: "🏢 Corporate" },
      ],
      priceSahara: "From",
      pricePremium: "Premium rate",
      priceCorporate: "Group rate",
      priceDefault: "From",
      priceValue: "On quote",
      perPerson: "/ person",
      detailBtn: "Details",
      quoteBtn: "Quote →",
      statusSahara: "Popular",
      statusPremium: "Best-seller",
      statusCorporate: "Corporate",
      customTitle: "Your tailor-made trip",
      customSub:
        "Do you have a special project — wedding, pilgrimage, school trip, anniversary? We build a unique tour just for your group.",
      customBtn: "Request a custom quote →",
      contactBtn: "Contact us",
      aboutCircuit: "About this tour",
      includedLabel: "What's included",
      programLabel: "Day by day program",
      fromLabel: "From",
      closeBtn: "Close",
      sendQuote: "Request a quote →",
    },
    modal: {
      title: "Quote request",
      sub: "Fill in this form and our team will contact you within 24 hours with a personalized proposal.",
      firstName: "First name *",
      lastName: "Last name *",
      email: "Email *",
      phone: "Phone",
      groupSize: "Group size *",
      formula: "Desired package",
      project: "Your project",
      projectPlaceholder: "Desired destination, dates, special needs...",
      submit: "Send my request →",
      successMsg: "✓ Request sent! We will contact you soon.",
      groupOptions: [
        "Choose...",
        "10 – 20 people",
        "20 – 40 people",
        "40 – 80 people",
        "80+ people",
      ],
      formulaOptions: [
        "Choose...",
        "Economy",
        "Intermediate",
        "Premium",
        "Custom",
      ],
    },
    offresModal: {
      title: "Quote request",
      sub: "Fill in this form and our team will contact you within 24 hours.",
      firstName: "First name *",
      lastName: "Last name *",
      email: "Email *",
      phone: "Phone",
      groupSize: "Group size",
      desiredOffer: "Desired offer",
      message: "Message",
      messagePlaceholder: "Desired dates, specific needs…",
      submit: "Send my request →",
      successMsg: "✓ Request sent!",
      groupOptions: [
        "Select",
        "1 – 10 people",
        "11 – 25 people",
        "26 – 50 people",
        "50+ people",
      ],
    },
  },

  ar: {
    nav: {
      about: "من نحن",
      circuits: "الجولات",
      offers: "عروضنا",
      gallery: "المعرض",
      contact: "اتصل بنا",
      quote: "احصل على عرض",
    },
    hero: {
      eyebrow: "رحلات ثقافية جماعية إلى الجزائر",
      title1: "الجزائر الأصيلة،",
      title2: "منظمة لأجلكم.",
      sub: "تصمم زيارة سهلة جولات ثقافية مخصصة للمجموعات والجمعيات والشركات الأوروبية. آمنة وغنية ولا تُنسى.",
      cta1: "احصل على عرض سعر",
      cta2: "اكتشف جولاتنا",
      stat1: "مجموعة مرافقة",
      stat2: "ولاية مغطاة",
      stat3: "آمن ومؤمن ١٠٠٪",
      discover: "اكتشف",
    },
    about: {
      badge: "من نحن",
      title: "الخبرة الجزائرية الفرنسية في خدمة رحلتكم",
      sub: "تأسست زيارة سهلة على يد فريق ثنائي الجنسية متحمس، وهي جسركم بين أوروبا وروح الجزائر العميقة. نحن لا نبيع رحلات — نحن نصنع تجارب لا تُنسى، بأمان تام.",
      feat1: { title: "ثنائية اللغة الكاملة", desc: "مرشدون ناطقون بالفرنسية" },
      feat2: { title: "أمان مضمون", desc: "مرافقة شرطية على مدار الساعة" },
      feat3: { title: "لوجستيك متكامل", desc: "فنادق ونقل ووجبات" },
      feat4: { title: "مخصص لكل مجموعة", desc: "يتكيف مع كل احتياجاتكم" },
      cert: "مرخص ومعتمد",
      certSub: "مشغل سياحي رسمي",
    },
    services: {
      badge: "جولاتنا",
      title: "اختر باقة سفرك",
      sub: "ثلاثة مستويات من التجربة، وعد واحد: الأصالة والأمان.",
      card1: {
        label: "الباقة ٠١",
        title: "الاقتصادية",
        desc: "أساسيات الجزائر للمجموعات الحريصة على الميزانية. راحة بسيطة، أصالة كاملة.",
      },
      card2: {
        label: "الباقة ٠٢",
        title: "المتوسطة",
        desc: "التوازن المثالي بين الراحة والانغماس الثقافي. باقتنا الأكثر طلبًا.",
        ribbon: "الأكثر شعبية",
      },
      card3: {
        label: "الباقة ٠٣",
        title: "المميزة",
        desc: "تجربة استثنائية مصممة خصيصًا للمجموعات المتطلبة والفعاليات المؤسسية.",
      },
      priceLabel: "بناءً على الطلب",
      moreBtn: "← اعرف المزيد",
      feats1: [
        "إقامة ٢-٣ نجوم",
        "نقل بالحافلة المكيفة",
        "مرشد ناطق بالفرنسية",
        "وجبات تقليدية مشمولة",
        "مساعدة ٧ أيام/٧",
      ],
      feats2: [
        "إقامة ٣-٤ نجوم",
        "نقل خاص VIP",
        "مرشد خبير ثنائي اللغة",
        "جولات ثقافية",
        "مرافقة أمنية مشمولة",
        "مساعدة ٢٤/٢٤",
      ],
      feats3: [
        "إقامة ٤-٥ نجوم",
        "أسطول مركبات مخصص",
        "مرشد خبير + مترجم",
        "برنامج مخصص",
        "مرافقة VIP مضمونة",
        "خدمة كونسيرج مخصصة",
      ],
    },
    trust: {
      badge: "الثقة والأمان",
      title: "أمانكم هو أولويتنا القصوى",
      sub: "كل جولة منظمة بأعلى مستوى من الأمان لمنحكم الراحة التامة.",
      cards: [
        {
          title: "مرافقة شرطية",
          desc: "تستفيد كل مجموعة من مرافقة رسمية من قبل قوات الأمن الجزائرية طوال المسار.",
        },
        {
          title: "مساعدة ٢٤/٢٤",
          desc: "فريق مخصص متاح في جميع الأوقات، بما في ذلك حالات الطوارئ الطبية.",
        },
        {
          title: "لوجستيك متحكم به",
          desc: "النقل والإقامة والتموين والأنشطة — كل شيء مخطط قبل وصولكم.",
        },
        {
          title: "تغطية طبية",
          desc: "شراكة مع مرافق طبية محلية. طبيب مرجعي متاح للإقامات الطويلة.",
        },
        {
          title: "اعتماد رسمي",
          desc: "مشغل معتمد من وزارة السياحة الجزائرية. حقوقكم محمية.",
        },
        {
          title: "تأمين مشمول",
          desc: "كل مشارك مغطى بتأمين شامل على الترحيل والمسؤولية المدنية.",
        },
      ],
    },
    why: {
      badge: "لماذا تختارنا",
      title: "ما يجعلنا أفضل شريك سفر لكم",
      items: [
        {
          title: "ثقافة مزدوجة، خبرة مزدوجة",
          desc: "يفهم فريقنا ثنائي الجنسية توقعاتكم الأوروبية ويعرف الجزائر جيدًا. لا مفاجآت سيئة.",
        },
        {
          title: "جولات خارج المسارات المعتادة",
          desc: "الصحراء، تاسيلي، غرداية، بجاية، تيباز... نفتح أبوابًا لا تجرؤ الوكالات العادية على الدخول إليها.",
        },
        {
          title: "شامل لكل شيء، صفر إجهاد",
          desc: "من وصولكم إلى المطار حتى مغادرتكم، كل شيء في عهدتنا. أنتم تستمتعون، نحن ندير.",
        },
        {
          title: "مثالي للشركات والجمعيات",
          desc: "بناء الفريق، رحلات الدراسة، الاعتكافات الجمعوية — لدينا الخبرة لجميع أنواع المجموعات.",
        },
        {
          title: "شفافية تامة في الأسعار",
          desc: "عرض سعر مفصل بدون مفاجآت. أنتم تعرفون تمامًا ما تدفعون وما تتلقون.",
        },
      ],
      quote:
        "رحلة إلى الجزائر مع زيارة سهلة هي أكثر بكثير من مجرد جولة — إنها لقاء مع حضارة عريقة.",
    },
    gallery: {
      badge: "المعرض",
      title: "الجزائر كما يراها مسافرونا",
      sub: "مناظر خلابة لا تنتظر إلا أن تعيشها من الداخل.",
      viewAll: "← مشاهدة المعرض كاملاً",
      organize: "نظّم رحلتك",
    },
    cta: {
      flag: "متاح الآن",
      title: "هل أنتم مستعدون لتجربة الجزائر بشكل مختلف؟",
      sub: "احصلوا على عرض سعر مخصص مجانًا. فريقنا يرد خلال ٢٤ ساعة.",
      btn1: "احصل على عرضك عبر واتساب",
      btn2: "تحدث مباشرة",
      urgency: "🗓️ أماكن محدودة — موسم ٢٠٢٦ يمتلئ",
    },
    footer: {
      about:
        "متخصصكم في الرحلات الثقافية الجماعية إلى الجزائر. آمنة وأصيلة ولا تُنسى منذ أكثر من ١٠ سنوات.",
      navTitle: "التنقل",
      formulasTitle: "الباقات",
      contactTitle: "اتصل بنا",
      nav: {
        about: "من نحن",
        circuits: "جولاتنا",
        offers: "عروضنا",
        why: "لماذا نحن",
        gallery: "المعرض",
        contact: "اتصل بنا",
      },
      formulas: [
        "الجولة الاقتصادية",
        "الجولة المتوسطة",
        "الجولة المميزة",
        "مجموعات مخصصة",
        "الشركات والمؤسسات",
      ],
      rights: "© ٢٠٢٦ زيارة سهلة. جميع الحقوق محفوظة.",
      legal: "الشروط القانونية",
      privacy: "الخصوصية",
      cgv: "الشروط العامة",
    },
    sidebar: {
      about: "من نحن",
      circuits: "جولاتنا",
      security: "الأمان",
      why: "لماذا نحن",
      offers: "عروضنا",
      gallery: "المعرض",
      contact: "اتصل بنا",
      quoteBtn: "احصل على عرض مجاني",
    },
    contactPage: {
      badge: "اتصل بنا",
      title: "نحن هنا من أجلكم",
      sub: "سؤال، مشروع سفر، عرض سعر؟ فريقنا الجزائري الفرنسي يرد خلال ٢٤ ساعة.",
      infoTitle: "معلومات الاتصال",
      intro:
        "سؤال حول جولة، عرض سعر لمجموعة أو طلب خاص؟ تواصلوا معنا مباشرة — نحب تنظيم المغامرات المخصصة.",
      emailLabel: "البريد الإلكتروني",
      emailSub: "رد مضمون خلال ٢٤ ساعة",
      phoneFrLabel: "الهاتف – فرنسا",
      phoneFrSub: "الاثنين – الجمعة · ٩ص – ٦م (باريس)",
      phoneDzLabel: "الهاتف – الجزائر",
      phoneDzSub: "الاثنين – السبت · ٨ص – ٥م (الجزائر)",
      officesLabel: "المكاتب",
      officesTitle: "مكاتبنا",
      socialLabel: "تابعونا",
      responseBadge: "نرد خلال أقل من ٢٤ ساعة",
      formTitle: "أرسلوا لنا رسالة",
      formSub: "صفوا مشروع سفركم وسنعد لكم اقتراحًا مخصصًا مجانًا.",
      firstName: "الاسم الأول *",
      lastName: "اللقب *",
      email: "البريد الإلكتروني *",
      phone: "الهاتف",
      groupSize: "حجم المجموعة",
      subject: "الموضوع",
      message: "الرسالة *",
      messagePlaceholder:
        "صفوا مشروعكم: التواريخ المفضلة، الوجهات، الاحتياجات الخاصة…",
      submit: "إرسال رسالتي ←",
      successTitle: "تم الإرسال!",
      successMsg: "شكرًا لتواصلكم معنا. سيرد فريقنا خلال ٢٤ ساعة باقتراح مخصص.",
      groupOptions: [
        "اختر",
        "١ – ١٠ أشخاص",
        "١١ – ٢٥ شخصًا",
        "٢٦ – ٥٠ شخصًا",
        "٥٠+ شخصًا",
      ],
      subjectOptions: [
        "اختر",
        "طلب عرض سعر",
        "معلومات حول الجولات",
        "شراكة",
        "أخرى",
      ],
      office1Title: "مكتب فرنسا – باريس",
      office1Desc:
        "تنسيق المغادرات الأوروبية، علاقات العملاء الناطقين بالفرنسية، عروض الأسعار المخصصة.",
      office2Title: "مكتب الجزائر – الجزائر العاصمة",
      office2Desc:
        "إدارة اللوجستيك في الموقع، المرشدون، الإقامة والأمن. مفتوح ٧ أيام/٧ خلال الجولات.",
    },
    galleryPage: {
      badge: "الصور",
      title: "معرض الجزائر",
      sub: "من مناظر الصحراء إلى المدن العريقة، عيشوا الجزائر في صور قبل اكتشافها على أرض الواقع.",
      saharaBadge: "الصحراء",
      saharaTitle: "الصحراء الكبرى",
      saharaSub: "لانهاية الرمال الذهبية، والكثبان الضخمة، والواحات السرية.",
      ghardaiaBadge: "الثقافة",
      ghardaiaTitle: "غرداية ووادي ميزاب",
      ghardaiaSub:
        "مدينة عريقة مصنفة ضمن التراث العالمي لليونسكو، ملتقى الثقافات والعمارة الأمازيغية.",
      hotelsBadge: "الإقامة",
      hotelsTitle: "فنادقنا الشريكة",
      hotelsSub: "مؤسسات مختارة بعناية لراحتكم وأمانكم طوال الرحلة.",
      ctaTitle: "هل أنتم مستعدون لعيش هذه المناظر؟",
      ctaSub:
        "جولاتنا تأخذكم إلى حيث التُقطت هذه الصور. اطلبوا عرض سعر مجانيًا اليوم.",
      ctaBtn1: "اطلب عرض سعر ←",
      ctaBtn2: "اعرف جولاتنا",
    },
    offresPage: {
      badge: "رحلات وجولات",
      title: "عروضنا في الجزائر",
      sub: "من صحراء الصحراء إلى المدن العريقة، اختر المغامرة التي تناسبك.",
      filters: [
        { key: "all", label: "جميع العروض" },
        { key: "sahara", label: "🏜️ الصحراء" },
        { key: "culture", label: "🏛️ الثقافة" },
        { key: "premium", label: "👑 المميز" },
        { key: "corporate", label: "🏢 الشركات" },
      ],
      priceSahara: "ابتداءً من",
      pricePremium: "سعر مميز",
      priceCorporate: "سعر المجموعة",
      priceDefault: "ابتداءً من",
      priceValue: "بناءً على الطلب",
      perPerson: "/ شخص",
      detailBtn: "التفاصيل",
      quoteBtn: "عرض سعر ←",
      statusSahara: "مشهور",
      statusPremium: "الأكثر مبيعًا",
      statusCorporate: "مؤسسات",
      customTitle: "رحلتكم المخصصة",
      customSub:
        "هل لديكم مشروع خاص — زفاف، حج، رحلة مدرسية، ذكرى سنوية؟ نبني جولة فريدة خصيصًا لمجموعتكم.",
      customBtn: "اطلب عرض سعر مخصص ←",
      contactBtn: "اتصل بنا",
      aboutCircuit: "حول هذه الجولة",
      includedLabel: "ما هو مشمول",
      programLabel: "البرنامج يومًا بيوم",
      fromLabel: "ابتداءً من",
      closeBtn: "إغلاق",
      sendQuote: "اطلب عرض سعر ←",
    },
    modal: {
      title: "طلب عرض سعر",
      sub: "املأ هذا النموذج وسيتواصل معك فريقنا خلال ٢٤ ساعة باقتراح مخصص.",
      firstName: "الاسم الأول *",
      lastName: "اللقب *",
      email: "البريد الإلكتروني *",
      phone: "الهاتف",
      groupSize: "حجم المجموعة *",
      formula: "الباقة المطلوبة",
      project: "مشروعكم",
      projectPlaceholder: "الوجهة المطلوبة، التواريخ، الاحتياجات الخاصة...",
      submit: "إرسال طلبي ←",
      successMsg: "✓ تم الإرسال! سنتواصل معك قريبًا.",
      groupOptions: [
        "اختر...",
        "١٠ – ٢٠ شخصًا",
        "٢٠ – ٤٠ شخصًا",
        "٤٠ – ٨٠ شخصًا",
        "٨٠+ شخصًا",
      ],
      formulaOptions: ["اختر...", "الاقتصادية", "المتوسطة", "المميزة", "مخصصة"],
    },
    offresModal: {
      title: "طلب عرض سعر",
      sub: "املأ هذا النموذج وسيتواصل معك فريقنا خلال ٢٤ ساعة.",
      firstName: "الاسم الأول *",
      lastName: "اللقب *",
      email: "البريد الإلكتروني *",
      phone: "الهاتف",
      groupSize: "حجم المجموعة",
      desiredOffer: "العرض المطلوب",
      message: "رسالة",
      messagePlaceholder: "التواريخ المطلوبة، الاحتياجات الخاصة…",
      submit: "إرسال طلبي ←",
      successMsg: "✓ تم الإرسال!",
      groupOptions: [
        "اختر",
        "١ – ١٠ أشخاص",
        "١١ – ٢٥ شخصًا",
        "٢٦ – ٥٠ شخصًا",
        "٥٠+ شخصًا",
      ],
    },
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Translations;
  isRTL: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: "fr",
  setLang: () => {},
  tr: t.fr,
  isRTL: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", l);
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored && ["fr", "en", "ar"].includes(stored)) {
      setLang(stored);
    }
  }, []);

  return (
    <LangContext.Provider
      value={{ lang, setLang, tr: t[lang], isRTL: lang === "ar" }}
    >
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
