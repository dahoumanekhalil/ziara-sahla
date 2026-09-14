# Ziara Sahla — Guide des erreurs

Ce document liste les erreurs courantes du site, pourquoi elles se produisent, et comment les corriger. Le site utilise **Next.js 16 + Vercel Serverless Functions + Vercel Blob** pour le stockage.

---

## 1. "Erreur réseau" quand j'ajoute une offre (ou une image, catégorie, service, contact)

### Ce que l'utilisateur voit
Le message `"Erreur réseau"` (ou `"Network error"` / `"خطأ في الشبكة"`) apparaît dans l'admin après clic sur "Ajouter".

### D'où vient ce message
Dans `app/admin/AdminClient.tsx`, chaque handler (`handleAdd`, `handleAddImage`, `handleAddCat`, etc.) est structuré comme ceci :

```ts
try {
  const res = await fetch('/api/offers', { method: 'POST', ... })
  if (res.ok) { ... }
  else {
    const data = await res.json()          // ← peut planter si le serveur renvoie du HTML
    setMsg(data.error ?? a.addError)
  }
} catch {
  setMsg(a.networkError)                    // ← "Erreur réseau"
}
```

Le message "Erreur réseau" est déclenché **dans deux cas très différents** :

| Cause | Ce qui se passe réellement |
|---|---|
| **A. Vraie panne réseau** | Le `fetch()` échoue (offline, DNS, CORS, TLS, timeout côté client). |
| **B. Le serveur renvoie du HTML au lieu de JSON** | `fetch()` réussit, mais `res.json()` plante parce que Vercel a répondu avec une page d'erreur HTML (500 / 502 / 504 / 413). Le `catch` s'active alors et on affiche "Erreur réseau" au lieu de la vraie erreur. |

Le cas B est **de loin le plus fréquent sur Vercel**. Le message trompeur cache la vraie cause.

### Les vraies causes possibles côté serveur

#### B1. Token Vercel Blob manquant ou invalide
- **Fichier** : `lib/blob.ts` — lit le token depuis `BLOB_READ_WRITE_TOKEN` OU `ZIARA_READ_WRITE_TOKEN`.
- Si aucune des deux variables n'existe sur Vercel, `USE_BLOB` est `false` → le code tente d'écrire dans `data/*.json` sur le filesystem serverless (read-only) → `writeFile` lève `EROFS` → 500.
- Si la variable existe mais que le token est révoqué / expiré / attaché à un mauvais store, `put()` lève une erreur d'auth.
- **Vérifier** : `Vercel Dashboard → Project → Settings → Environment Variables`. Une de ces variables doit exister pour tous les environnements (Production, Preview, Development). Elles sont créées automatiquement en attachant un Blob Store au projet (`Storage → Blob → Connect Store`).
- **Historique** : sur ce projet, Vercel a généré `ZIARA_READ_WRITE_TOKEN` (nommage personnalisé pour ce store) au lieu du nom par défaut `BLOB_READ_WRITE_TOKEN`. Le helper `lib/blob.ts` accepte les deux noms.

#### B2. Cookie admin invalidé par un redéploiement
- **Fichier** : `lib/auth.ts:3` — `const SECRET = process.env.SESSION_SECRET ?? 'ziara-sahla-dev-secret'`
- Si `SESSION_SECRET` change entre deux déploiements, tous les cookies existants deviennent invalides.
- Le serveur renverrait normalement `401 Non autorisé` (JSON), donc **cela ne devrait pas afficher "Erreur réseau"** — mais si le middleware crash avant, ça peut.
- **Corriger** : se déconnecter / reconnecter depuis `/admin/login`. Toujours définir `SESSION_SECRET` en variable d'environnement Vercel (ne pas laisser la valeur par défaut).

#### B3. Timeout de la fonction serverless (10 s sur Vercel Hobby, 60 s sur Pro)
- L'ajout d'une offre fait 3 appels Blob : `list()` → `fetch()` (télécharger le JSON existant) → `put()` (réécrire tout).
- Si le Blob est lent, on peut dépasser 10 s.
- **Vérifier** : `Vercel Dashboard → Deployments → [ton déploiement] → Functions → Logs`. Chercher `Task timed out after ...`.

#### B4. Requête trop volumineuse (>4.5 MB body)
- Vercel Serverless refuse les requêtes dont le body dépasse **4.5 MB** avec un `413 Payload Too Large`.
- Peu probable ici : les images sont uploadées via `/api/gallery/upload` séparément et seule l'URL est envoyée dans le body de l'offre. Sauf si quelqu'un colle un `data:image/...;base64,...` dans le champ URL de l'image.

