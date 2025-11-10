# Chromafy – Fullstack Color Palette Generator (Auth + React + Node)

This project implements **authentication** (signup/login with JWT) and a **beautiful, interactive Color Palette Generator**.

## Folder Structure

```
fullstack-auth-app/
  backend/
  frontend/
  README.md
  .gitignore
```

Run backend and frontend separately.

## Quick Start

### 1) Backend
```bash
cd backend
cp .env .env.local   # optional; or edit .env directly
npm install
npm run dev          # starts http://localhost:5000
```
Edit `.env` and set `MONGO_URI` and `JWT_SECRET`. Default uses local MongoDB.

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev          # starts http://localhost:5173
```
Vite dev server proxies `/api` to `http://localhost:5000`.

## Features
- JWT auth (signup/login)
- Protected Home route
- Palette modes: Random, Monochrome, Analogous, Complementary, Triadic, Tetradic
- Copy HEX, contrast indicator (WCAG ratio)
- Save/delete palettes (localStorage)
- Modern UI with glassmorphism and gradients

## Notes
- Saving palettes is client-side for simplicity. You can add a `/api/palettes` resource later.
- Tip: Press **R** to randomize the base color.
