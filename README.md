# Tactician's Desk

A full-stack app to track match history, view detailed match breakdowns, and analyze personal performance for [Teamfight Tactics](https://teamfighttactics.leagueoflegends.com/) (TFT), Riot Games' auto-battler.

## Features

- **Search** — look up any player's recent matches by Riot ID and region
- **Match detail** — full 8-player lobby breakdown with units, items, traits, and star levels
- **Auth** — signup/login with httpOnly cookie sessions
- **Personal analytics dashboard** — link your own Riot account to track:
  - Average placement, top 4 rate, win rate
  - LP over time
  - Worst-performing champions and traits (min. 10 games)
  - Recent synced match history

## Screenshots

### Login/Sign Up
<img width="1304" height="911" alt="localhost_5173_ (3)" src="https://github.com/user-attachments/assets/081e2a25-b9a2-4561-b62e-cb5ae39a67ff" />

<img width="1304" height="911" alt="localhost_5173_ (4)" src="https://github.com/user-attachments/assets/b7594679-83fb-4d2c-819d-8bb8503ecb8b" />

### Search
<img width="1304" height="911" alt="localhost_5173_" src="https://github.com/user-attachments/assets/e2b9d0d2-aa51-462e-b90f-6ca948ca39ce" />
<img width="1289" height="977" alt="localhost_5173_ (1)" src="https://github.com/user-attachments/assets/51e5bdd5-e6da-4c59-8829-522d91f131d2" />

### Match Detail
<img width="1304" height="911" alt="localhost_5173_match_OCE_OC1_705514798" src="https://github.com/user-attachments/assets/37b885c1-4aba-4af0-bc9b-58c5efccfe2e" />

### Link Riot Account
<img width="1304" height="911" alt="localhost_5173_ (5)" src="https://github.com/user-attachments/assets/d68f79b4-4a34-4a8e-93c2-2f1557d90601" />

### Analytics Dashboard
<img width="1289" height="1205" alt="localhost_5173_ (2)" src="https://github.com/user-attachments/assets/8e4ca5c6-42b7-46cc-9cf0-670eeffcd9e9" />

## Stack

- **Frontend:** Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router, Chart.js
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL (Neon)
- **API:** Riot Games API (account-v1, match-v1, league-v1, summoner-v1)
- **Testing:** Vitest
- **CI:** GitHub Actions
- **Structure:** npm workspaces monorepo with a shared types package

## Project structure

```
tft-tracker/
  client/               # Vue 3 frontend
  server/                # Express backend
  packages/shared-types/ # Shared TypeScript types
```

## Setup

### Prerequisites
- Node.js 18+
- A [Riot Games API key](https://developer.riotgames.com)
- A [Neon](https://neon.tech) Postgres database (or any Postgres instance)

### Install
From the project root:

```bash
npm install
```

### Backend

Create `server/.env`:

```
PORT=3000
RIOT_API_KEY=your_key_here
DATABASE_URL=your_pooled_neon_connection_string
DIRECT_URL=your_direct_neon_connection_string
JWT_SECRET=a_long_random_string
```

Run migrations:

```bash
cd server
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

## Testing

```bash
cd server && npm run test
cd client && npm run test
```
