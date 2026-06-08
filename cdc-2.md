# Modu Habitat International — Document de Conception
**Site Web + Dashboard de gestion des leads**
*Rédigé par Azaël Sawadogo — Développeur Full-Stack*

---

## 1. Vision Globale

### Positionnement
Modu Habitat International est une entreprise de construction modulaire haut de gamme à Ouagadougou. Le site doit refléter **sérieux, modernité et solidité** — pas un site vitrine générique, mais une présence digitale qui inspire confiance immédiatement à un prospect qui ne les connaît pas.

### Objectifs du projet
1. **Générer des leads qualifiés** via le site web
2. **Capturer et suivre chaque prospect** via le dashboard
3. **Ne jamais perdre un contact** — chaque visiteur intéressé doit finir dans la base

### Audience cible
- Particuliers 25–45 ans à Ouagadougou et Bobo-Dioulasso cherchant une alternative à la construction traditionnelle
- PME et promoteurs cherchant des bureaux ou logements modulaires
- Burkinabè de la diaspora cherchant à construire au pays

---

## 2. Direction Design — Site Web

### Concept : "Acier & Lumière"
L'identité visuelle de Modu Habitat est déjà forte : **noir, jaune or, bleu électrique**. On la pousse jusqu'au bout. Le site ne ressemble pas à un site BTP africain classique — il ressemble à un site d'architecture internationale, mais ancré dans la réalité burkinabè.

**Ton visuel :** Industriel raffiné. Pas agressif, pas générique. Comme un architecte qui connaît son métier.

### Palette de couleurs
```
--color-black:     #0A0A0A   /* fond principal */
--color-gold:      #F5A623   /* accent primaire — jaune Modu */
--color-blue:      #1E90FF   /* accent secondaire — bleu Modu */
--color-white:     #F8F8F4   /* texte sur fond sombre */
--color-grey-dark: #1A1A1A   /* sections alternées */
--color-grey-mid:  #2C2C2C   /* cards, bordures */
--color-grey-text: #A0A0A0   /* texte secondaire */
```

### Typographie
- **Display/Titres :** `Bebas Neue` — fort, industriel, lisible en grand
- **Corps/Paragraphes :** `DM Sans` — moderne, propre, excellent sur mobile
- **Accent chiffres/stats :** `Space Mono` — technique, crédible

