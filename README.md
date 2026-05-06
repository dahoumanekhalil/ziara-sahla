# Ziara-Sahla

Site web de l'agence de voyages culturels **Ziara-Sahla**, spécialiste des circuits en groupe en Algérie pour clients européens et francophones.

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styles** : CSS global (variables CSS, animations personnalisées)
- **Images** : `next/image` avec assets dans `/public`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil — hero avec animation avion, sections À propos, Circuits, Sécurité, Galerie, CTA |
| `/galerie` | Galerie photos avec lightbox — Sahara, Ghardaïa, Hôtels |
| `/offres` | Offres et circuits — filtres par catégorie, modal détail, demande de devis |
| `/contact` | Page de contact — coordonnées, formulaire de message |

## Structure du projet

```
ziara-sahla/
├── app/
│   ├── layout.tsx          # Layout racine (Nav, Sidebar, Footer, Modal)
│   ├── globals.css         # Tous les styles CSS
│   ├── page.tsx            # Page d'accueil
│   ├── galerie/page.tsx    # Page galerie
│   ├── contact/page.tsx    # Page contact
│   └── offres/page.tsx     # Page offres
├── components/
│   ├── Nav.tsx             # Barre de navigation
│   ├── Sidebar.tsx         # Menu mobile
│   ├── Footer.tsx          # Pied de page
│   └── QuoteModal.tsx      # Modal demande de devis
├── context/
│   └── UIContext.tsx       # État partagé (modal, sidebar)
└── public/
    └── assets/             # Images et médias
```

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Build de production

```bash
npm run build
npm start
```

## Contact

📧 contact@ziara-sahla.com  
🌐 Paris, France · Alger, Algérie
