# Cahier des Charges — Modu Habitat International
**Projet : Site Web + Dashboard Leads + Bot WhatsApp**
*Version 1.0 — Juin 2026*
*Rédigé par Azaël Sawadogo — Développeur Full-Stack*

---

## 1. Contexte & Objectifs

### 1.1 Présentation du client
Modu Habitat International est une entreprise basée à Ouagadougou, Burkina Faso, spécialisée dans la construction modulaire : maisons en acier, conteneurs de vie et bâtiments préfabriqués. Elle distribue des modèles du fabricant chinois **Daquan Group** (15 modèles du DQ101 au DQ209, de 24m² à 356m²).

L'entreprise est active sur TikTok, Facebook et WhatsApp Business. Elle ne dispose d'aucun site web ni d'aucun système structuré de gestion des prospects.

### 1.2 Problème identifié
Les prospects découvrent Modu Habitat via les réseaux sociaux, envoient un message WhatsApp, et disparaissent faute de suivi structuré. Les leads sont perdus, non tracés, non relancés. L'entreprise ne sait pas combien de prospects elle a ni où chacun en est.

### 1.3 Objectifs du projet
1. **Générer** des leads qualifiés via un site web professionnel
2. **Capturer** automatiquement chaque prospect intéressé
3. **Suivre** chaque lead de la prise de contact à la signature
4. **Ne jamais perdre** un prospect — même la nuit, même le weekend

---

## 2. Périmètre du projet

Le projet se décompose en **3 livrables** :

| Livrable | Description | Phase |
|----------|-------------|-------|
| Site Web | Vitrine professionnelle + catalogue 15 modèles | 1 |
| Dashboard | Interface de gestion des leads pour l'équipe | 2 |
| Bot WhatsApp | Accueil automatique + qualification des prospects | 3 |

---

## 3. Site Web

### 3.1 Architecture des pages

```
/                        → Accueil
/catalogue               → Catalogue complet (15 modèles)
/modele/[slug]           → Fiche détail par modèle
/realisations            → Galerie projets livrés
/contact                 → Formulaire + WhatsApp + Carte
```

### 3.2 Page Accueil `/`

**Section Hero**
- Grande image ou vidéo d'une construction Modu Habitat
- Titre : `CONSTRUIRE AUTREMENT.`
- Sous-titre : `Maisons modulaires livrées en 15 à 20 jours à Ouagadougou`
- CTA primaire : `Voir le catalogue` → /catalogue
- CTA secondaire : `Nous contacter` → ouvre WhatsApp direct

**Section Chiffres**
- 15 modèles disponibles
- 15–20 jours de livraison
- Durée de vie ≥ 100 ans
- *(chiffres à valider avec Modu Habitat)*

**Section Aperçu Catalogue**
- 6 modèles mis en avant (sélection visuelle)
- Bouton `Voir tous les modèles →`

**Section Avantages**
- Livraison ultra-rapide vs construction traditionnelle
- Structure acier certifiée (résistance sismique 8.5, anti-feu 4h, anti-vent 150km/h)
- Prix maîtrisé, devis fixe respecté
- Équipe locale basée à Ouaga

**Section CTA Final**
- Fond doré, texte noir
- `Votre projet commence par une conversation. Devis gratuit sous 24h.`
- Bouton `Nous contacter sur WhatsApp`

**Footer**
- Logo, liens, coordonnées, réseaux sociaux, horaires

---

### 3.3 Page Catalogue `/catalogue`

**Filtres**
- Par type : Tous / Plain-pied (série 100) / Étage (série 200)
- Par superficie : Petit (< 80m²) / Moyen (80–150m²) / Grand (> 150m²)
- Par nombre de chambres : 1 / 2 / 3 / 4 / 5+

**Grille modèles**
Chaque card affiche :
- Photo principale du modèle
- Référence (ex: DQ103)
- Superficie (ex: 60m²)
- Nb chambres / salles de bain
- Bouton `Voir ce modèle →`

**15 modèles à intégrer**