### Principes de mise en page
- Fond sombre dominant (noir #0A0A0A) — tranche avec 99% des sites burkinabè
- Grandes images plein écran des réalisations
- Asymétrie contrôlée — pas de grilles parfaitement centrées
- Animations sobres : révélation au scroll (fade + slide), pas de fioritures
- Performance mobile d'abord — chargement rapide sur 3G

---

## 3. Architecture du Site Web

### Structure des pages

```
/                   → Accueil (Hero + Offres + Stats + CTA)
/maisons-acier      → Fiche produit Maison en Acier
/conteneur-de-vie   → Fiche produit Conteneur de Vie
/construction-modulaire → Fiche produit Construction Modulaire
/realisations       → Galerie des projets livrés
/contact            → Formulaire + WhatsApp + Carte
```

---

### Page 1 — Accueil `/`

#### Section Hero
- **Fond :** Vidéo ou grande photo d'un conteneur Modu installé, légèrement assombrie
- **Titre principal :** `CONSTRUIRE AUTREMENT.` (Bebas Neue, 96px desktop / 52px mobile)
- **Sous-titre :** `Maisons en acier, conteneurs de vie et construction modulaire à Ouagadougou.`
- **CTA primaire :** Bouton `→ Demander un devis` (gold, ouvre WhatsApp direct)
- **CTA secondaire :** `Voir nos réalisations` (outline blanc)
- **Scroll indicator :** ligne dorée animée vers le bas

#### Section Chiffres / Preuves sociales
3 colonnes centrées, fond noir :
```
[ 50+ ]          [ 3 semaines ]        [ 10 ans ]
Projets livrés   Délai de livraison    d'expérience
```
*(chiffres à valider avec Modu Habitat)*

#### Section Nos Offres
3 cards horizontales (desktop) / verticales (mobile) :

**Card 1 — Maison en Acier**
- Icône + grande photo
- Description courte : `Structure métallique durable, assemblage rapide, personnalisable selon vos plans.`
- Lien `Découvrir →`

**Card 2 — Conteneur de Vie**
- Icône + grande photo
- Description courte : `Transformation de conteneurs maritimes en espaces de vie modernes et confortables.`
- Lien `Découvrir →`

**Card 3 — Construction Modulaire**
- Icône + grande photo
- Description courte : `Modules préfabriqués assemblés sur site. Rapide, économique, solide.`
- Lien `Découvrir →`

#### Section Pourquoi Modu Habitat ?
4 points différenciants avec icônes :
- ⚡ **Livraison rapide** — 2 à 4 semaines contre 6–12 mois en traditionnel
- 🏗️ **Qualité acier** — Structure certifiée, résistante aux conditions climatiques africaines
- 💰 **Coût maîtrisé** — Pas de mauvaises surprises, devis fixe respecté
- 📍 **Basé à Ouaga** — Équipe locale, disponible, vous suivez votre chantier

#### Section Réalisations (aperçu)
Grille 3 photos de projets terminés avec un bouton `Voir toutes nos réalisations →`

#### Section CTA Final
Fond gold (#F5A623), texte noir :
> **Votre projet commence par une conversation.**
> Décrivez-nous ce que vous voulez. Devis gratuit sous 24h.
> `[Nous contacter sur WhatsApp]`

#### Footer
- Logo Modu Habitat
- Liens pages
- Coordonnées : numéro, horaires
- Réseaux : TikTok, Facebook, WhatsApp
- `© 2025 Modu Habitat International`

---

### Page 2 — Fiche Produit (modèle identique pour les 3)

**Structure :**
1. **Hero produit** — grande image, titre, accroche 1 ligne
2. **Description complète** — matériaux, dimensions disponibles, avantages
3. **Galerie photos** — 6–8 photos de réalisations de ce type
4. **Points techniques** — tableau simple (superficie min/max, délai, garantie...)
5. **FAQ** — 3–4 questions fréquentes sur ce produit
6. **CTA** — `Demander un devis pour ce produit →` (WhatsApp avec message pré-rempli)

---

### Page 3 — Réalisations `/realisations`

- Filtre par type : Tous / Maison Acier / Conteneur / Modulaire
- Grille masonry (comme Pinterest) — photos projets livrés
- Clic sur photo → modal avec : nom projet, ville, type, année, courte description
- Pas de noms clients sans autorisation

---

### Page 4 — Contact `/contact`

**Deux colonnes desktop :**

*Colonne gauche :*
- Formulaire : Nom, Téléphone (obligatoire), Email (optionnel), Type de projet, Message
- Bouton `Envoyer` → crée lead dans dashboard + envoie notification WhatsApp à l'équipe

*Colonne droite :*
- Bouton WhatsApp direct (gros, bien visible)
- Adresse bureau
- Horaires : 09h00 – 18h00
- Carte Google Maps intégrée

---

## 4. Optimisations Techniques

### Performance (critique pour Ouaga)
- **Next.js** avec SSG (génération statique) — chargement quasi instantané
- Images compressées WebP, lazy loading systématique
- Pas de dépendances lourdes inutiles
- Score Lighthouse cible : **> 90** sur mobile
- Fonctionne correctement sur **3G / connexion lente**

### SEO
- Balises title/meta uniques par page
- Structured data (LocalBusiness, Product)
- Sitemap XML généré automatiquement
- Mots-clés cibles : `maison modulaire Ouagadougou`, `maison acier Burkina Faso`, `conteneur de vie Ouaga`, `construction rapide Burkina`

### Hébergement recommandé
- **Frontend :** Vercel (gratuit, CDN global, HTTPS automatique)
- **Nom de domaine :** `moduhabitat.com` ou `moduhabitat.bf` — ~15 000 XOF/an
- **Backend/API :** Railway ou Render (plan gratuit suffisant pour démarrer)

---

## 5. Dashboard de Gestion des Leads

### Objectif
Permettre à Mme Prisca (responsable communication) et à l'équipe de **voir, suivre et relancer** chaque prospect en un coup d'œil. Interface simple, utilisable sur mobile.

### Accès
- URL privée : `dashboard.moduhabitat.com` ou `admin.moduhabitat.com`
- Authentification : email + mot de passe (pas de compte Google requis)
- Rôles : **Admin** (tout voir + gérer utilisateurs) / **Commercial** (voir + modifier leads)

---

### Vue principale — Liste des Leads

**Tableau avec colonnes :**
| # | Nom | Téléphone | Type projet | Source | Statut | Date | Actions |
|---|-----|-----------|-------------|--------|--------|------|---------|
| 1 | Moussa K. | +226 70... | Maison Acier | WhatsApp Bot | 🟡 En cours | 03/06 | Voir · Modifier |
| 2 | Aminata S. | +226 65... | Conteneur | Site Web | 🟢 Devis envoyé | 01/06 | Voir · Modifier |

**Statuts possibles :**
- 🔵 Nouveau (vient d'entrer)
- 🟡 En cours (contacté, discussion ouverte)
- 🟠 Devis envoyé (en attente de réponse)
- 🟢 Signé (client confirmé)
- 🔴 Perdu (sans suite)

**Filtres :**
- Par statut
- Par type de projet
- Par source (Site Web / WhatsApp Bot / Appel direct / Référence)
- Par période (cette semaine / ce mois / custom)

**Actions rapides :**
- Ouvrir WhatsApp avec ce numéro (lien direct `wa.me/...`)
- Changer le statut
- Ajouter une note interne

---

### Vue détail — Fiche Lead

```
[← Retour]

MOUSSA KONATÉ                              🟡 En cours  [Modifier statut ▼]
+226 70 XX XX XX  |  Maison en Acier  |  Source: WhatsApp Bot

── INFORMATIONS ──────────────────────────────────────────
Superficie souhaitée : 80m²
Budget estimé        : 6 000 000 XOF
Localisation projet  : Pissy, Ouagadougou
Message initial      : "Je veux une maison 3 chambres salon"
Date de contact      : 03 juin 2025, 14h32

── NOTES ÉQUIPE ──────────────────────────────────────────
[03/06 - Prisca] Appelé, intéressé, demande devis détaillé
[04/06 - Prisca] Devis PDF envoyé par WhatsApp

── AJOUTER UNE NOTE ──────────────────────────────────────
[ Zone de texte...                              ] [Ajouter]

[📲 Ouvrir WhatsApp]   [📄 Générer devis PDF]   [🗑️ Supprimer]
```

---

### Vue Tableau de Bord (accueil dashboard)

**4 KPI cards en haut :**
```
[ 12 ]           [ 4 ]            [ 3 ]           [ 5 ]
Leads ce mois    Devis envoyés    Signés          À relancer
```

**Graphique :** Leads par semaine (les 8 dernières semaines) — bar chart simple

**Section "À traiter aujourd'hui" :**
Liste des leads sans activité depuis +48h avec bouton relance rapide

---

### Stack Technique Dashboard

```
Frontend  : React + Tailwind CSS
Backend   : Node.js / NestJS + REST API
Base de données : PostgreSQL (Neon — gratuit pour démarrer)
Auth      : JWT tokens
Hébergement : Vercel (frontend) + Railway (backend)
```

**API endpoints principaux :**
```
POST /leads          → créer un lead (appelé par site web + bot)
GET  /leads          → liste avec filtres
GET  /leads/:id      → détail lead
PUT  /leads/:id      → modifier statut / infos
POST /leads/:id/notes → ajouter note
GET  /stats          → données KPI dashboard
```

---

## 6. Intégration Site Web ↔ Dashboard

### Flux complet

```
[Visiteur site web]
       ↓
Remplit formulaire contact (/contact)
       ↓
POST /api/leads (backend)
       ↓
Lead créé en base de données
       ↓
Notification WhatsApp envoyée à Mme Prisca
       ↓
Lead visible dans dashboard sous statut "Nouveau 🔵"
```

**Notification WhatsApp à l'équipe (format) :**
```
🔔 Nouveau lead — Modu Habitat

Nom     : Moussa Konaté
Tel     : +226 70 XX XX XX
Projet  : Maison en Acier
Message : "Je veux une maison 3 chambres"
Source  : Site Web

→ Voir dans le dashboard : https://dashboard.moduhabitat.com
```

---

## 7. Phases de Livraison

### Phase 1 — Site Web (2–3 semaines)
- [ ] Design Figma / maquette validée par Modu Habitat
- [ ] Développement pages Accueil + Contact + 3 Fiches produits
- [ ] Page Réalisations (avec photos fournies par client)
- [ ] Formulaire connecté au backend
- [ ] Déploiement Vercel + nom de domaine
- [ ] Tests mobile / performance

### Phase 2 — Dashboard (2 semaines)
- [ ] Backend API (leads CRUD + auth)
- [ ] Interface dashboard (liste + détail + stats)
- [ ] Notifications WhatsApp équipe
- [ ] Tests et formation Mme Prisca (30 min max)
- [ ] Déploiement production

### Phase 3 — Bot WhatsApp
*(données et spécifications à définir avec Modu Habitat)*
- Scénarios de conversation à concevoir
- Intégration WhatsApp Cloud API (Meta)
- Connexion au même backend (leads centralisés)

---

## 8. Récapitulatif Financier

| Livrable | Inclus |
|----------|--------|
| Site web complet (5 pages) | ✅ |
| Dashboard gestion leads | ✅ |
| Nom de domaine 1 an | ✅ |
| Hébergement 1 an | ✅ |
| Support & dépannage | ✅ |
| Formation équipe | ✅ |

**Prix total : 200 000 XOF**

*Bot WhatsApp : devis séparé après collecte des besoins spécifiques*

---

*Document confidentiel — Modu Habitat International × Azaël Sawadogo*
*Contact : github.com/NICE-DEV226 | sawadogoazael.com*