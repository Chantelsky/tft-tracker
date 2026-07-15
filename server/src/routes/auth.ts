import { Router } from "express";
import { signup, login } from "../services/auth.js";
import { requireAuth } from "../middleware/auth.js";
import {
  getAccountByRiotId,
  getRankedInfo,
  getSummonerInfo,
} from "../services/riotApi.js";
import { prisma } from "../db.js";
import { REGION_MAP } from "../services/regions.js";
import { syncMatchHistory } from "../services/matchSync.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await signup(email, password);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user: result.user });
  } catch (error) {
    if ((error as Error).message === "Email already in use") {
      res.status(400).json({ error: (error as Error).message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: result.user });
  } catch (error) {
    if ((error as Error).message === "Invalid credentials") {
      res.status(401).json({ error: (error as Error).message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Fetching user failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/link-riot-account", requireAuth, async (req, res) => {
  const { gameName, tagLine, region } = req.body;
  const userId = req.userId;
  const regionData = REGION_MAP[region];

  if (!regionData) {
    return res.status(400).json({ error: "Invalid region" });
  }

  try {
    const account = await getAccountByRiotId(
      regionData.account,
      gameName,
      tagLine,
    );
    const riotAccount = await prisma.riotAccount.create({
      data: {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
        region: region,
        userId: userId!,
      },
    });

    res.status(201).json(riotAccount);
  } catch (error) {
    console.error("Linking Riot account failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

router.get("/me/riot-account", requireAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const riotAccount = await prisma.riotAccount.findFirst({
      where: { userId: req.userId },
    });

    if (!riotAccount) {
      return res.json(null);
    }

    const regionData = REGION_MAP[riotAccount.region];

    if (!regionData) {
      return res.status(400).json({ error: "Invalid region" });
    }

    const [rankedInfo, summonerInfo] = await Promise.all([
      getRankedInfo(regionData.platform, riotAccount.puuid),
      getSummonerInfo(regionData.platform, riotAccount.puuid),
    ]);

    res.json({ ...riotAccount, rankedInfo, summonerInfo });
  } catch (error) {
    console.error("Fetching linked Riot account failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/me/sync-matches", requireAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const riotAccount = await prisma.riotAccount.findFirst({
      where: { userId: req.userId },
    });

    if (!riotAccount) {
      return res.status(404).json({ error: "Riot account not found" });
    }

    const regionData = REGION_MAP[riotAccount.region];

    if (!regionData) {
      return res.status(400).json({ error: "Invalid region" });
    }
    await syncMatchHistory(
      riotAccount.id,
      regionData.match,
      riotAccount.region,
      riotAccount.puuid,
      regionData.platform,
    );

    res.status(200).json({ message: "Match history sync started" });
  } catch (error) {
    console.error("Syncing match history failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me/analytics", requireAuth, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const riotAccount = await prisma.riotAccount.findFirst({
      where: { userId: req.userId },
    });

    if (!riotAccount) {
      return res.status(404).json({ error: "Riot account not found" });
    }

    const matches = await prisma.match.findMany({
      where: { riotAccountId: riotAccount.id },
      orderBy: { gameDatetime: "desc" },
      include: {
        matchUnits: true,
        matchTraits: true,
      },
    });

    let totalPlacement = 0;
    let top4Count = 0;
    let winCount = 0;
    for (const match of matches) {
      totalPlacement += match.placement;
      if (match.placement <= 4) top4Count++;
      if (match.placement === 1) winCount++;
    }

    const gamesTracked = matches.length;
    const avgPlacement = gamesTracked > 0 ? totalPlacement / gamesTracked : 0;
    const top4Rate =
      gamesTracked > 0 ? Math.round((top4Count / gamesTracked) * 100) : 0;
    const winRate =
      gamesTracked > 0 ? Math.round((winCount / gamesTracked) * 100) : 0;

    const championStats: Record<string, { count: number; top4: number }> = {};
    for (const match of matches) {
      for (const unit of match.matchUnits) {
        if (!championStats[unit.characterId]) {
          championStats[unit.characterId] = { count: 0, top4: 0 };
        }
        championStats[unit.characterId]!.count++;
        if (match.placement <= 4) championStats[unit.characterId]!.top4++;
      }
    }
    const worstChampions = Object.entries(championStats)
      .filter(([_, stats]) => stats.count >= 10)
      .map(([characterId, stats]) => ({
        characterId,
        top4Rate: Math.round((stats.top4 / stats.count) * 100),
        gamesPlayed: stats.count,
      }))
      .sort((a, b) => a.top4Rate - b.top4Rate)
      .slice(0, 5);

    const traitStats: Record<string, { count: number; top4: number }> = {};
    for (const match of matches) {
      for (const trait of match.matchTraits) {
        if (!traitStats[trait.name]) {
          traitStats[trait.name] = { count: 0, top4: 0 };
        }
        traitStats[trait.name]!.count++;
        if (match.placement <= 4) traitStats[trait.name]!.top4++;
      }
    }
    const worstTraits = Object.entries(traitStats)
      .filter(([_, stats]) => stats.count >= 10)
      .map(([name, stats]) => ({
        name,
        top4Rate: Math.round((stats.top4 / stats.count) * 100),
        gamesPlayed: stats.count,
      }))
      .sort((a, b) => a.top4Rate - b.top4Rate)
      .slice(0, 5);

    const lpSnapshots = await prisma.lpSnapshot.findMany({
      where: { riotAccountId: riotAccount.id },
      orderBy: { recordedAt: "asc" },
    });

    res.json({
      stats: { avgPlacement, top4Rate, gamesTracked, winRate },
      worstChampions,
      worstTraits,
      lpHistory: lpSnapshots.map((s) => ({
        leaguePoints: s.leaguePoints,
        recordedAt: s.recordedAt,
      })),
      recentMatches: matches.slice(0, 5).map((m) => ({
        matchId: m.matchId,
        placement: m.placement,
        level: m.level,
        units: m.matchUnits,
      })),
    });
  } catch (error) {
    console.error("Fetching analytics failed:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
