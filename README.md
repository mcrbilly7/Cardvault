# Card Vault 🃏

Your personal AI-powered sports card collection manager.

## Features
- 📸 Scan cards with your camera or upload photos (front + back)
- 🤖 AI identifies player, year, brand, parallel, serial number automatically
- 📁 Organize with folders (custom cover photos)
- ⭐ Wishlist with eBay sold links
- 🏆 Leaderboard of top collections
- 📊 Stats & insights
- 🌙 Light + Dark mode
- 📤 Export to CSV

## Deploy to Vercel (recommended — free, takes 2 minutes)

1. **Create a free account** at [vercel.com](https://vercel.com)
2. **Push to GitHub** (see below) or use Vercel CLI
3. In Vercel dashboard → **New Project** → Import your GitHub repo
4. Click **Deploy** — done!

Your app will be live at `https://your-project-name.vercel.app` with full camera access.

### Using Vercel CLI (fastest)
```bash
npm i -g vercel
cd cardvault-deploy
vercel
```

## Deploy to GitHub Pages (also free)

1. Create a new GitHub repo (e.g. `card-vault`)
2. Upload `index.html` to the repo root
3. Go to **Settings → Pages**
4. Set source to **Deploy from branch → main → / (root)**
5. Your app will be at `https://yourusername.github.io/card-vault`

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial Card Vault deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/card-vault.git
git push -u origin main
```

## Local development

Just open `index.html` in a browser. Camera requires HTTPS (use Vercel/GitHub Pages) but photo upload works locally.

## Admin Login

- Email: `noskoshop@gmail.com`
- Password: `nosson101`

## Tech Stack

- React 18 (loaded from CDN)
- Babel Standalone (JSX compilation)
- Claude claude-sonnet-4-20250514 API (card recognition)
- Pure HTML — no build step required