#### B4bis. `Vercel Blob: This blob already exists` (v2+)
- Depuis `@vercel/blob` v2, `put()` refuse par défaut d'écraser un blob existant.
- Le pattern de stockage utilisé ici écrit toujours vers le même chemin (`data/offers.json`, `data/gallery.json`, etc.) avec `addRandomSuffix: false`, donc chaque écriture après la première déclenche l'erreur.
- **Fix appliqué** : ajouter `allowOverwrite: true` à chaque `put()` dans `lib/offers.ts`, `lib/gallery.ts`, `lib/categories.ts`, `lib/services.ts`, `lib/contact.ts`.
- Doc Vercel : https://vercel.link/blob-allow-overwrite

#### B5. Le handler POST ne wrap pas ses erreurs
- **Fichier** : `app/api/offers/route.ts:10-35` — pas de `try/catch` autour de `addOffer()`.
- Si `addOffer` throw, Next.js renvoie une page HTML 500 → client affiche "Erreur réseau".
- **Fix recommandé** : wrapper le POST dans `try/catch` et renvoyer `NextResponse.json({ error: err.message }, { status: 500 })`.

### Comment diagnostiquer précisément
1. Ouvrir la console navigateur (F12) → onglet **Network**.
2. Refaire l'action qui échoue.
3. Cliquer sur la requête `POST /api/offers` (ou celle qui a échoué).
4. Regarder :
   - **Status Code** — 401 (auth), 413 (trop gros), 500 (erreur serveur), 504 (timeout), (rien) = vraie panne réseau.
   - **Response** — si HTML, c'est le cas B ; si JSON, c'est le cas A.
5. Consulter les logs Vercel : `Vercel Dashboard → Deployments → Functions → View Logs`.

---

## 2. "Non autorisé" (401)

### Symptôme
Toute action admin renvoie `Non autorisé`.

### Cause
Le cookie `admin_session` est absent, expiré, ou signé avec un `SESSION_SECRET` différent.

### Corrections
- Se reconnecter via `/admin/login`.
- Sur Vercel, définir explicitement `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` dans les variables d'environnement.
- **Ne jamais** garder les valeurs par défaut de `lib/auth.ts` (`ziara-sahla-dev-secret`, `admin`, `ziara2026`) en production.

---

## 3. "Champs obligatoires manquants" (400)

### Symptôme
`POST /api/offers` renvoie `{ error: 'Champs obligatoires manquants' }`.

### Cause
`app/api/offers/route.ts:19-21` exige `title`, `img`, `dur`, `desc`. Un de ces champs est vide ou `null`.

Attention : `title`, `dur`, `desc` sont des objets `MLString` (`{fr, en, ar}`) et non des strings. Le check `!title` passe uniquement si l'objet lui-même est `null`/`undefined`, PAS si `title.fr === ''`. Donc en pratique cette erreur ne se déclenche que si le champ image est vide.

### Correction
Vérifier que l'URL de l'image (`img`) n'est pas vide avant de soumettre.

---

## 4. "Format non supporté" / "Fichier trop volumineux" (upload image, 400)

### Symptôme
Upload d'image dans la galerie ou pour une offre échoue.

### Cause
`app/api/gallery/upload/route.ts` :
- **Formats autorisés** : `jpeg, jpg, png, webp, gif, avif` (ligne 7). Refus si autre type MIME.
- **Taille max** : `10 MB` (ligne 8). Refus au-delà.

### Corrections
- Convertir l'image (Squoosh, TinyPNG, Photoshop → Export as JPG/WebP).
- Compresser si >10 MB. WebP donne d'excellents ratios pour les photos.

---

## 5. "Stockage non configuré" (500) sur Vercel

