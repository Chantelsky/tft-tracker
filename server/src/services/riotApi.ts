import type { RiotAccount } from '../types.js';

// Account lookup (Riot ID -> PUUID) uses the "asia" regional cluster, even for OCE players. TFT match data uses "sea" instead (api/matches route)
export async function getAccountByRiotId(gameName: string, tagLine: string): Promise<RiotAccount> {
    const response = await fetch(
        `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
    );
    if (!response.ok) {
        throw new Error(`Account lookup failed: ${response.status}`);
    }
    return response.json() as Promise<RiotAccount>
}

export async function getMatchIds(puuid: string): Promise<string[]> {
    const response = await fetch(
        `https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
    );
    if (!response.ok) {
        throw new Error(`Match history lookup failed: ${response.status}`);
    }
    return response.json() as Promise<string[]>
}

export async function getMatchDetails(matchId: string) {
    const response = await fetch(
        `https://sea.api.riotgames.com/tft/match/v1/matches/${matchId}`,
        { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY! } }
    );
    if (!response.ok) {
        throw new Error(`Match detail lookup failed: ${response.status}`);
    }
    return response.json()
}