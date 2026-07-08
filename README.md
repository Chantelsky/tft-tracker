# TFT Comp Tracker

A full-stack app to track Teamfight Tactics match history and build team comps.

## Stack

- **Frontend:** Vue 3, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **API:** Riot Games API

## Status

🚧 Early development — backend setup in progress.

## Setup

### Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with:
```bash
PORT=3000
RIOT_API_KEY=your_key_here
```
Get a development API key from the [Riot Developer Portal](https://developer.riotgames.com). Note: development keys expire every 24 hours and need to be regenerated.

Then run:

```bash
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```
