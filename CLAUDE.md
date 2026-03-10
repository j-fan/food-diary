# Claude Code Notes

## Project
- Mobile-first food diary PWA (React + Vite)
- App repo is public, deployed via GitHub Pages (Actions workflow)
- Data lives in a separate private repo: `j-fan/food-diary-data`
- Data files (at repo root of data repo): `entries.json`, `ingredients.json`, `symptoms.json`, `people.json`
- GitHub API service in `src/services/github.js` — all reads/writes go to `food-diary-data`
- Auth: fine-grained GitHub PAT scoped to data repo, stored in browser localStorage

## Commands
- `pnpm install` / `pnpm dev` / `pnpm build`
- Deploy is automatic via GitHub Actions on push to main

## Style
- Hand-drawn aesthetic using Caveat font and subtle asymmetric border-radius
- Keep the wobble subtle, not extreme
- Mobile-first, test on Safari iOS (datetime inputs can overflow)

## Preferences
- Use pnpm
- Keep it simple — avoid over-engineering
- Use `agent-browser` CLI for browser testing (not an MCP)