| Réf | Superficie | Chambres | SDB | Type |
|-----|------------|----------|-----|------|
| DQ101 | 24m² | 1 | 1 | Plain-pied |
| DQ102 | 42m² | 1 | 1 | Plain-pied |
| DQ103 | 60m² | 2 | 1 | Plain-pied |
| DQ104 | 55m² | 2 | 1 | Plain-pied |
| DQ105 | 50m² | 2 | 2 | Plain-pied |
| DQ106 | 77m² | 2 | 1 | Plain-pied |
| DQ107 | 100m² | 2 | 1 | Plain-pied |
| DQ108 | 105m² | 3 | 2 | Plain-pied |
| DQ109 | 120m² | 3 | 2 | Plain-pied |
| DQ110 | 128m² | 4 | 2 | Plain-pied |
| DQ111 | 133m² | 3 | 2 | Plain-pied |
| DQ112 | 137m² | 3 | 2 | Plain-pied |
| DQ113 | 186.5m² | 4 | 2 | Plain-pied |
| DQ114 | 225m² | 3 | 3 | Plain-pied |
| DQ115 | 268m² | 3 | 4 | Plain-pied |
| DQ201 | 85m² | 3 | 1 | Étage |
| DQ202 | 130m² | 3 | 2 | Étage |
| DQ203 | 140m² | 4 | 2 | Étage |
| DQ204 | 158m² | 4 | 3 | Étage |
| DQ205 | 163m² | 3 | 3 | Étage |
| DQ206 | 240m² | 4 | 3 | Étage |
| DQ207 | 260m² | 3 | 3 | Étage |
| DQ208 | 300m² | 4 | 4 | Étage |
| DQ209 | 356m² | 5 | 4 | Étage |

---

### 3.4 Page Fiche Modèle `/modele/[slug]`

Structure de chaque fiche :

1. **Hero** — grande photo extérieure + référence + superficie en titre
2. **Galerie** — photos extérieure + intérieure + plan 2D
3. **Caractéristiques techniques**

| Caractéristique | Valeur |
|----------------|--------|
| Superficie | Xm² |
| Chambres | X |
| Salles de bain | X |
| Étages | X |
| Délai de livraison | 15–20 jours |
| Durée de vie | ≥ 100 ans |
| Résistance sismique | 8.5 degrés |
| Résistance au feu | ≥ 4 heures |
| Résistance au vent | ≥ 150 km/h |
| Isolation thermique | Δ ≥ 10°C |
| Isolation phonique | ≥ 45 dB |

4. **CTA intelligent** (point clé du workflow) :

> Bouton : `Je suis intéressé par ce modèle`
>
> → Ouvre WhatsApp avec message pré-rempli :
> `Bonjour, je suis intéressé par le modèle DQ103 (60m² - 2 chambres). Pouvez-vous me donner plus d'informations ?`
>
> → Le bot WhatsApp reçoit ce message et sait immédiatement quel modèle intéresse le prospect

5. **Autres modèles** — suggestion de 3 modèles similaires en bas de page

---

### 3.5 Page Réalisations `/realisations`

- Grille photos des projets livrés par Modu Habitat à Ouaga
- Filtre par type de modèle
- Clic → modal : modèle, zone, année, courte description
- *(Photos à fournir par Modu Habitat)*

---

### 3.6 Page Contact `/contact`

**Colonne gauche — Formulaire**
- Champs : Nom complet, Téléphone (obligatoire), Email (optionnel), Modèle intéressé (liste déroulante des 15 modèles ou "Pas encore décidé"), Message
- Bouton `Envoyer ma demande`
- Action : création du lead dans le dashboard + notification WhatsApp à l'équipe

**Colonne droite — Accès direct**
- Bouton WhatsApp (grand, visible)
- Adresse bureau
- Horaires : 09h00 – 18h00
- Carte Google Maps intégrée

---

### 3.7 Direction Design

**Concept : Industriel raffiné**
Le site doit inspirer confiance immédiatement. Pas un site BTP africain classique — une présence internationale, ancrée localement.

