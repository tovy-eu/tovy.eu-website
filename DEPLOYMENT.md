# 🚀 Deployment Guide

Clean, organized Firebase deployments for the Tovy website.

## Quick Start

```bash
# Standard deployment (website + functions)
npm run deploy

# Deploy only website
npm run deploy:hosting

# Deploy only Cloud Functions
npm run deploy:functions

# Preview changes without deploying
npm run deploy:check
```

## Available Commands

| Command | Use Case | Output |
|---------|----------|--------|
| `npm run deploy` | Daily deployments | Clean, colored |
| `npm run deploy:hosting` | Frontend changes | Minimal output |
| `npm run deploy:functions` | Backend changes | Minimal output |
| `npm run deploy:all` | Full deployment with extensions | Full output |
| `npm run deploy:check` | Review changes before deploy | Preview mode |

## Deployment Scripts

### `scripts/deploy.sh` (Default)
- ✅ Builds website automatically
- ✅ Clean, filtered output with colors
- ✅ Shows only important information
- ✅ Displays URLs on completion

**Usage:**
```bash
npm run deploy
# or
./scripts/deploy.sh
```

### `scripts/deploy-quiet.sh` (CI/CD)
- ✅ Minimal output (errors only)
- ✅ Perfect for automated pipelines
- ✅ Fast and silent

**Usage:**
```bash
./scripts/deploy-quiet.sh
```

## What Gets Deployed

### Default (`npm run deploy`)
- 🌐 **Hosting**: Next.js website (static + dynamic)
- ⚙️ **Functions**: Cloud Functions
  - `checkAbandonmentEmails` - Scheduled task (every 15 min)

### Full (`npm run deploy:all`)
- 🌐 **Hosting**: Website
- ⚙️ **Functions**: Cloud Functions
- 🔒 **Firestore**: Security rules & indexes
- 🔧 **Extensions**: Firestore Send Email extension

## Deployment Workflow

### 1. Local Development
```bash
npm run dev                    # Start dev server
npm run build                  # Test production build
npm run typecheck              # Verify types
```

### 2. Commit Changes
```bash
git add .
git commit -m "Feature: description"
git push origin main
```

### 3. Deploy to Production
```bash
npm run deploy                 # Build + deploy
```

### 4. Verify Deployment
- Check Firebase Console: https://console.firebase.google.com/project/studio-5767764867-ecdbc/overview
- Test live site at: https://studio-5767764867-ecdbc.web.app
- Check Cloud Functions logs in Console

## Common Scenarios

### Only Updating Website Copy/Design
```bash
npm run deploy:hosting
```
**Time**: ~30 seconds

### Only Updating Cloud Functions
```bash
npm run deploy:functions
```
**Time**: ~20 seconds

### Updating Security Rules
```bash
npm run deploy:all
```
**Time**: ~1-2 minutes

### Before Major Release
```bash
npm run deploy:check    # Preview all changes
npm run deploy:all      # Full deployment with extensions
```

## Troubleshooting

### "Firebase CLI not found"
```bash
npm install -g firebase-tools
firebase login
```

### Deployment hangs
- Check internet connection
- Verify Firebase project is active
- Try: `npm run deploy:check` first

### Functions won't update
```bash
# Check functions build
cd functions && npm run build
# Then deploy
cd .. && npm run deploy:functions
```

### Need to see full output?
```bash
firebase deploy --only hosting,functions
# or for everything:
firebase deploy
```

## Environment Variables

Deployment uses:
- `.env` - Local development
- `.env.studio-5767764867-ecdbc` - Production secrets (Firebase managed)
- `extensions/firestore-send-email.env` - Email extension config

## Security

- ✅ No secrets in version control
- ✅ Sensitive values in Secret Manager
- ✅ Firestore rules prevent unauthorized access
- ✅ Functions authenticated by Google Cloud

## Performance

Typical deployment times:
- **Hosting only**: 30 seconds
- **Functions only**: 20 seconds  
- **Both**: 50 seconds
- **Full with extensions**: 2-3 minutes

## Additional Resources

- [Firebase Deployment Documentation](https://firebase.google.com/docs/hosting/deploying)
- [Cloud Functions Docs](https://cloud.google.com/functions/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
