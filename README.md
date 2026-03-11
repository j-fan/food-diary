# Food Diary

A simple, mobile-first PWA for tracking meals and symptoms for multiple people. Data is stored as JSON files in a separate private repo ([food-diary-data](https://github.com/j-fan/food-diary-data)), read and written via the GitHub API.

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

The app uses a GitHub fine-grained Personal Access Token scoped to the `food-diary-data` repo with Contents read/write permission. The token is stored in the browser's localStorage and entered once per device.

## Demo Mode

Type `demo` into the PAT field on the login screen to try the app with mock data. Data is held in memory only and resets on page refresh.