**Palette**
```
Fond principal   : #0A0A0A  (noir)
Accent primaire  : #F5A623  (or — couleur Modu Habitat)
Accent secondaire: #1E90FF  (bleu — couleur Modu Habitat)
Texte principal  : #F8F8F4  (blanc cassé)
Texte secondaire : #A0A0A0  (gris)
Sections alt     : #1A1A1A  (noir légèrement plus clair)
```

**Typographie**
- Titres : `Bebas Neue` (fort, industriel)
- Corps : `DM Sans` (lisible, moderne)
- Chiffres/stats : `Space Mono` (technique)

**Principes**
- Fond sombre dominant — tranche avec 99% des sites locaux
- Grandes images plein écran
- Animations sobres au scroll (fade + slide)
- Mobile-first — optimisé pour connexions lentes (3G Ouaga)

---

### 3.8 Stack Technique — Site Web

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Rendu | SSG (Static Site Generation) |
| Images | WebP + lazy loading |
| Hébergement | Vercel |
| Domaine | moduhabitat.com ou moduhabitat.bf |
| Performance cible | Lighthouse > 90 mobile |

---

## 4. Dashboard de Gestion des Leads

### 4.1 Accès & Rôles

| Rôle | Accès |
|------|-------|
| Admin | Tout voir, gérer utilisateurs, voir stats |
| Commercial | Voir et modifier les leads |

- URL : `dashboard.moduhabitat.com`
- Auth : email + mot de passe (JWT)
- Interface responsive — utilisable sur mobile

---

### 4.2 Sources de leads

Tous les leads arrivent dans le même dashboard, peu importe la source :

| Source | Déclencheur |
|--------|-------------|
| Site Web | Formulaire contact soumis |
| Bot WhatsApp | Prospect qualifié par le bot |
| Saisie manuelle | Lead reçu par appel direct ou référence |

---

### 4.3 Vue Principale — Liste des Leads

**Colonnes du tableau**

| # | Nom | Téléphone | Modèle | Source | Statut | Date | Actions |
|---|-----|-----------|--------|--------|--------|------|---------|

**Statuts**

| Statut | Signification |
|--------|--------------|
| 🔵 Nouveau | Lead vient d'entrer, pas encore contacté |
| 🟡 En cours | Contacté, discussion ouverte |
| 🟠 Devis envoyé | Devis transmis, en attente réponse |
| 🟢 Signé | Client confirmé, contrat signé |
| 🔴 Perdu | Sans suite, abandonné |

**Filtres disponibles**
- Par statut
- Par modèle demandé
- Par source (Site / Bot / Manuel)
- Par période (cette semaine / ce mois / personnalisé)

**Actions rapides par ligne**
- Ouvrir WhatsApp avec ce numéro (`wa.me/...`)
- Changer le statut (dropdown)
- Voir la fiche complète

---

### 4.4 Vue Détail — Fiche Lead

```
[← Retour à la liste]

NOM DU PROSPECT                        🟡 En cours  [Modifier ▼]
+226 XX XX XX XX  |  Modèle : DQ103 (60m²)  |  Source : Bot WhatsApp

── INFORMATIONS ──────────────────────────────────────────────────
Modèle demandé    : DQ103 — 60m², 2 chambres, 1 salle de bain
Usage             : Résidence principale
Zone du projet    : Pissy, Ouagadougou
Budget estimé     : À discuter
Message initial   : "Je suis intéressé par le modèle DQ103"
Date de contact   : 03 juin 2026, 14h32

── NOTES INTERNES ────────────────────────────────────────────────
[03/06 - Prisca] Appelé, intéressé, demande délai et prix
[04/06 - Prisca] Envoyé fiche technique par WhatsApp

── AJOUTER UNE NOTE ──────────────────────────────────────────────
[ Votre note...                                          ] [Ajouter]

[📲 Ouvrir WhatsApp]    [📄 Voir fiche modèle]    [🗑️ Supprimer]
```

---

### 4.5 Tableau de Bord — KPIs

**4 cards en haut de page**

```
[ X ]              [ X ]             [ X ]            [ X ]
Leads ce mois    Devis envoyés     Signés ce mois   À relancer
```

