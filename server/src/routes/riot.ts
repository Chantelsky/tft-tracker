import { Router } from 'express';
import { getAccountByRiotId, getMatchIds, getMatchDetails } from '../services/riotApi.js';
import { transformMatch } from '../transform.js';
import type { MatchSummaryEntry } from '../types.js';

const router = Router();

router.get('/account/:gameName/:tagLine', async (req, res) => {
    const { gameName, tagLine } = req.params;

    try {
        const data = await getAccountByRiotId(gameName, tagLine);
        res.json(data);
    } catch (error) {
        console.error('Account lookup failed:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/matches/:puuid', async (req, res) => {
    const { puuid } = req.params;

    try {
        const data = await getMatchIds(puuid);
        res.json(data);
    } catch (error) {
        console.error('Match history lookup failed:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/match/:matchId', async (req, res) => {
    const { matchId } = req.params;

    try {
        const data = await getMatchDetails(matchId);
        const participants = transformMatch(data)
        res.json(participants);
    } catch (error) {
        console.error('Match detail lookup failed:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/summary/:gameName/:tagLine', async (req, res) => {
    const { gameName, tagLine } = req.params
    const count = Number(req.query.count) || 5

    try {
        const account = await getAccountByRiotId(gameName, tagLine)
        const matchIds = await getMatchIds(account.puuid)
        const recentMatchIds = matchIds.slice(0, count)

        const matches: MatchSummaryEntry[] = await Promise.all(
            recentMatchIds.map(async (matchId: string): Promise<MatchSummaryEntry> => {
                const rawMatch = await getMatchDetails(matchId)
                const participants = transformMatch(rawMatch)
                const me = participants.find((p) => p.puuid === account.puuid)
                return { matchId, ...me! }
            })
        )

        res.json({ account, matches })
    } catch (error) {
        console.error('Summary lookup failed:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

export default router;