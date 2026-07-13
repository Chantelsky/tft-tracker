import { Router } from 'express'
import {
  getAccountByRiotId,
  getMatchIds,
  getMatchDetails,
} from '../services/riotApi.js'
import { transformMatch } from '../transform.js'
import { REGION_MAP } from '../services/regions.js'
import type { MatchSummaryEntry } from '../types.js'

const router = Router()

router.get('/account/:region/:gameName/:tagLine', async (req, res) => {
  const { region, gameName, tagLine } = req.params
  const regionData = REGION_MAP[region]

  if (!regionData) {
    return res.status(400).json({ error: 'Invalid region' })
  }

  try {
    const data = await getAccountByRiotId(regionData.account, gameName, tagLine)
    res.json(data)
  } catch (error) {
    console.error('Account lookup failed:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/matches/:region/:puuid', async (req, res) => {
  const { region, puuid } = req.params
  const regionData = REGION_MAP[region]

  if (!regionData) {
    return res.status(400).json({ error: 'Invalid region' })
  }

  try {
    const data = await getMatchIds(regionData.match, puuid)
    res.json(data)
  } catch (error) {
    console.error('Match history lookup failed:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/match/:region/:matchId', async (req, res) => {
  const { region, matchId } = req.params
  const regionData = REGION_MAP[region]

  if (!regionData) {
    return res.status(400).json({ error: 'Invalid region' })
  }

  try {
    const data = await getMatchDetails(regionData.match, matchId)
    const participants = transformMatch(data)
    res.json(participants)
  } catch (error) {
    console.error('Match detail lookup failed:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/summary/:region/:gameName/:tagLine', async (req, res) => {
  const { region, gameName, tagLine } = req.params
  const regionData = REGION_MAP[region]

  if (!regionData) {
    return res.status(400).json({ error: 'Invalid region' })
  }

  const count = Number(req.query.count) || 5

  try {
    const account = await getAccountByRiotId(
      regionData.account,
      gameName,
      tagLine
    )
    const matchIds = await getMatchIds(regionData.match, account.puuid)
    const recentMatchIds = matchIds.slice(0, count)

    const matches: MatchSummaryEntry[] = await Promise.all(
      recentMatchIds.map(
        async (matchId: string): Promise<MatchSummaryEntry> => {
          const rawMatch = await getMatchDetails(regionData.match, matchId)
          const participants = transformMatch(rawMatch)
          const me = participants.find((p) => p.puuid === account.puuid)
          return { matchId, ...me! }
        }
      )
    )

    res.json({ account, matches })
  } catch (error) {
    console.error('Summary lookup failed:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
