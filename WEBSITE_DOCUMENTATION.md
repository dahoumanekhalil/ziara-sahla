# Ziara Sahla — Website Documentation

## Overview

**Ziara Sahla** is a Franco-Algerian travel agency website built with Next.js (App Router). It presents tour packages to Algeria (Sahara, Ghardaïa, cultural circuits), handles quote requests via email, and includes a password-protected admin panel for content management.

**Tech Stack:** Next.js 16 · React 19 · TypeScript 5 · Nodemailer · JSON file storage

---

## Project Structure

```
ziara-sahla/
├── app/                    # Pages and API routes (Next.js App Router)
│   ├── layout.tsx          # Root layout — wraps all pages with providers
│   ├── page.tsx            # Home page (/)
│   ├── contact/            # Contact page (/contact)
│   ├── galerie/            # Gallery page (/galerie)
│   ├── offres/             # Offers page (/offres)
│   ├── admin/              # Admin dashboard (/admin)
│   └── api/                # REST API endpoints
├── components/             # Shared UI components
├── context/                # React Context providers (language, theme, UI)
├── lib/                    # Utility functions and data access
├── data/                   # JSON data files (offers, gallery)
├── assets/                 # Static images (logo, sahara, ghardaia, hotels)
└── public/                 # Public static files (favicon)
```

---

## Pages

### 1. Home Page — `/`

**File:** `app/page.tsx`

The main landing page. It is built entirely as a client component to support scroll-reveal animations, a parallax hero, and live context data.

#### Sections

| Section | Description |
|---|---|
| **Hero** | Full-viewport banner with animated flying airplane, brand tagline, a "Get a Quote" button (opens the global quote modal), and a "Discover" scroll link |
| **About** | Presents the agency's Franco-Algerian identity with 4 feature cards (expertise, authenticity, safety, personalisation) |
| **Services** | Three package tiers — Économique, Intermédiaire, Premium — each with an icon, description, and highlights |
| **Trust & Security** | Six trust cards covering safety, licensed guides, transport, insurance, accommodation, and 24/7 support |
| **Why Us** | Five numbered value propositions explaining the agency's advantages |
| **Gallery** | A static image grid pulled from `/assets/` (Sahara, Ghardaïa, hotels) |
| **CTA Strip** | Final call-to-action banner with a quote button and a WhatsApp direct link |

#### Features
- Particle animation system in the hero section
- Scroll-reveal animations on all sections
- Parallax effect in the hero
- Full multilingual support (FR / EN / AR)
- Light / dark theme support
- WhatsApp integration in the CTA strip

---

### 2. Contact Page — `/contact`

**File:** `app/contact/page.tsx`

Allows visitors to get in touch or request a quote directly from a form.

#### Layout

**Left column — Contact info cards:**
- Email address
- French phone number
- Algerian phone number
- Paris office address
- Algiers office address

**Right column — Contact form:**

| Field | Type | Required |
|---|---|---|
| First name | Text | Yes |
| Last name | Text | Yes |
| Email | Email | Yes |
| Phone | Tel | No |
| Group size | Text | Yes |
| Subject | Text | Yes |
| Message | Textarea | Yes |

On submission the form POSTs to `/api/contact`. On success a checkmark overlay replaces the form. On failure an inline error message is shown.

#### Additional sections
- Office locations (Paris, Algiers) with country flags
- Social links (Facebook, Instagram, LinkedIn, WhatsApp)

---

### 3. Gallery Page — `/galerie`

**File:** `app/galerie/page.tsx`

Displays all agency photography organized into three destination categories.

#### Features
- Fetches images dynamically from `/api/gallery`
- **Three category sections:** Sahara · Ghardaïa · Hotels
- Responsive photo grid with label and zoom icon on each image
- **Lightbox viewer** — clicking any image opens a full-screen overlay:
  - Keyboard navigation: `←` / `→` to move, `Escape` to close
  - Counter showing position (e.g. `3 / 45`)
  - Click outside the image to close
- Bottom CTA strip linking to the quote modal and the offers page

---

### 4. Offers Page — `/offres`

**Files:** `app/offres/page.tsx` · `app/offres/OffresClient.tsx`

The main product catalogue page showing all available tour packages.

#### Features

**Filter bar** — filters the offers grid in real time by category:
- All · Sahara · Culture · Premium · Corporate

**Offer cards** — each card shows:
- Destination image with a category badge
- Status pill (Populaire / Best-seller / Entreprises)
- Duration
- Title and truncated description (130 chars)
- 5 key inclusions with icons
- Price label "Sur devis / pers"
- Two buttons: **Détails** (opens detail modal) and **Devis** (opens quote modal)
- Featured card styling for Premium category offers
- Staggered entrance animations

