# Configuration Netlify pour Visual Editing

## Problème : Plugin Lighthouse incompatible

Le plugin `@netlify/plugin-lighthouse` installé via l'UI Netlify n'est **pas compatible avec Node 18+**.

Netlify utilise Node 22 par défaut, mais nous avons besoin de Node 18 pour compatibilité.

## Solution : Désactiver le plugin Lighthouse

### Étape 1 : Retirer le plugin depuis l'interface Netlify

1. Allez sur https://app.netlify.com/sites/charpenteboisdebout
2. **Site Settings** → **Plugins**
3. Trouvez **@netlify/plugin-lighthouse**
4. Cliquez sur les **3 points** → **Remove plugin**
5. Confirmez la suppression

### Étape 2 : Vérifier la version Node

1. **Site Settings** → **Build & Deploy** → **Environment**
2. Vérifiez que `NODE_VERSION` est bien à **18**
3. Si absent, ajoutez-le :
   - Key: `NODE_VERSION`
   - Value: `18`

### Étape 3 : Redéployer

1. **Deploys** → **Trigger deploy** → **Deploy site**
2. Le build devrait maintenant fonctionner avec Node 18

## Alternative : Lighthouse via Netlify Analytics

Si vous voulez quand même des scores Lighthouse, utilisez plutôt :

### Option 1 : Netlify Analytics (payant)
- Intégré directement dans Netlify
- Pas besoin de plugin
- Fonctionne avec n'importe quelle version de Node

### Option 2 : GitHub Actions
Créez un workflow GitHub pour exécuter Lighthouse à chaque PR :

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://charpenteboisdebout.fr
```

### Option 3 : Lighthouse CLI en local
```bash
# Installer Lighthouse
npm install -g lighthouse

# Analyser le site
lighthouse https://charpenteboisdebout.fr --view
```

## Configuration actuelle

Fichiers configurés :
- ✅ `.nvmrc` → Node 18
- ✅ `.node-version` → Node 18 (prioritaire pour Netlify)
- ✅ `netlify.toml` → NODE_VERSION = "18"

Build commands :
- **Dev** : `pnpm dev` (avec TinaCMS)
- **Local** : `pnpm build` (sans TinaCMS)
- **Prod** : `pnpm build:tina` (avec TinaCMS)

## Déploiement avec Visual Editing

### Prérequis

1. **Pusher sur GitHub** (pour que TinaCloud indexe le nouveau schéma)
   ```bash
   git add .
   git commit -m "feat: add visual editing + fix Netlify config"
   git push origin main
   ```

2. **TinaCloud va indexer** automatiquement les nouveaux fichiers

3. **Netlify va builder** avec `pnpm build:tina`

### Variables d'environnement Netlify

Vérifiez que ces variables sont bien configurées :

**TinaCMS :**
- `TINA_CLIENT_ID` : 3f6b5893-f77a-4f93-a595-ec18a27e0dfc
- `TINA_TOKEN` : (votre token Tina)

**Autres :**
- `NODE_VERSION` : 18
- (vos autres variables existantes)

## Dépannage

### Build échoue avec "schema doesn't match"

C'est normal au premier déploiement. TinaCloud doit indexer le repo GitHub.

**Solution :**
1. Attendez 2-3 minutes après le push GitHub
2. TinaCloud indexe automatiquement
3. Relancez le build Netlify

### Build échoue avec "fetch failed" pour TinaCMS

C'est normal en build local (`pnpm build`).

**Solution :**
- Utilisez `pnpm build:tina` sur Netlify (déjà configuré)
- Le build local utilise le fallback automatique

### Node version toujours incorrecte

**Solution :**
1. Vérifiez qu'il n'y a pas de `NODE_VERSION` dans les variables Netlify UI qui surcharge
2. Supprimez toute config Node dans l'UI
3. Laissez `.node-version` gérer la version

## Résultat attendu

Une fois configuré :
- ✅ Build Netlify avec Node 18
- ✅ Visual editing fonctionnel sur toutes les réalisations
- ✅ Interface admin accessible sur `/admin`
- ✅ Pas d'erreur de plugin Lighthouse
