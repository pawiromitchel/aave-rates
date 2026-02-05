# Aave Yield Overview

![image](https://github.com/user-attachments/assets/daa35c65-73c1-4c2f-aabf-fe6ec5f961df)

See where the highest yield is across multiple chains so you can maximize your profits.

View real-time AAVE supply and borrow APY for USDC, USDT, WETH, and DAI across:
- Ethereum
- Polygon
- Base
- Arbitrum
- Gnosis
- Optimism
- BNB Chain

## Tech Stack
- **Frontend:** Vanilla JS with ES modules
- **Styling:** Tailwind CSS + DaisyUI
- **Blockchain:** ethers.js v5 + AAVE contract helpers
- **Build:** esbuild for bundling
- **Deployment:** GitHub Pages (client-side only)

## Development

### Install Dependencies
```bash
npm install
```

### Build for Production
```bash
npm run build
```

This creates:
- `views/public/output.css` - Minified Tailwind CSS
- `views/public/app.bundle.js` - Bundled JavaScript with all dependencies

### Local Testing
```bash
# Build first
npm run build

# Serve static files
cd views/public
python3 -m http.server 8080
```

Open http://localhost:8080 in your browser.

## Deployment

This project automatically deploys to GitHub Pages via GitHub Actions.

**On every push to `main`:**
1. GitHub Actions builds the project
2. Deploys to `gh-pages` branch
3. Site goes live at `https://<username>.github.io/<repo-name>/`

### Manual Deployment

You can also trigger deployment manually:
1. Go to Actions tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Architecture

This is a **client-side only** application - all AAVE rate fetching happens in the browser:
- No backend server required
- RPC calls made directly from browser to blockchain nodes
- Uses public RPC endpoints (suitable for side projects)
- Initial load takes 10-30 seconds to fetch from all chains

## Notes

- RPC endpoints are public and rate-limited
- For production with high traffic, consider using a backend proxy with private RPC keys
- See `DEPLOYMENT.md` for more deployment options