**Detail modal** — opened via the Détails button:
- Hero image with title and duration overlay
- Meta info row (icons + labels, e.g. group size, difficulty)
- Full description
- Complete inclusions list
- Day-by-day programme

**Quote modal** — opened via the Devis button or any CTA:
- Fields: first name, last name, email, phone, group size, desired offer, message
- Offer dropdown pre-populated with all available offers

**Custom section** — "Sur mesure" banner encouraging visitors to request a fully custom itinerary

---

### 5. Admin Login — `/admin/login`

**File:** `app/admin/login/page.tsx`

A simple authentication gate for the admin panel.

#### Features
- Dark-themed login form
- Fields: username + password
- POSTs credentials to `/api/auth/login`
- On success: sets `admin_session` cookie and redirects to `/admin`
- On failure: displays an inline error message
- Link back to the public homepage

---

### 6. Admin Dashboard — `/admin`

**Files:** `app/admin/page.tsx` · `app/admin/AdminClient.tsx`

The content management panel. Access requires a valid session cookie — unauthenticated requests are redirected to `/admin/login`.

#### Three tabs

**Tab 1 — Offers**
- Lists all current tour offers
- Delete button per offer (removes from `data/offers.json`)

**Tab 2 — Add Offer**
Form sections:
1. General info: title, image URL, category, duration, description
2. Key info (meta): dynamic array of icon + label pairs
3. Inclusions: dynamic array of emoji + text pairs
4. Day-by-day programme: dynamic array of day activities (auto-labelled J1, J2 …)

Each array supports add / remove actions. On submit the offer is POSTed to `/api/offers` and saved with a UUID.

**Tab 3 — Gallery**
- Category filter buttons (Sahara · Ghardaïa · Hotels · Culture · Autre)
- Add image form with two input modes:
  - **URL mode** — paste a direct image URL
  - **Upload mode** — drag-and-drop or file picker; uploads to `/api/gallery/upload` and returns a hosted path
- Alt text, display label, and category selector
- Image preview after upload
- Gallery grid showing all images with per-image delete buttons

---

## Components

### `Nav.tsx` — Navigation Bar

Present on all pages via the root layout.

| Element | Behaviour |
|---|---|
| Logo + brand name | Links to `/` |
| Desktop nav links | About, Circuits, Offers, Gallery, Contact, Quote button |
| Language switcher | FR · EN · AR buttons |
| Theme toggle | Sun / moon icon |
| Mobile hamburger | Opens `Sidebar` |
| Scroll state | Appearance changes after 60 px of scroll |
| Active indicator | Highlights current page for `/offres`, `/galerie`, `/contact` |

---

### `Footer.tsx`

Four-column grid:
1. Logo, agency description, social links (Facebook, LinkedIn, WhatsApp)
2. Navigation links
3. Package / formula list
4. Contact info (email, phones, addresses)

All text content comes from `LangContext` translations.

---

### `Sidebar.tsx` — Mobile Menu

- Full-screen overlay backdrop
- Slide-in side panel with navigation links
- Language switcher and theme toggle
- Quote button
- Phone and email contact info
- Closes on link click or backdrop tap

---

### `QuoteModal.tsx` — Quote Request Modal

Global modal opened by any "Get a Quote" CTA across the site.

| Field | Notes |
|---|---|
| First name / Last name | Required |
| Email | Required |
| Phone | Optional |
| Group size | Dropdown |
| Formula | Dropdown (Économique / Intermédiaire / Premium) |
| Message | Textarea |

Behaviour:
- POSTs to `/api/contact`
- Shows a loading spinner during submission
- Shows a success overlay on completion (auto-closes after 3.4 s)
- Shows an inline error with retry option on failure
- All inputs are disabled during submission
- Closes on Escape key or click outside

---

## Context Providers

### `UIContext.tsx`

Manages modal and sidebar visibility globally.

- State: `isModalOpen`, `isSidebarOpen`
- Functions: `openModal()`, `closeModal()`, `openSidebar()`, `closeSidebar()`, `toggleSidebar()`
- Locks `body` scroll when modal or sidebar is open

---

### `LangContext.tsx`

Full internationalization (i18n) with 1 270+ translation strings.

| Language | Code | Direction |
|---|---|---|
| French | `fr` | LTR |
| English | `en` | LTR |
| Arabic | `ar` | RTL |

- Persists selection in `localStorage`
- Sets `document.documentElement.lang` and `dir` attributes
- Exposes `isRTL` flag for layout mirroring
- Covers all text: nav links, section copy, button labels, form labels, error/success messages, dropdown options

