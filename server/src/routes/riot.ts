import { Router } from 'express';
import { getAccountByRiotId, getMatchIds, getMatchDetails } from '../services/riotApi.js';

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
        res.json(data);
    } catch (error) {
        console.error('Match detail lookup failed:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;