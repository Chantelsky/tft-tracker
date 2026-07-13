import { Router } from "express";
import { signup, login } from "../services/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { getAccountByRiotId } from "../services/riotApi.js";
import { prisma } from "../db.js";
import { REGION_MAP } from "../services/regions.js";

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

export default router;
