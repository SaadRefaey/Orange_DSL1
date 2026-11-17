# Orange DSL – Physical Workflows Study Guide

Interactive study site built from the "Physical WF" deck: Line Down, Fiber Problem-MSAN, Line Unstable, Bad Line Parameters and Voice Problems.
Click the answer at each step (just like the arrows in the deck), see the SR code, Arabic script and escalation, and search everything.

## Run locally
```bash
npm install
npm run dev
```

## Deploy on GitHub Pages
1. Push this folder to a GitHub repo (branch `main`).
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` builds and publishes automatically.

## Edit content
All steps live in `src/data/flows.js`. Each node has a title, text, choices (`[label, nextId]`), and optional `sr` / `script`.
