# Guide de personnalisation — Base réutilisable

Ce projet est une **base white-label** : site vitrine + catalogue + dashboard leads + bot WhatsApp.
Tout ce qui est spécifique à une entreprise est centralisé. Pour livrer un nouveau client,
on édite quelques fichiers de configuration au lieu de fouiller le code.

## 🎯 Checklist express (nouveau client, même secteur)

| # | Fichier | Ce qu'on change |
|---|---------|-----------------|
| 1 | [`config/site.yaml`](config/site.yaml) | Nom, contact, adresse, horaires, réseaux, SEO, menus, messages WhatsApp |
| 2 | [`src/config/theme.ts`](src/config/theme.ts) | Couleurs et polices de la marque |
| 3 | [`src/data/models.ts`](src/data/models.ts) | Les produits / articles du catalogue |
| 4 | `public/logo.jpeg` | Le logo (garder le même nom, ou l'adapter dans `site.yaml > brand.logo`) |
| 5 | `.env.local` | Variables secrètes (voir plus bas) |

> `config/site.yaml` est transformé en TS au build (`npm run gen:config`, lancé
> automatiquement avant `dev` et `build`). Le site tournant dans le navigateur,
> on ne lit pas le YAML au runtime — on le compile. N'édite jamais le fichier
> généré `src/config/site.generated.ts`.

Aucune couleur, aucun nom de marque, aucun numéro n'est censé être codé en dur ailleurs.

---

## 1. Configuration du site — `config/site.yaml`

Source unique de vérité (éditable sans coder) pour :

- **brand** — nom, raison sociale, logo, slogan, description
- **contact** — téléphone, WhatsApp, email, adresse, ville, carte Google Maps, horaires, réseaux sociaux
- **catalog** — terminologie du secteur (`itemNoun` : « modèle », « article », « produit »…)
- **seo** — titre, mots-clés, langue, locale Open Graph
- **nav** / **footerLinks** — menus de navigation et liens du pied de page
- **whatsapp** — messages pré-remplis (devis, fiche produit)

## 2. Thème — `src/config/theme.ts`

Les couleurs (`themeColors`) et polices (`themeFonts`) sont importées directement par
[`tailwind.config.ts`](tailwind.config.ts). Modifier ce fichier suffit à re-skinner tout le site.

> Les classes Tailwind utilisées dans le JSX (`text-gold`, `bg-black`, `text-grey-text`…)
> restent identiques ; seules leurs **valeurs** changent. Pas besoin de toucher au JSX.

## 3. Données catalogue — `src/data/models.ts`

C'est la seule partie **spécifique au métier**. Le schéma actuel (`Model`) décrit des
maisons : `area`, `bedrooms`, `bathrooms`, `type`, `floors`.

### Images (convention par dossier — zéro code)

On ne référence pas les images dans les données : on les **dépose**, elles sont scannées au build.

- **Photos d'un produit** → `public/catalogue/<ref>/*.jpg` (ex. `public/catalogue/dq103/1.jpg`).
  La 1ʳᵉ (ordre alphabétique) est la photo principale.
- **Image d'une catégorie** → `public/services/<catégorie>.jpg` (ex. `public/services/maison-acier.jpg`).
  Sert de visuel par défaut à tous les produits de la catégorie sans photo propre.

Cascade : photos du produit → image de service de la catégorie → placeholder. Le scan tourne via
`npm run gen:config` (avant `dev`/`build`) et écrit `src/data/images.generated.ts` (gitignoré, ne pas éditer).
Helper : `getModelImages(model)` dans [`src/data/images.ts`](src/data/images.ts).

## 4. Variables d'environnement — `.env.local`

```bash
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=...              # openssl rand -base64 32

# Auth dashboard
ADMIN_EMAIL=admin@client.com
ADMIN_PASSWORD_HASH=$2a$10$...  # hash bcrypt (recommandé) — voir ci-dessous
# ADMIN_PASSWORD=motdepasse      # alternative en clair (dev uniquement)

# WhatsApp (public — utilisé par wa.me côté client)
NEXT_PUBLIC_WHATSAPP=22670000000

# WhatsApp Cloud API (notifications équipe + bot) — optionnel
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_ID=...
WHATSAPP_TEAM_PHONE=22670000000
WHATSAPP_VERIFY_TOKEN=...
```

**Générer le hash du mot de passe admin** : lancer le serveur puis `POST /api/auth/register`
(retourne un `passwordHash` à coller dans `ADMIN_PASSWORD_HASH`). L'auth compare désormais
le mot de passe saisi à ce hash bcrypt ; le fallback en clair n'est là que pour le dev.

---

## 🧥 Adapter pour un autre secteur (ex. vente de vêtements)

Le socle (config, thème, dashboard leads, formulaire, bot, auth) est **agnostique du métier**.
Seule la couche « catalogue » change. Étapes :

1. **Config** — dans `config/site.yaml`, passer `catalog.itemNoun` à `« article »` / `itemNounPlural` à `« articles »`,
   ajuster `nav.catalogueDropdown` et `footerLinks` (ex. « Homme », « Femme », « Nouveautés »).
2. **Données** — remplacer le schéma `Model` de `src/data/models.ts` par un schéma vêtement :
   ```ts
   export interface Model {
     ref: string; slug: string; name: string
     price: number; sizes: string[]; colors: string[]
     category: 'homme' | 'femme' | 'accessoire'
     description: string; images: string[]
   }
   ```
   Adapter les helpers de filtres en bas du fichier (remplacer `areaRanges`/`bedroomCounts`
   par `sizes`/`colors`).
3. **Pages catalogue / fiche** — `src/app/(site)/catalogue/CatalogueContent.tsx` et
   `src/app/(site)/modele/[slug]/` affichent les champs métier (m², chambres → tailles, prix).
   C'est le seul JSX à retoucher.
4. **Types leads** — dans [`src/types/index.ts`](src/types/index.ts), le champ `projectType`
   liste des catégories construction. À élargir/renommer selon le secteur.
5. **Pages secteur** — les pages `maisons-acier`, `conteneur-de-vie`, `construction-modulaire`
   sont spécifiques à l'habitat : les supprimer ou les remplacer, et mettre à jour `footerLinks`.

Ce qui **ne bouge pas** entre secteurs : le dashboard, l'API leads, l'auth, les notifications
WhatsApp, le bot de qualification, tout le design system (`src/components/ui`).

---

## 📁 Repères

```
config/site.yaml       ← identité, contact, menus, SEO, WhatsApp (À ÉDITER, sans coder)
src/
├── config/
│   ├── site.generated.ts ← généré depuis site.yaml (ne pas éditer)
│   ├── site.ts        ← assemble le YAML + parties dynamiques (env, messages)
│   └── theme.ts       ← couleurs + polices (à éditer)
├── data/models.ts     ← produits du catalogue (à remplacer selon le secteur)
├── app/(site)/        ← pages publiques
├── app/(dashboard)/   ← dashboard leads (agnostique métier)
├── app/api/           ← leads, auth, webhook WhatsApp
├── components/        ← UI réutilisable + layout (navbar/footer pilotés par config)
└── lib/               ← mongodb, auth, whatsapp
```