**Graphique**
- Leads par semaine sur les 8 dernières semaines (bar chart)

**Section "À traiter aujourd'hui"**
- Liste des leads sans activité depuis +48h
- Bouton relance rapide WhatsApp par lead

---

### 4.6 Stack Technique — Dashboard

| Composant | Technologie |
|-----------|-------------|
| Frontend | React + Tailwind CSS |
| Backend | NestJS (Node.js) |
| Base de données | PostgreSQL (Neon) |
| Auth | JWT |
| Hébergement frontend | Vercel |
| Hébergement backend | Railway |

**Endpoints API principaux**

```
POST   /api/leads              → Créer un lead
GET    /api/leads              → Lister leads (avec filtres)
GET    /api/leads/:id          → Détail lead
PUT    /api/leads/:id          → Modifier statut / infos
POST   /api/leads/:id/notes    → Ajouter note interne
GET    /api/stats              → KPIs dashboard
POST   /api/auth/login         → Authentification
```

---

## 5. Bot WhatsApp

### 5.1 Principe

Le bot est connecté au **numéro WhatsApp Business existant** de Modu Habitat via l'**API Cloud WhatsApp (Meta)** — gratuite jusqu'à 1000 conversations/mois.

Il ne remplace pas l'équipe. Il **prépare le terrain** : accueille le prospect, comprend son besoin, crée le lead dans le dashboard, et alerte l'équipe.

---

### 5.2 Workflow Complet

```
VISITEUR SITE WEB
       ↓
Consulte les fiches modèles
       ↓
Clique "Je suis intéressé par ce modèle"
       ↓
WhatsApp s'ouvre avec message pré-rempli :
"Bonjour, je suis intéressé par le modèle 
DQ103 (60m² - 2 chambres)"
       ↓
BOT REÇOIT LE MESSAGE
Détecte le modèle mentionné → contexte connu
       ↓
ÉTAPE 1 — Accueil
"Bonjour ! Merci pour votre intérêt pour 
le DQ103 😊 Je suis l'assistant de 
Modu Habitat. Quelques questions rapides 
pour mieux vous aider."
       ↓
ÉTAPE 2 — Usage
"C'est pour quel usage ?
1️⃣ Résidence principale
2️⃣ Résidence secondaire
3️⃣ Bureau / Commerce
4️⃣ Location"
       ↓
ÉTAPE 3 — Zone
"Dans quelle zone de Ouaga prévoyez-vous 
de construire ?"
       ↓
ÉTAPE 4 — Contact
"Votre prénom et votre numéro 
pour qu'un conseiller vous rappelle ?"
       ↓
LEAD CRÉÉ EN BASE
Statut : 🔵 Nouveau
Source : Bot WhatsApp
Modèle : DQ103
Usage / Zone / Contact : renseignés
       ↓
NOTIFICATION ÉQUIPE (WhatsApp)
"🔔 Nouveau lead — Modu Habitat
Modèle  : DQ103 (60m²)
Nom     : Moussa
Tel     : +226 70 XX XX XX
Usage   : Résidence principale
Zone    : Pissy
→ dashboard.moduhabitat.com"
       ↓
MESSAGE FINAL AU PROSPECT
"Parfait ! Un conseiller Modu Habitat 
vous contactera dans les 24h. 
Bonne journée 🙏"
```

---

### 5.3 Gestion des cas hors catalogue

Si le prospect contacte WhatsApp directement (sans passer par le site) :

```
BOT : "Bonjour ! Bienvenue chez Modu Habitat 
International 👋

Nous proposons des maisons modulaires 
livrées en 15 à 20 jours.

Que recherchez-vous ?
1️⃣ Voir notre catalogue de modèles
2️⃣ Parler à un conseiller
3️⃣ Obtenir un devis"
```

---

### 5.4 Stack Technique — Bot

| Composant | Technologie |
|-----------|-------------|
| API WhatsApp | Meta WhatsApp Cloud API (gratuite) |
| Backend bot | NestJS (partagé avec le dashboard) |
| Webhook | Endpoint `/webhook/whatsapp` |
| État conversation | Redis (sessions temporaires) |
| Création lead | API interne `/api/leads` |
| Notification équipe | API WhatsApp (même compte) |

