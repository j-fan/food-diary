# Food Diary

A simple, mobile-first PWA for tracking meals and symptoms for multiple people. Data is stored as JSON files in this private GitHub repo, read and written via the GitHub API.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on push to `main`.

To enable: repo Settings > Pages > Source: "GitHub Actions".

## Authentication

The app uses a GitHub fine-grained Personal Access Token scoped to this repo with Contents read/write permission. The token is stored in the browser's localStorage and entered once per device.
