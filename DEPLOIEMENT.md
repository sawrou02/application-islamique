# Guide de Déploiement — Quiz Islamique

## 1. Backend sur Railway

### Étapes

1. **Créer un compte Railway** : https://railway.app

2. **Nouveau projet** → "Deploy from GitHub repo" → sélectionner `sawrou02/application-islamique`

3. **Configurer le service backend** :
   - Root Directory : `backend`
   - Build Command : `npm ci && npm run build`
   - Start Command : `node dist/src/index.js`

4. **Ajouter PostgreSQL** : dans le projet Railway → "+ New" → "Database" → "PostgreSQL"
   - Railway injecte automatiquement `DATABASE_URL`

5. **Ajouter Redis** : "+ New" → "Database" → "Redis"
   - Railway injecte automatiquement `REDIS_URL`

6. **Variables d'environnement** (Settings → Variables) :
   ```
   NODE_ENV=production
   JWT_SECRET=<générer avec: openssl rand -base64 64>
   JWT_EXPIRES_IN=7d
   PORT=3000
   ```

7. **Lancer les migrations** : une fois déployé, aller dans le terminal Railway et exécuter :
   ```bash
   node -e "require('./dist/migrations/run.js')"
   ```
   Ou via le script npm : `npm run migrate` (en mode ts-node dans le terminal Railway)

8. **URL du backend** : sera du type `https://quiz-islamique-backend.up.railway.app`

---

## 2. Mobile sur Expo EAS

### Prérequis

```bash
npm install -g eas-cli
eas login   # compte Expo requis : https://expo.dev
```

### Configurer l'URL du backend

Dans `mobile/eas.json`, remplacer l'URL Railway obtenue à l'étape précédente :
```json
"EXPO_PUBLIC_API_URL": "https://TON-PROJET.up.railway.app/api"
```

Dans `mobile/app.json`, remplacer :
- `REMPLACER_PAR_TON_EXPO_USERNAME` → ton pseudo Expo
- `REMPLACER_PAR_TON_EAS_PROJECT_ID` → obtenu après `eas init`

### Build APK Android (test interne)

```bash
cd mobile
eas init                    # crée le projet sur expo.dev
eas build --platform android --profile preview
```

Le build génère un fichier `.apk` téléchargeable directement sur Android.

### Build production (App Store / Play Store)

```bash
eas build --platform all --profile production
eas submit --platform android   # soumet sur Google Play
eas submit --platform ios       # soumet sur App Store
```

---

## 3. Admin Panel

L'admin panel est servi automatiquement par le backend à :
```
https://TON-PROJET.up.railway.app/admin
```

Credentials : créer un compte utilisateur puis changer son rôle en base :
```sql
UPDATE users SET role = 'admin' WHERE email = 'ton@email.com';
```

---

## 4. Résumé des URLs

| Service | URL |
|---------|-----|
| Backend API | `https://TON-PROJET.up.railway.app/api` |
| Admin Panel | `https://TON-PROJET.up.railway.app/admin` |
| Health check | `https://TON-PROJET.up.railway.app/health` |
| App mobile | Via Expo Go ou APK téléchargé |