---

## 6. Intégration Globale

### 6.1 Schéma d'ensemble

```
┌─────────────────────────────────────────────────┐
│                  SITE WEB                        │
│  Catalogue 15 modèles → Fiche → CTA WhatsApp    │
│  Formulaire contact                              │
└──────────────────┬──────────────────────────────┘
                   │ POST /api/leads
                   ▼
┌─────────────────────────────────────────────────┐
│               BACKEND (NestJS)                   │
│  API leads / Auth / Stats / Webhook WhatsApp     │
│  Base de données : PostgreSQL                    │
│  Sessions bot : Redis                            │
└───────┬─────────────────────┬───────────────────┘
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────────────────┐
│  DASHBOARD    │    │      BOT WHATSAPP           │
│  React        │    │  WhatsApp Cloud API         │
│  Gestion leads│    │  Qualification prospects    │
│  KPIs, notes  │    │  Notification équipe        │
└───────────────┘    └────────────────────────────┘
```

---

## 7. Phases de Livraison

### Phase 1 — Site Web (3 semaines)

- [ ] Maquette validée par Modu Habitat
- [ ] Intégration des 15 modèles Daquan (photos + plans + specs)
- [ ] Développement des 5 pages
- [ ] CTA WhatsApp avec message pré-rempli par modèle
- [ ] Formulaire connecté au backend
- [ ] Déploiement Vercel + nom de domaine
- [ ] Tests performance mobile (3G)

### Phase 2 — Dashboard (2 semaines)

- [ ] Backend API (leads CRUD + auth + stats)
- [ ] Interface dashboard (liste + fiche + KPIs)
- [ ] Notifications WhatsApp équipe
- [ ] Tests + formation Mme Prisca (30 min)
- [ ] Déploiement production

### Phase 3 — Bot WhatsApp (2 semaines)

- [ ] Configuration WhatsApp Cloud API (Meta)
- [ ] Développement scénarios de conversation
- [ ] Intégration avec backend (création leads)
- [ ] Tests end-to-end (site → bot → dashboard)
- [ ] Mise en production

---

## 8. Contraintes Techniques

| Contrainte | Détail |
|-----------|--------|
| Performance | Site fonctionnel sur connexion 3G à Ouaga |
| Mobile-first | 80%+ des visites seront sur mobile |
| Langue | Français uniquement |
| WhatsApp | API Cloud Meta (pas de solution tierce payante) |
| Hébergement | Solutions gratuites ou très bon marché (Vercel, Neon, Railway) |
| Nom de domaine | Budget inclus dans le devis (1 an) |

---

## 9. Récapitulatif Financier

| Livrable | Inclus dans 200 000 XOF |
|----------|------------------------|
| Site web complet (5 pages + catalogue 15 modèles) | ✅ |
| Dashboard gestion leads | ✅ |
| Intégration formulaire → dashboard | ✅ |
| Notifications WhatsApp équipe | ✅ |
| Nom de domaine 1 an | ✅ |
| Hébergement 1 an | ✅ |
| Support & dépannage | ✅ |
| Formation équipe | ✅ |

**Bot WhatsApp (Phase 3) : devis séparé à établir**

---

## 10. Livrables Attendus du Client

Pour démarrer le projet, Modu Habitat doit fournir :

- [ ] Photos des réalisations à Ouagadougou
- [ ] Logo en haute résolution (fourni ✅)
- [ ] Numéro WhatsApp Business à connecter
- [ ] Accès au compte Meta Business (pour l'API WhatsApp)
- [ ] Validation des chiffres (projets livrés, années d'expérience)
- [ ] Textes de présentation de l'entreprise
- [ ] Confirmation des modèles Daquan disponibles à la vente

---

*Document confidentiel — Modu Habitat International × Azaël Sawadogo*
*GitHub : github.com/NICE-DEV226 | Portfolio : sawadogoazael.com*