### Symptôme
Upload d'image renvoie `Stockage non configuré. Ajoutez la variable d'environnement BLOB_READ_WRITE_TOKEN...`.

### Cause
`app/api/gallery/upload/route.ts:43-48` : on est en environnement serverless (`process.env.VERCEL` défini) mais `BLOB_READ_WRITE_TOKEN` est absent. Sans Blob, impossible d'écrire des fichiers puisque le filesystem Vercel est en lecture seule.

### Correction
1. `Vercel Dashboard → Storage → Create Database → Blob`.
2. Attacher le store au projet ziara-sahla.
3. Redéployer (la variable est injectée automatiquement).

---

## 6. "Échec de l'upload: ..." (500)

### Symptôme
Upload d'image plante avec un message spécifique après tentative d'écriture.

### Cause
`app/api/gallery/upload/route.ts:55-59` : le `try/catch` renvoie le message d'erreur brut. Causes possibles :
- Token Blob invalide.
- Nom de fichier avec caractères Unicode problématiques (l'extension parsée à ligne 32 peut être vide).
- Quota Blob dépassé (500 MB gratuit sur Hobby).

### Corrections
- Vérifier le quota dans `Vercel Dashboard → Storage → Blob → Usage`.
- Renommer le fichier avec des caractères ASCII avant upload.

---

## 7. Les modifications ne persistent pas en local mais disparaissent sur Vercel

### Symptôme
En local (`npm run dev`), ajouter une offre marche et le fichier `data/offers.json` est modifié. Sur Vercel, l'ajout semble marcher mais l'offre disparaît au prochain rechargement.

### Cause
`lib/offers.ts:8-38` bascule automatiquement entre **filesystem local** et **Vercel Blob** selon la présence de `BLOB_READ_WRITE_TOKEN`.
- En local sans token : écrit dans `data/offers.json` ✓
- Sur Vercel sans token : essaie d'écrire dans `data/offers.json` sur un filesystem **read-only** → l'écriture échoue silencieusement OU l'écriture semble marcher mais est perdue au prochain cold start.

### Correction
**Toujours** configurer Vercel Blob en production (voir §5).

---

## 8. Erreurs de build sur Vercel

### Symptôme
Le déploiement échoue avec des erreurs TypeScript ou ESLint.

### Causes courantes
- Un type manquant (`any` non toléré par le lint strict).
- Un import cassé après renommage.
- Une variable d'environnement utilisée qui n'existe pas au build time.

### Correction
Reproduire en local :
```
npm run build
```
Corriger toutes les erreurs avant de push.

---

## 9. Images ne s'affichent pas (404 sur `/uploads/...`)

### Symptôme
Une image uploadée localement fonctionne, mais après déploiement Vercel elle renvoie 404.

### Cause
En local, l'upload écrit dans `public/uploads/` — servi automatiquement. Sur Vercel avec Blob activé, les URL renvoyées sont `https://<hash>.public.blob.vercel-storage.com/...`. Si l'image avait été uploadée en local puis committée dans le repo, elle marche. Si elle a été uploadée en preview sur Vercel Blob mais que le déploiement de production utilise un autre Blob store, l'URL est morte.

### Correction
- Ne pas mélanger : soit tout en Blob (recommandé), soit tout en `public/uploads/` avec commit git (dev only).
- Vérifier que Preview et Production partagent le même Blob store dans `Vercel → Storage → Blob → Environment`.

---

## 10. "Introuvable" (404) sur suppression / modification

### Symptôme
`DELETE /api/offers/[id]` ou `PUT /api/offers/[id]` renvoie `{ error: 'Introuvable' }`.

### Cause
L'`id` fourni ne correspond à aucune entrée. Souvent parce que le client a un state désynchronisé avec le serveur après un déploiement (l'offre a été supprimée par ailleurs, ou le Blob a été réinitialisé).

### Correction
Rafraîchir la page (`F5`) pour recharger la liste depuis le serveur.

---

## 11. Emails de contact non reçus

### Symptôme
Formulaire de contact envoyé, l'utilisateur voit "succès", mais aucun email n'arrive.

### Cause
`lib/mailer.ts` utilise SMTP (nodemailer). Sur Vercel il faut définir :
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`

Si une variable manque, l'API répond quand même 200 côté client mais l'envoi échoue côté serveur.

### Correction
- Configurer toutes les variables SMTP dans Vercel.
- Tester avec `/api/test-email` (route de debug).
- Consulter les logs Vercel Functions pour voir l'erreur SMTP réelle.

---

## Comment améliorer la visibilité des erreurs

Recommandations pour éviter que "Erreur réseau" masque la vraie cause :

1. **Envelopper chaque route API dans un `try/catch`** qui renvoie toujours du JSON, même en cas d'exception :
   ```ts
   export async function POST(req: NextRequest) {
     try {
       // ... logique
     } catch (err) {
       console.error('[POST /api/offers]', err)
       const message = err instanceof Error ? err.message : 'Erreur inconnue'
       return NextResponse.json({ error: message }, { status: 500 })
     }
   }
   ```

2. **Côté client**, distinguer les deux cas dans le `catch` :
   ```ts
   } catch (err) {
     const msg = err instanceof TypeError
       ? a.networkError                    // vrai fetch failure
       : `Erreur inattendue: ${err}`        // parsing / autre
     setMsg(msg)
   }
   ```

3. **Toujours consulter les logs Vercel** avant de conclure à une panne réseau :
   `Vercel Dashboard → Project → Deployments → [le déploiement] → Functions → View Function Logs`.

4. **Variables d'environnement à toujours définir sur Vercel** :
   - `BLOB_READ_WRITE_TOKEN` (auto si Blob store attaché)
   - `SESSION_SECRET` (chaîne aléatoire longue)
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`