---

### `ThemeContext.tsx`

Light / dark theme management.

- State: `'light'` or `'dark'`
- `toggleTheme()` switches and persists to `localStorage`
- Applies theme via `data-theme` attribute on `<html>`
- Reads `prefers-color-scheme` on first load as the default

---

## API Routes

### Authentication

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Verifies username + password, sets `admin_session` cookie (httpOnly, 8 h) |
| POST | `/api/auth/logout` | Clears cookie, redirects to `/admin/login` |

Session tokens are HMAC-SHA256 signed. Verification uses a timing-safe comparison.

---

### Contact / Quote

| Method | Route | Description |
|---|---|---|
| POST | `/api/contact` | Validates form data, sends two emails (admin notification + client confirmation) via Hostinger SMTP |

Required body fields: `prenom`, `nom`, `email`, `groupe`
Optional: `tel`, `formule`, `msg`

---

### Gallery

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/gallery` | Public | Returns all gallery images |
| POST | `/api/gallery` | Admin | Adds a new image record (src, alt, label, category) |
| POST | `/api/gallery/upload` | Admin | Uploads an image file, returns hosted path |
| DELETE | `/api/gallery/:id` | Admin | Removes an image by ID |

---

### Offers

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/offers` | Public | Returns all tour offers |
| POST | `/api/offers` | Admin | Creates a new offer |
| DELETE | `/api/offers/:id` | Admin | Removes an offer by ID |

---

## Data Models

### Offer (`lib/types.ts`)

```typescript
{
  id: string           // UUID
  title: string        // Offer name
  img: string          // Image path / URL
  cat: string          // 'sahara' | 'culture' | 'premium' | 'corporate'
  dur: string          // e.g. "7 jours / 6 nuits"
  desc: string         // Full description
  meta: {              // Key info items
    icon: string
    label: string
  }[]
  inclus: {            // What's included
    emoji: string
    text: string
  }[]
  programme: {         // Day-by-day schedule
    day: string        // e.g. "J1"
    activities: string
  }[]
}
```

### GalleryImage (`lib/gallery.ts`)

```typescript
{
  id: string           // UUID
  src: string          // Image URL or path
  alt: string          // Accessibility text
  label: string        // Display label in gallery
  category: string     // 'sahara' | 'ghardaia' | 'hotels' | 'culture' | 'autre'
}
```

---

## Email System

Both emails are sent via Hostinger SMTP (`smtp.hostinger.com`, port 465).

### Admin Notification Email
- **Recipient:** `CONTACT_TO` env variable
- **Content:** Client details (name, email, phone, group size, formula, message), timestamp, reply-by-email button, reply-by-WhatsApp button

### Client Confirmation Email
- **Recipient:** Client's submitted email address
- **Content:** Submission recap, three-step process explanation, WhatsApp and email support CTAs, branded footer

All user-submitted strings are HTML-escaped before insertion into email templates.

---

## Environment Variables

```env
# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ziara2026
SESSION_SECRET=<random-secret>

# Hostinger SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@ziara-sahla.com
SMTP_PASS=<password>
CONTACT_TO=dahoumanekhalil@gmail.com

# Integrations
WHATSAPP_NUMBER=213557610660
NEXT_PUBLIC_SITE_URL=https://ziara-sahla.com
```

---

## Styling & Theming

- **Global styles:** `app/globals.css` using CSS custom properties
- **Theme switching:** `data-theme="light"` / `data-theme="dark"` on `<html>`
- **Primary colour:** Orange `#E07B39`
- **Dark backgrounds:** `#0f1117`, `#1a1f2e`
- **Fonts:** Playfair Display (headings) · Inter (body)
- **Animations:** CSS-based scroll-reveal, hero parallax, airplane entrance

---

## Feature Summary

| Feature | Pages | Status |
|---|---|---|
| Multilingual — FR / EN / AR with RTL | All | Complete |
| Light / dark theme | All | Complete |
| Mobile responsive with sidebar menu | All | Complete |
| Scroll-reveal and entrance animations | Home, Contact | Complete |
| Quote request modal | Home, Offers, Gallery | Complete |
| Email notifications (admin + client) | Contact, Modal | Complete (Hostinger SMTP) |
| Protected admin panel (session auth) | /admin | Complete |
| Offer management (create / delete) | /admin | Complete |
| Gallery management (upload / delete) | /admin | Complete |
| Lightbox image viewer | /galerie | Complete (keyboard nav) |
| Offer filtering by category | /offres | Complete (client-side) |
| Offer detail modal | /offres | Complete |
| WhatsApp direct links | Home, Footer, Emails | Complete |
