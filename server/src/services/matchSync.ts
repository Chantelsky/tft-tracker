import { getMatchIds, getMatchDetails, getRankedInfo } from "./riotApi.js";
import { transformMatch } from "../transform.js";
import { prisma } from "../db.js";

export async function syncMatchHistory(
  riotAccountId: string,
  matchRegion: string,
  displayRegion: string,
  puuid: string,
  platform: string,
) {
  const matchIds = await getMatchIds(matchRegion, puuid);

  for (const matchId of matchIds) {
    const rawMatch = await getMatchDetails(matchRegion, matchId);
    const participants = transformMatch(rawMatch);
    const me = participants.find((p) => p.puuid === puuid);

    if (!me) continue;

    const existing = await prisma.match.findFirst({
      where: { matchId, riotAccountId },
    });
    if (existing) continue;

    await prisma.match.create({
      data: {
        matchId,
        region: displayRegion,
        placement: me.placement,
        level: me.level,
        lastRound: me.lastRound,
        gameDatetime: new Date((rawMatch as any).info.game_datetime),
        riotAccountId,
        matchUnits: {
          create: me.units.map((u) => ({
            characterId: u.characterId,
            tier: u.tier,
            rarity: u.rarity,
          })),
        },
        matchTraits: {
          create: me.traits.map((t) => ({
            name: t.name,
            numUnits: t.numUnits,
            tierCurrent: t.tierCurrent,
            tierTotal: t.tierTotal,
          })),
        },
      },
    });
  }

  const rankedData = (await getRankedInfo(platform, puuid)) as any[];
  const ranked = rankedData.find(
    (entry: any) => entry.queueType === "RANKED_TFT",
  );

  if (ranked) {
    await prisma.lpSnapshot.create({
      data: {
        riotAccountId,
        tier: ranked.tier,
        rank: ranked.rank,
        leaguePoints: ranked.leaguePoints,
      },
    });
  }
}
