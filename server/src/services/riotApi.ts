import type { RiotAccount } from "../types.js";

export async function getAccountByRiotId(
  region: string,
  gameName: string,
  tagLine: string,
): Promise<RiotAccount> {
  const response = await fetch(
    `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    { headers: { "X-Riot-Token": process.env.RIOT_API_KEY! } },
  );
  if (!response.ok) {
    throw new Error(`Account lookup failed: ${response.status}`);
  }
  return response.json() as Promise<RiotAccount>;
}

export async function getMatchIds(
  region: string,
  puuid: string,
): Promise<string[]> {
  const response = await fetch(
    `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`,
    { headers: { "X-Riot-Token": process.env.RIOT_API_KEY! } },
  );
  if (!response.ok) {
    throw new Error(`Match history lookup failed: ${response.status}`);
  }
  return response.json() as Promise<string[]>;
}

export async function getMatchDetails(region: string, matchId: string) {
  const response = await fetch(
    `https://${region}.api.riotgames.com/tft/match/v1/matches/${matchId}`,
    { headers: { "X-Riot-Token": process.env.RIOT_API_KEY! } },
  );
  if (!response.ok) {
    throw new Error(`Match detail lookup failed: ${response.status}`);
  }
  return response.json();
}

export async function getRankedInfo(platform: string, puuid: string) {
  const url = `https://${platform}.api.riotgames.com/tft/league/v1/by-puuid/${puuid}`;
  const response = await fetch(url, {
    headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
  });
  if (!response.ok) {
    throw new Error(`Ranked info lookup failed: ${response.status}`);
  }
  return response.json();
}

export async function getSummonerInfo(platform: string, puuid: string) {
  const url = `https://${platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`;
  const response = await fetch(url, {
    headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
  });
  if (!response.ok) {
    throw new Error(`Summoner info lookup failed: ${response.status}`);
  }
  return response.json();
}
