# Quiz Islamique 🕌

Application mobile de quiz islamique complète avec mode solo, multijoueur en temps réel, classement et système de progression.

## Description

Quiz Islamique est une application mobile React Native (Expo) connectée à une API Node.js/Express avec base de données PostgreSQL. Elle permet aux musulmans d'approfondir leurs connaissances islamiques (Fiqh, Aqida, Tafsir, Hadith, Sirah, Akhlaq) à travers des quiz gamifiés avec un système de niveaux et de badges.

## Prérequis

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Expo CLI (`npm install -g expo-cli`)
- npm ou yarn

## Structure du projet

```
application-islamique/
├── mobile/          # Application React Native (Expo)
├── backend/         # API Node.js/Express
├── shared/          # Types TypeScript partagés
└── README.md
```

## Installation

### 1. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier la configuration
cp .env.example .env

# Editer .env avec vos paramètres PostgreSQL et Redis
# DATABASE_URL=postgresql://user:password@localhost:5432/quiz_islamique
# JWT_SECRET=votre_secret_securise

# Créer la base de données
createdb quiz_islamique

# Lancer les migrations
npm run migrate

# Insérer les données de base (badges + 25 questions)
npm run seed

# Démarrer en développement
npm run dev
```

### 2. Mobile

```bash
cd mobile

# Installer les dépendances
npm install

# Créer le fichier de configuration (optionnel)
# Par défaut, l'API est sur http://localhost:3000/api
# Pour changer : créer un fichier .env avec :
# EXPO_PUBLIC_API_URL=http://votre-ip:3000/api

# Démarrer l'application
npm start

# Ouvrir sur Android
npm run android

# Ouvrir sur iOS
npm run ios
```

## Variables d'environnement (backend)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `PORT` | Port de l'API | `3000` |
| `DATABASE_URL` | URL PostgreSQL | - |
| `REDIS_URL` | URL Redis | `redis://localhost:6379` |
| `JWT_SECRET` | Secret JWT (à changer en prod!) | - |
| `JWT_EXPIRES_IN` | Durée de validité du JWT | `7d` |
| `NODE_ENV` | Environnement | `development` |

## Architecture

### Backend (Node.js/Express)

- **Routes** : `/api/auth`, `/api/questions`, `/api/quiz`, `/api/rooms`, `/api/users`, `/api/leaderboard`, `/api/badges`
- **Middleware** : JWT Auth, CORS
- **Socket.io** : Jeu multijoueur en temps réel
- **Base de données** : PostgreSQL avec pg Pool
- **Validation** : Zod

### Mobile (React Native/Expo)

- **Navigation** : Expo Router (file-based routing)
- **État global** : Zustand (auth, quiz, multiplayer)
- **API** : Axios avec intercepteur JWT automatique
- **Stockage sécurisé** : expo-secure-store pour le token JWT
- **Temps réel** : Socket.io-client

### Base de données

Tables : `users`, `questions`, `reponses`, `parties`, `joueurs_partie`, `badges`, `user_badges`, `signalements`

## Données incluses

### 25 Questions islamiques authentiques

Couvrant les domaines :
- **Fiqh** : Taharah, Salat (dont questions par Madhab)
- **Aqida** : Tawhid, Iman, Asma wa Sifat, Qadar
- **Hadith** : Arba'in An-Nawawiyya, Hadith Jibril, Arkan Al-Islam
- **Sirah** : Hijra, Enfance du Prophète ﷺ
- **Tafsir/Quran** : Questions générales, Tafsir Ahkam
- **Akhlaq** : Adab, comportements islamiques

Chaque question inclut :
- Texte en français et en arabe
- Dalil (preuve) : verset coranique ou hadith avec texte arabe
- Explication détaillée
- Référence du savant
- Grade du hadith (Sahih, Hasan...)

### 7 Badges

Al-Mujahid, Al-Hafiz, Al-Faqih, As-Siddiq, Al-Muhadith, Sahib As-Sabr, Al-Mufti

## Niveaux et XP

| Niveau | Titre | XP requis |
|--------|-------|-----------|
| 1 | Mubtadi' (مبتدئ) | 0 |
| 2 | Muta'allim (متعلم) | 500 |
| 3 | Mutawassit (متوسط) | 2 000 |
| 4 | Mutaqaddim (متقدم) | 5 000 |
| 5 | 'Alim (عالم) | 10 000 |
| 6 | Mufti (مفتي) | 20 000 |

**Formule XP** : `niveau × 10` par bonne réponse + bonus rapidité (+50% si < 5s) + bonus streak (+100 XP par 5 bonnes réponses consécutives)

## Modes de jeu

- **Quiz Classique** : Quiz à votre rythme
- **Défi Quotidien** : 5 questions renouvelées chaque jour
- **Mode Ta'allum** : Apprentissage avec explications
- **Mode Mura'jaah** : Révision des erreurs
- **Mode Prive** : Salle multijoueur avec code
- **Mode Halaqat** : Groupe de révision

## Fonctionnalités multijoueur

1. Créer une salle → obtenir un code à 6 chiffres
2. Partager le code
3. Joueurs rejoignent → liste en temps réel
4. L'hôte démarre
5. Questions synchronisées via Socket.io
6. Scores en temps réel
7. Podium final

## Développement

```bash
# Compiler le backend
cd backend && npm run build

# Vérifier les types TypeScript
cd backend && npx tsc --noEmit
```

---

وَقُل رَّبِّ زِدْنِي عِلْمًا — Ta-Ha 20:114
