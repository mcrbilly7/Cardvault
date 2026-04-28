# Card Vault

AI-powered sports card collection manager.

## Deploy to Vercel

### Step 1 — Push to GitHub
  git init
  git add .
  git commit -m "Card Vault"
  git branch -M main
  git remote add origin https://github.com/YOUR_USERNAME/card-vault.git
  git push -u origin main

Then: vercel.com → New Project → Import repo → Deploy

Or use CLI:
  npm i -g vercel
  vercel

### Step 2 — Add your OpenRouter API key (REQUIRED for scanning)
1. Vercel dashboard → your project → Settings → Environment Variables
2. Name:  OPENROUTER_API_KEY
   Value: sk-or-your-key-here
3. Save → Deployments → Redeploy

Done! Card scanning will now work.

## Admin Login
Email:    noskoshop@gmail.com
Password: nosson101

## Files
  index.html        - Full app
  api/analyze.js    - OpenRouter proxy (keeps API key secret)
  vercel.json       - Routing
  package.json      - Node version
