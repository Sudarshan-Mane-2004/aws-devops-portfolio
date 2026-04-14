# Sudarshan Sidram Mane - Premium DevOps Portfolio

Apple-level React portfolio with 3D effects, particles, DevOps dashboard, terminal mode, and AI chatbot integration.

## Stack

- React + Vite + Tailwind CSS
- Framer Motion + Three.js + tsParticles
- Recharts (Grafana-style dashboard charts)
- Express backend (`/api/metrics`, `/api/chat`)
- OpenAI API support for chatbot

## Quick Start

```bash
npm install
npm run dev:full
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`

## Environment

Copy `.env.example` to `.env` and configure:

- `OPENAI_API_KEY` for real chatbot responses
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `PORT` for backend API
- `VITE_API_BASE_URL` for production API URL (Render/Railway)

## Deployment

- Frontend: Netlify (`netlify.toml` included)
- Backend: Render or Railway (run `npm run start:server`)
