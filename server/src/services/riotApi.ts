import type { RiotAccount } from '../types.js'

export async function getAccountByRiotId(
  region: string,
  gameName: string,
  tagLine: string
): Promise<RiotAccount> {
  const response = await fetch(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
  )
  if (!response.ok) {
    throw new Error(`Account lookup failed: ${response.status}`)
  }
  return response.json() as Promise<RiotAccount>
}

export async function getMatchIds(
  region: string,
  puuid: string
): Promise<string[]> {
  const response = await fetch(
    `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
  )
  if (!response.ok) {
    throw new Error(`Match history lookup failed: ${response.status}`)
  }
  return response.json() as Promise<string[]>
}

export async function getMatchDetails(region: string, matchId: string) {
  const response = await fetch(
    `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchId}`,
    { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
  )
  if (!response.ok) {
    throw new Error(`Match detail lookup failed: ${response.status}`)
  }
  return response.json()
}
